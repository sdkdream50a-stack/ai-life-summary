#!/usr/bin/env node
/**
 * inject-pretendard.js — 전 served 페이지 <head>에 pretendard.css <link> 주입.
 * </head> 직전에 삽입해 per-page 인라인 폰트 스택보다 늦게 로드(캐스케이드 우선).
 * Idempotent — 이미 있으면 스킵. scripts/templates/drafts/node_modules 제외.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TAG = '<link rel="stylesheet" href="/css/pretendard.css">';
const SKIP_DIRS = new Set(['scripts', 'templates', 'drafts', 'node_modules', '.git', '.wrangler', '.claude', 'fonts', 'css', 'js', 'assets']);

let changed = 0, skipped = 0, already = 0;

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel = path.relative(ROOT, full);
    const top = rel.split(path.sep)[0];
    if (SKIP_DIRS.has(top)) continue;
    const st = fs.statSync(full);
    if (st.isDirectory()) { walk(full); continue; }
    if (!name.endsWith('.html')) continue;
    inject(full);
  }
}

function inject(file) {
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('css/pretendard.css')) { already++; return; }
  if (!/<\/head>/i.test(html)) { skipped++; return; }
  html = html.replace(/<\/head>/i, `    ${TAG}\n</head>`);
  fs.writeFileSync(file, html);
  changed++;
}

walk(ROOT);
console.log(`pretendard link — injected:${changed} already:${already} skipped(no </head>):${skipped}`);
