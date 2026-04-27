#!/usr/bin/env node

/**
 * build-legal-i18n.js
 *
 * Generates language-subdirectory copies of legal pages:
 *   privacy-policy, disclaimer, contact
 *
 * Source HTML already contains 5-language inline content via lang-XX CSS toggles
 * (privacy-policy, contact have all 5 langs; disclaimer has en+ko only).
 * This script changes only:
 *   - <html lang="...">
 *   - canonical / hreflang / og:locale / og:url / twitter:url
 *   - <title> / <meta description>
 *   - relative ./ paths -> ../../ (for /{lang}/{page}/index.html depth)
 *
 * Body content is left intact so CSS lang toggles auto-display the right
 * language. Pages where a language body is absent (disclaimer ja/zh/es) will
 * show English fallback - acceptable for AdSense page-existence requirement.
 *
 * Usage: node scripts/build-legal-i18n.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE_URL = 'https://smartaitest.com';

const LANGS = ['en', 'ko', 'ja', 'zh', 'es'];

const LOCALES = {
    en: 'en_US',
    ko: 'ko_KR',
    ja: 'ja_JP',
    zh: 'zh_CN',
    es: 'es_ES'
};

// Per-page-per-language meta: [title, description]
const META = {
    'privacy-policy': {
        en: ['Privacy Policy - AI Test Lab | Data Protection & Your Rights',
             'Read our Privacy Policy: how AI Test Lab collects, uses, and protects your personal information. GDPR, CCPA, cookies, data retention, your rights.'],
        ko: ['개인정보처리방침 - AI Test Lab | 데이터 보호 및 사용자 권리',
             'AI Test Lab의 개인정보처리방침: 개인정보 수집·이용·보호 방식, 쿠키, 데이터 보관 기간, GDPR·CCPA·한국 개인정보보호법 준수, 사용자 권리 안내.'],
        ja: ['プライバシーポリシー - AI Test Lab | データ保護とユーザーの権利',
             'AI Test Labのプライバシーポリシー：個人情報の収集・利用・保護方針、クッキー、データ保持期間、GDPR・CCPA準拠、ユーザーの権利。'],
        zh: ['隐私政策 - AI Test Lab | 数据保护与用户权利',
             'AI Test Lab隐私政策：个人信息收集、使用与保护方式、Cookie、数据保留期限、GDPR与CCPA合规、用户权利说明。'],
        es: ['Política de Privacidad - AI Test Lab | Protección de Datos y Derechos del Usuario',
             'Política de Privacidad de AI Test Lab: cómo recopilamos, usamos y protegemos tu información personal. RGPD, CCPA, cookies, retención de datos, tus derechos.']
    },
    'disclaimer': {
        en: ['Disclaimer - AI Test Lab | Entertainment & Educational Purpose',
             'AI Test Lab disclaimer: personality tests, life summaries, and compatibility tools are for entertainment and educational purposes only. Not professional advice.'],
        ko: ['면책조항 - AI Test Lab | 오락 및 교육 목적 전용',
             'AI Test Lab의 면책조항: 성격 테스트, 인생 요약, 궁합 도구는 오락 및 교육 목적 전용입니다. 전문적인 의료·심리·법률 자문이 아닙니다.'],
        ja: ['免責事項 - AI Test Lab | エンターテインメント・教育目的のみ',
             'AI Test Labの免責事項：性格診断、人生要約、相性ツールはエンターテインメントと教育目的のみです。専門的な医療・心理・法律助言ではありません。'],
        zh: ['免责声明 - AI Test Lab | 仅用于娱乐与教育目的',
             'AI Test Lab免责声明：性格测试、人生总结、配对工具仅用于娱乐与教育目的，不构成专业医疗、心理或法律建议。'],
        es: ['Aviso Legal - AI Test Lab | Solo para Entretenimiento y Educación',
             'Aviso legal de AI Test Lab: los tests de personalidad, resúmenes de vida y herramientas de compatibilidad son solo para entretenimiento y educación. No constituyen asesoramiento profesional.']
    },
    'contact': {
        en: ['Contact - AI Test Lab | Get in Touch with Our Team',
             'Contact AI Test Lab: questions, feedback, partnership inquiries, or privacy requests. Reach our team via email and the contact form.'],
        ko: ['문의 - AI Test Lab | 운영팀에 연락하세요',
             'AI Test Lab 문의: 서비스 관련 질문, 피드백, 제휴 제안, 개인정보 요청을 이메일과 문의 폼으로 보내주세요.'],
        ja: ['お問い合わせ - AI Test Lab | 運営チームにご連絡ください',
             'AI Test Labへのお問い合わせ：サービスに関するご質問、フィードバック、提携のご相談、プライバシーに関するご依頼はメールまたはフォームから。'],
        zh: ['联系我们 - AI Test Lab | 与运营团队取得联系',
             'AI Test Lab联系方式：服务咨询、反馈、合作洽谈、隐私请求请通过邮件或联系表单与我们联系。'],
        es: ['Contacto - AI Test Lab | Comunícate con Nuestro Equipo',
             'Contacta a AI Test Lab: preguntas sobre el servicio, comentarios, consultas de asociación o solicitudes de privacidad por correo y formulario.']
    }
};

// Source files (root)
const SOURCES = {
    'privacy-policy': 'privacy-policy.html',
    'disclaimer':     'disclaimer.html',
    'contact':        'contact.html'
};

// Pages to generate per language (skip ones that already exist with non-trivial body)
// All 5 langs * 3 pages = 15 dirs. We generate all 15 (overwrite existing safe).
function generateHreflang(slug) {
    const tags = LANGS.map(l => `    <link rel="alternate" hreflang="${l}" href="${BASE_URL}/${l}/${slug}/">`);
    tags.push(`    <link rel="alternate" hreflang="x-default" href="${BASE_URL}/en/${slug}/">`);
    return tags.join('\n');
}

function transform(srcHtml, slug, lang) {
    const [title, description] = META[slug][lang];
    const locale = LOCALES[lang];
    const canonical = `${BASE_URL}/${lang}/${slug}/`;
    let h = srcHtml;

    // 1. <html lang="...">
    h = h.replace(/<html\s+lang="[^"]*"/i, `<html lang="${lang}"`);

    // 2. <title>
    h = h.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);

    // 3. <meta name="description" content="...">
    h = h.replace(/<meta\s+name="description"\s+content="[^"]*"/i,
        `<meta name="description" content="${description}"`);

    // 4. canonical
    h = h.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?\s*>/i,
        `<link rel="canonical" href="${canonical}">`);

    // 5. Replace whole hreflang block.
    //    Strip all existing hreflang lines, then insert fresh block right after canonical.
    h = h.replace(/^\s*<link\s+rel="alternate"\s+hreflang="[^"]*"\s+href="[^"]*"\s*\/?\s*>\s*$/gmi, '');
    h = h.replace(
        new RegExp('(<link\\s+rel="canonical"\\s+href="' + canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '">)'),
        `$1\n\n    <!-- Hreflang Tags -->\n${generateHreflang(slug)}`
    );

    // 6. og:locale
    h = h.replace(/<meta\s+property="og:locale"\s+content="[^"]*"/i,
        `<meta property="og:locale" content="${locale}"`);

    // 7. og:url, twitter:url
    h = h.replace(/<meta\s+property="og:url"\s+content="[^"]*"/i,
        `<meta property="og:url" content="${canonical}"`);
    h = h.replace(/<meta\s+name="twitter:url"\s+content="[^"]*"/i,
        `<meta name="twitter:url" content="${canonical}"`);

    // 8. og:title, twitter:title (use page title)
    h = h.replace(/<meta\s+property="og:title"\s+content="[^"]*"/i,
        `<meta property="og:title" content="${title}"`);
    h = h.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"/i,
        `<meta name="twitter:title" content="${title}"`);

    // 9. og:description, twitter:description
    h = h.replace(/<meta\s+property="og:description"\s+content="[^"]*"/i,
        `<meta property="og:description" content="${description}"`);
    h = h.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"/i,
        `<meta name="twitter:description" content="${description}"`);

    // 10. Schema.org JSON-LD: name + url + description (best-effort)
    h = h.replace(/("name":\s*")[^"]+(",\s*"url":\s*")[^"]+(")/g,
        `$1${title.replace(/"/g, '\\"')}$2${canonical}$3`);
    h = h.replace(/("description":\s*")[^"]+(")/g,
        `$1${description.replace(/"/g, '\\"')}$2`);

    // 11. Relative paths ./ -> ../../  (we are at /{lang}/{slug}/index.html, depth 2)
    //     Match href="./" and src="./" but NOT href="//" or absolute URLs.
    h = h.replace(/(href|src)="\.\//g, '$1="../../');
    //     Also handle "./" without leading dot in some hrefs like href="./xxx" already covered.
    //     And handle things like href="/" (root absolute) - leave alone.

    return h;
}

function ensureDir(p) {
    fs.mkdirSync(p, { recursive: true });
}

function buildAll() {
    let written = 0;
    const log = [];
    for (const [slug, srcFile] of Object.entries(SOURCES)) {
        const srcPath = path.join(ROOT, srcFile);
        const src = fs.readFileSync(srcPath, 'utf-8');
        for (const lang of LANGS) {
            const out = transform(src, slug, lang);
            const dir = path.join(ROOT, lang, slug);
            const outFile = path.join(dir, 'index.html');
            ensureDir(dir);
            fs.writeFileSync(outFile, out, 'utf-8');
            log.push(`✓ /${lang}/${slug}/index.html  (${(out.length/1024).toFixed(1)} KB)`);
            written++;
        }
    }
    console.log(log.join('\n'));
    console.log(`\nTotal: ${written} files written.`);
}

buildAll();
