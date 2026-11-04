#!/usr/bin/env python3
"""Local mobile funnel audit. Requires Python 3.10+ and Playwright >= 1.48.

Install: python -m pip install playwright
         python -m playwright install chromium
Usage: audit-mobile-flows.py <base-url> <out-dir> <locale> [slug...]
                            [--seed first|last]

CAVEATS
- Read-only session: this diff is unapplied. JS/Python syntax was checked in
  memory; browser behavior and mobile layout remain unverified.
- result_share_top/result_next_top use document CSS pixels (top + scrollY),
  or null if absent. Next top includes the recommendation-rail anchor and
  landing links; next_test_links still counts only landing links.
- base-url is an origin (http[s]://localhost or a literal loopback IP, with
  optional port). Only same-origin HTTP(S) resources are allowed; analytics
  and advertising paths are blocked even on that origin. All WebSockets,
  service workers, external CSS/fonts/scripts and redirects are blocked.
  Missing CDN CSS/scripts can affect layout or prevent a real flow completing.
- --seed chooses the first run's endpoint; the other endpoint runs second.
  Every question uses its first or last DOM option, without random sampling.
- Personality/love/work/communication pages already show questions: they have
  no start button. Their first CTA is Next; it is clicked after answering.
  Friend/marriage CTAs lead to the shared compatibility page. Prefer its
  visible birthday fast path when present (currently ko); otherwise answer
  the detailed questionnaire. Closed optional birthday details stay closed.
- Each JSONL row contains two runs. input_fields counts distinct rendered
  non-radio input/select/textarea controls encountered before the result;
  question_count counts answered radio groups or single-question screens
  (detailed compatibility: 16; birthday fast path: 0, no question-3 image).
- CTA top is viewport CSS pixels at scrollY=0, even below the fold. Progress
  and horizontal overflow are observed across visited screens. Result counts
  cover rendered controls/links, including those below the fold; next links
  point to another supported test's landing page, excluding navigation/footer.
- Result text compares only populated identity/title/description fields, not
  timestamps or sharing copy. Identical results are reported, not a failure:
  life-summary is birthday-based, and identical partner answers may give the
  same compatibility score at either endpoint. The fast path uses the same
  fake birthdays for both seeds, so identical results there are expected.
- Consent is rejected once after the initial load via the DOM click handler,
  then banner detachment is awaited. consent_button_in_viewport is null if
  absent, otherwise full viewport containment before dismissal; it does not
  prove hit testing or a successful touch. Consent persists across navigation.
- Input/click/check/select actions retry once with force only on a Playwright
  timeout reporting an unstable/moving element; other errors remain failures.
- Start/question/result selectors were checked against the local locale pages
  and their scripts; no production URL was contacted.
- Screenshots are viewport PNGs per run; question-3 is taken before its answer.
  Failed runs retain available screenshots and attempt a failure screenshot.
  Browser execution has not been verified in this read-only patch session.
"""
import argparse
import ipaddress
import json
import re
import sys
import time
from pathlib import Path
from urllib.parse import urlsplit

