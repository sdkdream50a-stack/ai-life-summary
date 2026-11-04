#!/usr/bin/env python3
"""Local invite E2E audit. Python 3.10+, Playwright >= 1.48 and Chromium.
Usage: check-invite-e2e.py <base_url> <out_dir>

CAVEATS
- This patch was syntax-checked only; browser execution remains unverified.
- Only exact localhost/127.0.0.1 HTTP(S) origins are accepted. All external
  requests, redirects, WebSockets and service workers are blocked. Missing
  external assets can change layout. No advertising/share links are clicked.
- Analytics scripts are not mocked and gaLoaded is never forced. Blocking GA
  may keep invite events in pendingAnalyticsEvents even after acceptance.
  Event presence means observed locally in dataLayer or that actual queue;
  it does not prove delivery to an analytics service.
- Quiz/banner rectangles use viewport CSS pixels; document_top adds scrollY.
  quiz_obscured_by_banner means their visible viewport rectangles intersect,
  not a pixel-perfect occlusion measurement. Screenshots are viewport PNGs.
- Both scenarios use fresh storage and choose value 1 on all eight questions.
  Actions use normal Playwright hit testing without forced or DOM clicks.
  B leaves consent untouched; blocked controls are reported as failures.
- Exit 0 requires both flows, local invite events, and no pageerrors. Layout
  overlap is an observation. Failures retain diagnostics and exit 1;
  invalid arguments exit 2 before Playwright or output-directory creation.
"""
import argparse
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit

TRACKING = re.compile(
    r"googletagmanager|google-analytics|clarity|googlesyndication|doubleclick|"
    r"adsbygoogle|(?:^|/)(?:collect|g/collect|beacon|telemetry)(?:/|[?]|$)",
    re.I,
)
INVITE_PATH = "/ko/compatibility/invite/?from=fox&src=webshare"


def origin_of(value):
    try:
        u = urlsplit(value)
        if (u.scheme not in ("http", "https") or
                u.hostname not in ("127.0.0.1", "localhost") or
                u.username is not None or u.password is not None):
            return None
        return u.scheme, u.hostname, u.port or (
            443 if u.scheme == "https" else 80
        )
    except ValueError:
        return None


def local_origin(value):
    try:
        u = urlsplit(value)
        if (origin_of(value) is None or u.path not in ("", "/") or
                u.query or u.fragment or any(c.isspace() for c in value) or
                "\\" in value):
            raise ValueError()
    except ValueError:
        raise argparse.ArgumentTypeError(
            "base_url must be an HTTP(S) origin on 127.0.0.1 or localhost"
        ) from None
    return value.rstrip("/")


ANALYTICS_JS = """() => {
    const layer = window.dataLayer || [];
    const events = Array.from(layer).map(entry => {
        if (!entry) return null;
        if (entry[0] === 'event') return entry[1];
        return entry.event;
    }).filter(name => typeof name === 'string');
    const queue = window.pendingAnalyticsEvents || [];
    const queued = queue.map(entry => entry.eventName);
    const presence = name => ({
        dataLayer: events.includes(name),
        queue: queued.includes(name),
        either: events.includes(name) || queued.includes(name)
    });
    return {
        dataLayer_event_names: events,
        pendingAnalyticsEvents: queue,
        analytics_ready: !!window.AnalyticsEvents,
        gaLoaded: !!window.gaLoaded,
        invite_view: presence('invite_view'),
        invite_complete: presence('invite_complete')
    };
}"""

LAYOUT_JS = """() => {
    const rect = selector => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return {
            top: r.top, left: r.left, bottom: r.bottom, right: r.right,
            width: r.width, height: r.height, document_top: r.top + scrollY,
            visible: !!el.getClientRects().length && r.width > 0 &&
                r.height > 0 && style.visibility !== 'hidden' &&
                style.display !== 'none' && Number(style.opacity) > 0
        };
    };
    const quiz = rect('#quiz'), banner = rect('#consent-banner');
    const overlap = !!(quiz?.visible && banner?.visible &&
        Math.max(0, quiz.left, banner.left) <
            Math.min(innerWidth, quiz.right, banner.right) &&
        Math.max(0, quiz.top, banner.top) <
            Math.min(innerHeight, quiz.bottom, banner.bottom));
    return {quiz, banner, banner_visible: !!banner?.visible,
        quiz_obscured_by_banner: overlap, scroll_y: scrollY};
}"""


def screenshot(page, folder, run, label):
    path = folder / (run["scenario"] + "-" + label + ".png")
    page.screenshot(path=str(path), animations="disabled", timeout=5000)
    run["screenshots"][label] = str(path)


