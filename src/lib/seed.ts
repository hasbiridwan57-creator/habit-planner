import { Habit, WeeklyTask } from './types';
import { format, subDays, addDays, startOfWeek } from 'date-fns';

export function getDemoHabits(monthStr: string = '2026-09'): Habit[] {
  return [
    { id: 'h1', name: 'Bangun Pukul 05.00', emoji: '🌅', order: 0, month: monthStr },
    { id: 'h2', name: 'Olahraga / Stretching 30 Menit', emoji: '🏃‍♂️', order: 1, month: monthStr },
    { id: 'h3', name: 'Membaca Buku 15 Menit', emoji: '📚', order: 2, month: monthStr },
    { id: 'h4', name: 'Minum Air Putih 2L', emoji: '💧', order: 3, month: monthStr },
    { id: 'h5', name: 'Fokus Kerja Tanpa Distraksi', emoji: '💻', order: 4, month: monthStr },
    { id: 'h6', name: 'Journaling & Evaluasi Harian', emoji: '✍️', order: 5, month: monthStr },
    { id: 'h7', name: 'Meditasi / Breathing 10 Menit', emoji: '🧘‍♂️', order: 6, month: monthStr },
    { id: 'h8', name: 'Tidur Tepat Waktu (22.00)', emoji: '🌙', order: 7, month: monthStr },
  ];
}

export function getDemoHabitLogs(habits: Habit[]): Record<string, Record<string, boolean>> {
  const logs: Record<string, Record<string, boolean>> = {};
  const daysInSeptember = 30; // 2026-09 has 30 days
  
  habits.forEach((h, hIdx) => {
    logs[h.id] = {};
    for (let day = 1; day <= daysInSeptember; day++) {
      const dayStr = String(day).padStart(2, '0');
      const dateKey = `2026-09-${dayStr}`;
      // Realistic pattern: more consistent on weekdays, some skips on weekends
      const isWeekend = (day % 7 === 6 || day % 7 === 0);
      const randomFactor = (hIdx + day) % 3 !== 0;
      const val = isWeekend ? (day % 2 === 0) : randomFactor;
      logs[h.id][dateKey] = val;
    }
  });
  
  return logs;
}

export function getDemoWeeklyTasks(): Record<string, WeeklyTask[]> {
  const tasks: Record<string, WeeklyTask[]> = {};
  const mondayThisWeek = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
  
  // Add tasks for 7 days starting from Monday
  for (let i = 0; i < 7; i++) {
    const targetDate = format(addDays(new Date(mondayThisWeek), i), 'yyyy-MM-dd');
    tasks[targetDate] = [
      { id: `t-${i}-1`, title: `Review target mingguan & sprint`, done: i < 2, order: 0 },
      { id: `t-${i}-2`, title: `Commit kode ke GitHub repository`, done: i < 3, order: 1 },
      { id: `t-${i}-3`, title: `Latihan soal / belajar fitur baru`, done: i === 0, order: 2 },
    ];
  }
  
  return tasks;
}
