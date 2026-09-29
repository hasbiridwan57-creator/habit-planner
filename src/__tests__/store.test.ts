import { describe, it, expect } from 'vitest';
import { useStore } from '../store/useStore';

describe('store', () => {
  it('adds a habit', () => {
    const addHabit = useStore.getState().addHabit;
    addHabit('Test', '🚀', '2026-09');
    expect(useStore.getState().habits.length).toBe(1);
  });
});