def audit(browser, base, folder, scenario, accept):
    run = dict(
        scenario=scenario, accept_consent=accept, answered=0,
        before_consent=None, before_analytics=None, analytics=None,
        result_visible=False, result_text_200="", banner_visible_at_end=None,
        completed_without_consent=False, pageerrors=[], screenshots={},
        blocked_requests=[], errors=[], passed=False,
    )
    context = page = None
    try:
        context = browser.new_context(
            viewport={"width": 390, "height": 844}, locale="ko",
            is_mobile=True, has_touch=True, service_workers="block",
            extra_http_headers={"Accept-Language": "ko"},
        )

        def gate(route):
            url = route.request.url
            if origin_of(url) != origin_of(base) or TRACKING.search(url):
                run["blocked_requests"].append(url)
                route.abort()
                return
            try:
                response = route.fetch(max_redirects=0, timeout=10000)
                if 300 <= response.status < 400:
                    run["blocked_requests"].append(url)
                    route.abort()
                else:
                    route.fulfill(response=response)
            except Exception as error:
                run["errors"].append("local request: " + str(error))
                route.abort()

        context.route("**/*", gate)
        context.route_web_socket("**/*", lambda ws: ws.close())
        page = context.new_page()
        page.set_default_timeout(7000)
        page.on("pageerror", lambda error: run["pageerrors"].append(str(error)))
        response = page.goto(base + INVITE_PATH, wait_until="load", timeout=20000)
        if response is None or not response.ok:
            raise RuntimeError("invite HTTP status: " + str(
                response.status if response else None))
        page.locator("#quiz").wait_for(state="visible")
        page.locator("#consent-banner.visible").wait_for(state="visible")
        # Wait for the real banner transition and invite's analytics retry.
        page.wait_for_function(
            "() => !!window.AnalyticsEvents && "
            "(window.pendingAnalyticsEvents || []).some("
            "e => e.eventName === 'invite_view')"
        )
        page.wait_for_timeout(500)
        run["before_consent"] = page.evaluate(LAYOUT_JS)
        run["before_analytics"] = page.evaluate(ANALYTICS_JS)
        screenshot(page, folder, run, "before-consent")
        if accept:
            page.locator("#consent-accept").click()
            page.locator("#consent-banner").wait_for(state="detached")

        for index in range(8):
            legend = page.locator("#quiz legend")
            legend.wait_for(state="visible")
            if not legend.inner_text().strip().startswith(str(index + 1) + " / 8"):
                raise RuntimeError("unexpected question: " + legend.inner_text())
            page.locator('#quiz input[type="radio"][value="1"]').check()
            page.locator('#quiz button[type="submit"]').click()
            if index < 7:
                page.wait_for_function(
                    "n => document.querySelector('#quiz legend')?.textContent"
                    ".trim().startsWith(n + ' / 8')", arg=index + 2,
                )
            run["answered"] += 1

        result = page.locator("#result")
        result.wait_for(state="visible")
        page.wait_for_function(
            "() => (document.querySelector('#result')?.textContent || '')"
            ".trim().length > 0"
        )
        page.wait_for_timeout(300)
        run["result_visible"] = result.is_visible()
        run["result_text_200"] = result.inner_text().strip()[:200]
        result.scroll_into_view_if_needed()
        screenshot(page, folder, run, "result")
    except Exception as error:
        run["errors"].append(type(error).__name__ + ": " + str(error))
        if page is not None and not page.is_closed():
            try:
                screenshot(page, folder, run, "failure")
            except Exception as shot_error:
                run["errors"].append("screenshot: " + str(shot_error))
    finally:
        if page is not None and not page.is_closed():
            try:
                run["analytics"] = page.evaluate(ANALYTICS_JS)
                run["banner_visible_at_end"] = page.evaluate(
                    LAYOUT_JS)["banner_visible"]
                run["completed_without_consent"] = (
                    not accept and run["result_visible"] and
                    run["answered"] == 8 and run["banner_visible_at_end"]
                )
                for name in ("invite_view", "invite_complete"):
                    if not run["analytics"][name]["either"]:
                        run["errors"].append("missing event: " + name)
                if not accept and not run["banner_visible_at_end"]:
                    run["errors"].append("B consent banner did not remain visible")
            except Exception as error:
                run["errors"].append("diagnostics: " + str(error))
        if context is not None:
            try:
                context.close()
            except Exception as error:
                run["errors"].append("context close: " + str(error))
    run["passed"] = bool(
        run["result_visible"] and run["answered"] == 8 and
        not run["errors"] and not run["pageerrors"]
    )
    return run


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("base_url", type=local_origin)
    parser.add_argument("out_dir", type=Path)
    args = parser.parse_args()
    report = dict(base_url=args.base_url, scenarios=[], errors=[], passed=False)
    try:
        from playwright.sync_api import sync_playwright

        args.out_dir.mkdir(parents=True, exist_ok=True)
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(
                headless=True,
                args=["--no-proxy-server", "--disable-background-networking",
                      "--disable-component-update",
                      "--host-resolver-rules=MAP localhost 127.0.0.1"],
            )
            try:
                for scenario, accept in (("A", True), ("B", False)):
                    report["scenarios"].append(audit(
                        browser, args.base_url, args.out_dir, scenario, accept
                    ))
            finally:
                browser.close()
        report["passed"] = all(r["passed"] for r in report["scenarios"])
    except Exception as error:
        report["errors"].append(type(error).__name__ + ": " + str(error))
    print(json.dumps(report, ensure_ascii=False), flush=True)
    return 0 if report["passed"] and not report["errors"] else 1


if __name__ == "__main__":
    sys.exit(main())

