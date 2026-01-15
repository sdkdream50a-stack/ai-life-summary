#!/usr/bin/env node
/**
 * New Post Generator
 * 새 블로그 포스트 템플릿을 생성합니다.
 *
 * 사용법:
 *   node scripts/new-post.js
 *   npm run new:post
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const POSTS_DIR = path.join(__dirname, '../posts');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(q) {
  return new Promise(resolve => rl.question(q, resolve));
}

async function main() {
  console.log('\n📝 새 블로그 포스트 생성\n');

  const episode = await question('에피소드 번호: ');
  const title = await question('제목 (한글): ');
  const description = await question('설명 (150자 내외): ');
  const keywords = await question('키워드 (쉼표 구분): ');
  const emoji = await question('대표 이모지 (예: 🚀): ') || '📝';

  const today = new Date().toISOString().split('T')[0];

  const colors = ['indigo-purple', 'pink-rose', 'amber-orange', 'emerald-teal', 'blue-cyan', 'violet-purple'];
  const color = colors[(parseInt(episode) - 1) % colors.length];

  const template = `---
title: "${title}"
description: "${description}"
keywords: "${keywords}"
date: "${today}"
episode: ${episode}
emoji: "${emoji}"
color: "${color}"
lang: "ko"
---

## 30초 요약

- **핵심 포인트 1:** 여기에 내용을 작성하세요.
- **핵심 포인트 2:** 여기에 내용을 작성하세요.
- **핵심 포인트 3:** 여기에 내용을 작성하세요.

---

여기에 본문을 작성하세요.

## 첫 번째 섹션

본문 내용...

> 💡 **팁:** 도움이 되는 조언을 적어주세요.

## 두 번째 섹션

본문 내용...

> ⚠️ **주의:** 주의해야 할 사항을 적어주세요.

---

## 자주 묻는 질문 (FAQ)

**Q. 질문 1?**

답변 1...

**Q. 질문 2?**

답변 2...
`;

  const filename = `post-${episode}.md`;
  const filepath = path.join(POSTS_DIR, filename);

  if (fs.existsSync(filepath)) {
    const overwrite = await question(`\n⚠️ ${filename} 파일이 이미 존재합니다. 덮어쓰시겠습니까? (y/N): `);
    if (overwrite.toLowerCase() !== 'y') {
      console.log('취소되었습니다.');
      rl.close();
      return;
    }
  }

  fs.writeFileSync(filepath, template);

  console.log(`\n✅ 생성 완료: posts/${filename}`);
  console.log('\n다음 단계:');
  console.log(`   1. posts/${filename} 파일을 편집하여 내용 작성`);
  console.log('   2. npm run build:blog 실행하여 HTML 생성');

  rl.close();
}

main().catch(console.error);
