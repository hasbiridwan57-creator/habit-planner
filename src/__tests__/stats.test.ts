import { describe, it, expect } from 'vitest';
import { dailyPercent } from '../lib/stats';

describe('stats', () => {
  it('calculates daily percentage correctly', () => {
    const habits = [{ id: 'h1', name: 'H1', emoji: 'a', order: 0, month: '2026-09' }, { id: 'h2', name: 'H2', emoji: 'b', order: 1, month: '2026-09' }];
    const logs = { h1: { '2026-09-01': true }, h2: { '2026-09-01': false } };
    expect(dailyPercent(habits, logs, '2026-09-01')).toBe(50);
  });
});
