export type ThemeMode = 'light' | 'dark' | 'system';

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  order: number;
  month: string; // YYYY-MM
}

export interface WeeklyTask {
  id: string;
  title: string;
  done: boolean;
  order: number;
}

export interface AppState {
  habits: Habit[];
  habitLogs: Record<string, Record<string, boolean>>; // habitId -> { "YYYY-MM-DD": boolean }
  weeklyTasks: Record<string, WeeklyTask[]>; // "YYYY-MM-DD" (start of week or specific day) -> tasks
  theme: ThemeMode;
  
  // Actions
  setTheme: (theme: ThemeMode) => void;
  addHabit: (name: string, emoji: string, month: string) => void;
  updateHabit: (id: string, name: string, emoji: string) => void;
  deleteHabit: (id: string) => void;
  reorderHabits: (newHabits: Habit[]) => void;
  toggleHabitLog: (habitId: string, dateStr: string) => void;
  
  addWeeklyTask: (dateStr: string, title: string) => void;
  toggleWeeklyTask: (dateStr: string, taskId: string) => void;
  updateWeeklyTask: (dateStr: string, taskId: string, title: string) => void;
  deleteWeeklyTask: (dateStr: string, taskId: string) => void;
  reorderWeeklyTasks: (dateStr: string, tasks: WeeklyTask[]) => void;
  
  resetToDemoData: () => void;
  clearAllData: () => void;
}
