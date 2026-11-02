import { formatcurrency } from '../scripts/utils/money.js';

const cases = [
  { cents: 1096, expected: '10.96' },
  { cents: 2010, expected: '20.10' },
  { cents: 0, expected: '0.00' }
];

cases.forEach(({ cents, expected }) => {
  const passed = formatcurrency(cents) === expected;
  console.log(`${passed ? 'PASSED' : 'FAILED'}: ${cents} cents`);
});