SLUGS = (
    "personality-type", "love-type", "work-style", "communication-style",
    "age-calculator", "life-summary", "kpop-match", "vibe-check",
    "compatibility", "friend-compatibility", "marriage-compatibility",
)
LIKERT = {"personality-type", "love-type", "work-style", "communication-style"}
DERIVATIVES = {"friend-compatibility", "marriage-compatibility"}
TRACKING = re.compile(
    r"(?:analytics|adsbygoogle|googletag|doubleclick|"
    r"(?:^|/)(?:ads?|collect|g/collect|beacon|telemetry)(?:/|$))", re.I
)
START = {
    "personality-type": "#pt-next",
    "love-type": "#pt-next",
    "work-style": "#pt-next",
    "communication-style": "#pt-next",
    "age-calculator": '[onclick="goToStep(2)"]',
    "life-summary": '#life-summary-form button[type="submit"]',
    "kpop-match": '[onclick="km_start()"]',
    "vibe-check": '[onclick="vc_start()"]',
    "compatibility": '#compatibility-form button[type="submit"]',
}
IDENTITY = {
    "personality-type": "#pt-type-code, #pt-type-name, #pt-type-tagline",
    "love-type": "#lt-type-code, #lt-type-name, #lt-type-tagline",
    "work-style": "#lt-type-code, #lt-type-name, #lt-type-tagline",
    "communication-style": "#lt-type-code, #lt-type-name, #lt-type-tagline",
    "age-calculator": "main h1, #mental-age, #energy-age, #overall-summary",
    "life-summary": "#life-summary, #core-trait, #life-phase, #lucky-element",
    "kpop-match": "#r-name, #r-tagline, #r-description",
    "vibe-check": "#r-name, #r-tagline, #r-description",
    "compatibility": "main h1, #relationship-type, #animal-couple-title",
}
READY = {
    "personality-type": "#pt-result-content #pt-type-code",
    "love-type": "#lt-result-section #lt-type-name",
    "work-style": "#lt-result-section #lt-type-name",
    "communication-style": "#lt-result-section #lt-type-name",
    "age-calculator": "#mental-age",
    "life-summary": "#life-summary",
    "kpop-match": "#result-stage #r-name",
    "vibe-check": "#result-stage #r-name",
    "compatibility": "#relationship-type",
}
VISIBLE_JS = """el => {
    if (el.closest('.hidden, [hidden], [aria-hidden="true"]')) return false;
    // Chromium can give controls inside closed details a nonempty rect.
    for (let node = el.parentElement; node; node = node.parentElement) {
        if (node.tagName === 'DETAILS' && !node.open &&
            !node.querySelector(':scope > summary')?.contains(el)) return false;
    }
    return !!el.getClientRects().length &&
        getComputedStyle(el).visibility !== 'hidden';
}"""


def local_origin(value):
    try:
        u = urlsplit(value)
        host = u.hostname
        valid = host == "localhost"
        if not valid and host:
            valid = ipaddress.ip_address(host).is_loopback
        if (u.scheme not in ("http", "https") or not valid or
                u.username is not None or u.password is not None or
                u.path not in ("", "/") or u.query or u.fragment):
            raise ValueError()
        port = u.port or (443 if u.scheme == "https" else 80)
        return u, (u.scheme, host, port)
    except ValueError:
        raise argparse.ArgumentTypeError(
            "base-url must be a local loopback HTTP(S) origin"
        ) from None


def origin_of(value):
    try:
        u = urlsplit(value)
        return u.scheme, u.hostname, u.port or (
            443 if u.scheme == "https" else 80
        )
    except ValueError:
        return None


def visible(locator):
    return locator.count() > 0 and locator.first.evaluate(VISIBLE_JS)


def act(locator, method, *args):
    from playwright.sync_api import TimeoutError as PlaywrightTimeoutError

    action = getattr(locator, method)
    try:
        return action(*args)
    except PlaywrightTimeoutError as error:
        if not re.search(r"element is (?:not stable|moving)", str(error), re.I):
            raise
        return action(*args, force=True)


def start_selector(page, slug):
    if slug == "compatibility" and visible(page.locator("#fast-submit")):
        return "#fast-submit"
    return START[slug]


def reject_consent(page, run):
    run["consent_button_in_viewport"] = page.evaluate("""() => {
        const button = document.querySelector('#consent-reject');
        if (!button) return null;
        const r = button.getBoundingClientRect();
        const inViewport = r.width > 0 && r.height > 0 &&
            getComputedStyle(button).visibility !== 'hidden' &&
            r.top >= 0 && r.left >= 0 &&
            r.bottom <= innerHeight && r.right <= innerWidth;
        button.click();
        return inViewport;
    }""")
    if run["consent_button_in_viewport"] is not None:
        page.locator("#consent-banner").wait_for(state="detached")


