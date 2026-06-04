#!/usr/bin/env node
/**
 * Determinism gate for age-calculator (P0-0).
 * Loads js/age-calculator.js into a sandbox and asserts that the same input
 * yields identical results across repeated runs (no Math.random drift).
 * Run: node scripts/test-age-determinism.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'age-calculator.js'), 'utf8');
const ctx = { Math, Date, parseInt };
vm.createContext(ctx);
vm.runInContext(src, ctx);

const realAge = 35;
const answers = {
  q1: 'late', q2: 'cautious', q3: 'passive', q4: 'worried',
  q5: 'often', q6: 'reluctant', q7: 'none', birthMonth: '7',
};

let failures = 0;
const RUNS = 20;

function checkStable(label, fn) {
  const first = fn();
  for (let i = 1; i < RUNS; i++) {
    const got = fn();
    if (JSON.stringify(got) !== JSON.stringify(first)) {
      console.error(`FAIL ${label}: run ${i} = ${JSON.stringify(got)} != ${JSON.stringify(first)}`);
      failures++;
      return;
    }
  }
  console.log(`PASS ${label}: stable across ${RUNS} runs -> ${JSON.stringify(first)}`);
}

checkStable('calculateMentalAge', () => ctx.calculateMentalAge(realAge, answers));
checkStable('calculateEnergyAge', () => ctx.calculateEnergyAge(realAge, answers));
checkStable('getMentalAgeDescription(gap=4)', () => ctx.getMentalAgeDescription(4, 'ko'));
checkStable('getEnergyAgeDescription(gap=-6)', () => ctx.getEnergyAgeDescription(-6, 'en'));

if (failures) {
  console.error(`\n${failures} determinism check(s) FAILED.`);
  process.exit(1);
}
console.log('\nAll determinism checks passed.');
