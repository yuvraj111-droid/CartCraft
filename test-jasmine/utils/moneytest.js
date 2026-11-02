import { formatcurrency } from '../../scripts/utils/money.js';

describe('formatcurrency', () => {
  it('converts cents into dollars', () => {
    expect(formatcurrency(2095)).toBe('20.95');
  });

  it('formats zero correctly', () => {
    expect(formatcurrency(0)).toBe('0.00');
  });

  it('rounds cents to two decimal places', () => {
    expect(formatcurrency(2010)).toBe('20.10');
  });
});