def observe(page, run, fields, count_inputs=True):
    snapshot = page.evaluate("""countInputs => {
        const visible = (""" + VISIBLE_JS + """);
        const controls = countInputs ? [...document.querySelectorAll(
            'main input:not([type=radio]):not([type=checkbox])' +
            ':not([type=hidden]):not([type=submit]):not([type=button]),' +
            'main select, main textarea'
        )] : [];
        return {
            path: location.pathname,
            fields: controls.filter(visible).map(el =>
                el.id || el.name || el.outerHTML),
            overflow: Math.max(document.documentElement.scrollWidth,
                document.body?.scrollWidth || 0) > 390,
            progress: [...document.querySelectorAll(
                '#pt-progress-text, #question-progress, #q-counter,' +
                '[role=progressbar], progress'
            )].some(visible)
        };
    }""", count_inputs)
    fields.update((snapshot["path"], key) for key in snapshot["fields"])
    run["input_fields"] = len(fields)
    run["horizontal_overflow"] |= snapshot["overflow"]
    run["progress_present"] |= snapshot["progress"]


def fill_fake(page, seed):
    values = {
        "name-a": "A", "name-b": "B",
        "birth-year": "2000", "birth-month": "1", "birth-day": "1",
        "year-a": "2000", "month-a": "1", "day-a": "1",
        "year-b": "2000", "month-b": "1", "day-b": "1",
    }
    for name, value in values.items():
        fast = page.locator("#fast-" + name)
        control = fast if visible(fast) else page.locator("#" + name)
        if visible(control):
            act(control, "fill", value)
    gender = page.locator("#gender")
    if visible(gender):
        options = gender.locator("option").evaluate_all(
            "els => els.filter(e => !e.disabled && e.value)"
            ".map(e => e.value)"
        )
        if options:
            act(gender, "select_option", options[0 if seed == "first" else -1])


def screenshot(page, folder, run, name, target=None):
    if target is not None:
        target.scroll_into_view_if_needed()
    path = folder / (run["seed"] + "-" + name + ".png")
    page.screenshot(path=str(path), animations="disabled", timeout=5000)
    run["screenshots"][name] = str(path)


def answer_radios(page, seed, run, folder):
    groups = page.locator(".pt-likert")
    names = groups.evaluate_all(
        "els => els.map(e => e.querySelector('input[type=radio]')?.name)"
        ".filter(Boolean)"
    )
    if not names:
        raise RuntimeError("문항 라디오 그룹을 찾지 못함")
    for name in names:
        # The repository uses q1 / a-1 / b-1 names (safe CSS string values).
        options = page.locator('.pt-likert input[type="radio"][name=' +
                               json.dumps(name) + ']')
        index = 0 if seed == "first" else options.count() - 1
        if run["question_count"] == 2:
            screenshot(page, folder, run, "question-3",
                       options.nth(index).locator("xpath=ancestor::div"
                                                  "[@role='radiogroup']"))
        act(options.nth(index), "check")
        run["question_count"] += 1


def ready(page, slug):
    if slug not in LIKERT and slug not in {"kpop-match", "vibe-check"}:
        if not urlsplit(page.url).path.rstrip("/").endswith(
                "/" + slug + "/result"):
            return False
    target = page.locator(READY[slug])
    if not visible(target):
        return False
    text = target.inner_text().strip()
    return bool(text and text != "--" and text != "...")


def drive(page, slug, seed, run, folder, fields):
    deadline = time.monotonic() + 100
    if slug in LIKERT:
        while time.monotonic() < deadline:
            observe(page, run, fields)
            if ready(page, slug):
                return
            answer_radios(page, seed, run, folder)
            submit = page.locator("#pt-submit")
            if visible(submit):
                act(submit, "click")
                page.locator(READY[slug]).wait_for(state="visible", timeout=15000)
                return
            next_button = page.locator("#pt-next")
            before = page.locator(".pt-likert input").first.get_attribute("name")
            act(next_button, "click")
            page.wait_for_function(
                "old => document.querySelector('.pt-likert input')?.name !== old",
                arg=before, timeout=5000,
            )
    elif slug == "compatibility":
        selector = start_selector(page, slug)
        run["compatibility_path"] = "fast" if selector == "#fast-submit" else "detailed"
        if run["compatibility_path"] == "detailed":
            answer_radios(page, seed, run, folder)
        act(page.locator(selector), "click")
        page.locator(READY[slug]).wait_for(state="visible", timeout=15000)
        return
    else:
        act(page.locator(START[slug]), "click")
        seen = set()
        while time.monotonic() < deadline:
            observe(page, run, fields)
            if ready(page, slug):
                return
            interstitial = page.locator("#interstitial-button")
            if visible(interstitial):
                act(interstitial, "click")
                page.wait_for_timeout(700)
                continue
            counter = page.locator(
                "#question-card .question-number, #q-counter"
            ).first
            if not visible(counter):
                page.wait_for_timeout(100)
                continue
            key = counter.inner_text()
            if key in seen:
                page.wait_for_timeout(100)
                continue
            options = page.locator(
                "#question-card .option-btn, #q-options button"
            )
            if not visible(options):
                page.wait_for_timeout(100)
                continue
            if run["question_count"] == 2:
                screenshot(page, folder, run, "question-3", counter)
            act(options.nth(0 if seed == "first" else options.count() - 1),
                "click")
            seen.add(key)
            run["question_count"] += 1
    raise RuntimeError("100초 안에 결과에 도달하지 못함")


