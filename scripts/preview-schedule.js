// 수동으로 특정 글만 생성할 때 사용
const schedule = require('../config/content-schedule.json');

console.log('Next 3 scheduled posts:');
schedule.schedule.filter(p => !p.published).slice(0, 3).forEach((post, i) => {
  console.log(`${i+1}. ${post.date} (${post.day}) - ${post.title}`);
});
