import type { Habit } from './types';

/**
 * Pure statistics functions for the Habit & Weekly Planner.
 * All dates are ISO strings "YYYY-MM-DD" to avoid timezone shifts.
 * All stats are derived from state — nothing is stored separately.
 */

export function dailyPercent(
  habits: Habit[],
  habitLogs: Record<string, Record<string, boolean>>,
  dateStr: string
): number {
  if (habits.length === 0) return 0;
  const done = habits.filter((h) => habitLogs[h.id]?.[dateStr]).length;
  return Math.round((done / habits.length) * 100);
}

export function monthProgress(
  habits: Habit[],
  habitLogs: Record<string, Record<string, boolean>>,
  monthStr: string
): { done: number; total: number; percent: number } {
  const [year, month] = monthStr.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const total = habits.length * daysInMonth;
  if (total === 0) return { done: 0, total: 0, percent: 0 };
  let done = 0;
  for (const h of habits) {
    const logs = habitLogs[h.id];
    if (!logs) continue;
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = `${monthStr}-${String(day).padStart(2, '0')}`;
      if (logs[dayStr]) done++;
    }
  }
  return { done, total, percent: Math.round((done / total) * 100) };
}

export function habitPercent(
  habit: Habit,
  habitLogs: Record<string, Record<string, boolean>>,
  monthStr: string
): { done: number; total: number; percent: number } {
  const [year, month] = monthStr.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const logs = habitLogs[habit.id] || {};
  let done = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = `${monthStr}-${String(day).padStart(2, '0')}`;
    if (logs[dayStr]) done++;
  }
  return { done, total: daysInMonth, percent: Math.round((done / daysInMonth) * 100) };
}

export function topHabits(
  habits: Habit[],
  habitLogs: Record<string, Record<string, boolean>>,
  monthStr: string,
  limit = 10
): Array<Habit & { percent: number; done: number; total: number }> {
  return habits
    .map((h) => ({ ...h, ...habitPercent(h, habitLogs, monthStr) }))
    .sort((a, b) => b.percent - a.percent || a.order - b.order)
    .slice(0, limit);
}

export function weeklyDayPercent(
  tasks: { done: boolean }[]
): number {
  if (tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.done).length;
  return Math.round((done / tasks.length) * 100);
}

export function weeklyTotalPercent(
  weeklyTasks: Record<string, Array<{ done: boolean }>>,
  weekDates: string[]
): { done: number; total: number; percent: number } {
  let done = 0;
  let total = 0;
  for (const dateStr of weekDates) {
    const tasks = weeklyTasks[dateStr] || [];
    total += tasks.length;
    done += tasks.filter((t) => t.done).length;
  }
  return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
}