def result_metrics(page, slug, run):
    # Allow result identity animations and the deferred recommendation rail.
    page.wait_for_timeout(1800)
    fast = slug == "compatibility" and run["compatibility_path"] == "fast"
    if not ready(page, slug) or (not run["question_count"] and not fast):
        raise RuntimeError("답변 완료 후 실제 결과 텍스트를 확인하지 못함")
    parts = page.locator(IDENTITY[slug]).all_inner_texts()
    run["result_text"] = "\n".join(" ".join(p.split()) for p in parts if p.strip())
    run["result_reached"] = True
    share_metrics = page.evaluate("""() => {
        const rendered = e => !e.closest('.hidden,[hidden],[aria-hidden="true"]')
            && e.getClientRects().length &&
            getComputedStyle(e).visibility !== 'hidden';
        const buttons = [...document.querySelectorAll('button,a,[role=button]')]
            .filter(rendered).filter(e =>
                /share|copy.?link|공유|복사|シェア|共有|分享|复制|compartir|copiar/i
                .test([e.id,e.className,e.getAttribute('onclick'),
                       e.getAttribute('aria-label'),e.textContent].join(' ')))
            ;
        return {count: buttons.length, top: buttons.length
            ? Math.min(...buttons.map(e => e.getBoundingClientRect().top + scrollY))
            : null};
    }""")
    run["share_buttons"] = share_metrics["count"]
    run["result_share_top"] = share_metrics["top"]
    next_metrics = page.evaluate("""({slugs, current}) => {
        const links = [...document.querySelectorAll('main a[href]')].filter(e =>
            !e.closest('nav,footer,.hidden,[hidden],[aria-hidden="true"]') &&
            e.getClientRects().length &&
            getComputedStyle(e).visibility !== 'hidden');
        const landing = links.filter(e => {
            const u = new URL(e.href);
            const p = u.pathname.split('/').filter(Boolean);
            return u.origin === location.origin && p.length === 2 &&
                slugs.includes(p[1]) && p[1] !== current && !u.hash;
        });
        const next = links.filter(e => landing.includes(e) ||
            e.getAttribute('href') === '#sat-result-rail');
        return {count: landing.length, top: next.length
            ? Math.min(...next.map(e => e.getBoundingClientRect().top + scrollY))
            : null};
    }""", {"slugs": SLUGS, "current": slug})
    run["next_test_links"] = next_metrics["count"]
    run["result_next_top"] = next_metrics["top"]
    run["adsbygoogle"] = page.locator("ins.adsbygoogle").count()


def audit(browser, base, origin, locale, slug, seed, folder):
    run = dict(seed=seed, first_cta_top=None, input_fields=0, question_count=0,
               progress_present=False, result_reached=False, result_text="",
               share_buttons=None, next_test_links=None, adsbygoogle=None,
               horizontal_overflow=False, pageerrors=[], failure_reason=None,
               screenshots={}, consent_button_in_viewport=None,
               compatibility_path=None, result_share_top=None,
               result_next_top=None)
    context = None
    page = None
    fields = set()
    try:
        context = browser.new_context(
            viewport={"width": 390, "height": 844}, locale=locale,
            is_mobile=True, has_touch=True, service_workers="block",
            extra_http_headers={"Accept-Language": locale},
        )

        def gate(route):
            request = route.request
            u = urlsplit(request.url)
            if (origin_of(request.url) != origin or
                    u.scheme not in ("http", "https") or
                    TRACKING.search(u.path)):
                route.abort()
            else:
                # Fetch without following redirects: even the first redirect
                # hop must never contact an external server.
                try:
                    response = route.fetch(max_redirects=0, timeout=10000)
                    if 300 <= response.status < 400:
                        route.abort()
                    else:
                        route.fulfill(response=response)
                except Exception:
                    route.abort()

        context.route("**/*", gate)
        context.route_web_socket("**/*", lambda ws: ws.close())
        page = context.new_page()
        page.set_default_timeout(7000)
        page.on("pageerror", lambda error: run["pageerrors"].append(str(error)))
        response = page.goto(
            base + "/" + locale.split("-")[0] + "/" + slug + "/",
            wait_until="load", timeout=20000,
        )
        if response is None or not response.ok:
            raise RuntimeError("시작 페이지 HTTP 실패: " +
                               str(response.status if response else None))
        reject_consent(page, run)
        page.evaluate("window.scrollTo(0, 0)")
        effective = "compatibility" if slug in DERIVATIVES else slug
        selector = ('main a[href$="/compatibility/"]' if slug in DERIVATIVES
                    else start_selector(page, slug))
        cta = page.locator(selector).first
        cta.wait_for(state="visible")
        run["first_cta_top"] = cta.evaluate(
            "el => el.getBoundingClientRect().top"
        )
        observe(page, run, fields)
        screenshot(page, folder, run, "first")
        if slug in DERIVATIVES:
            act(cta, "click")
            page.locator("#compatibility-form").wait_for(state="visible")
            observe(page, run, fields)
        fill_fake(page, seed)
        drive(page, effective, seed, run, folder, fields)
        result_metrics(page, effective, run)
        observe(page, run, fields, count_inputs=False)
        screenshot(page, folder, run, "result", page.locator(READY[effective]))
    except Exception as error:
        run["failure_reason"] = type(error).__name__ + ": " + str(error)
        if page is not None and not page.is_closed():
            try:
                screenshot(page, folder, run, "failure")
            except Exception:
                pass
    finally:
        if context is not None:
            try:
                context.close()
            except Exception as error:
                run["failure_reason"] = run["failure_reason"] or str(error)
    return run


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("base_url", type=local_origin)
    parser.add_argument("out_dir", type=Path)
    parser.add_argument("locale")
    parser.add_argument("slugs", nargs="*")
    parser.add_argument("--seed", choices=("first", "last"), default="first")
    args = parser.parse_args()
    if not re.fullmatch(r"(ko|en|ja|zh|es)(?:-[A-Za-z0-9]{2,8})*", args.locale):
        parser.error("지원 locale: ko, en, ja, zh, es (지역 코드 허용)")
    if any(slug not in SLUGS for slug in args.slugs):
        parser.error("지원하지 않는 slug")
    u, origin = args.base_url
    base = u.geturl().rstrip("/")
    # Validate the URL before importing Playwright or launching a browser.
    from playwright.sync_api import sync_playwright
    args.out_dir.mkdir(parents=True, exist_ok=True)
    failed = False
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            headless=True,
            args=["--no-proxy-server", "--disable-background-networking",
                  "--disable-component-update",
                  "--host-resolver-rules=MAP localhost 127.0.0.1"],
        )
        try:
            for slug in args.slugs or SLUGS:
                folder = args.out_dir / slug
                folder.mkdir(parents=True, exist_ok=True)
                seeds = (args.seed, "last" if args.seed == "first" else "first")
                runs = [
                    audit(browser, base, origin, args.locale, slug, seed, folder)
                    for seed in seeds
                ]
                complete = all(run["result_reached"] for run in runs)
                failed |= not complete or any(run["failure_reason"] for run in runs)
                record = dict(slug=slug, runs=runs, results_differ=(
                    runs[0]["result_text"] != runs[1]["result_text"]
                    if complete else None
                ))
                line = json.dumps(record, ensure_ascii=False)
                with (folder / "audit.jsonl").open("w", encoding="utf-8") as out:
                    out.write(line + "\n")
                print(line, flush=True)
        finally:
            browser.close()
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
