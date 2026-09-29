import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState } from '../lib/types';
import { getDemoHabits, getDemoHabitLogs, getDemoWeeklyTasks } from '../lib/seed';

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      habits: [],
      habitLogs: {},
      weeklyTasks: {},
      theme: 'system',

      setTheme: (theme) => set({ theme }),

      addHabit: (name, emoji, month) => set((state) => ({
        habits: [...state.habits, { id: crypto.randomUUID(), name, emoji, order: state.habits.length, month }]
      })),

      updateHabit: (id, name, emoji) => set((state) => ({
        habits: state.habits.map((h) => h.id === id ? { ...h, name, emoji } : h)
      })),

      deleteHabit: (id) => set((state) => {
        const habitLogs = { ...state.habitLogs };
        delete habitLogs[id];
        return {
          habits: state.habits.filter((h) => h.id !== id),
          habitLogs,
        };
      }),

      reorderHabits: (newHabits) => set({ habits: newHabits }),

      toggleHabitLog: (habitId, dateStr) => set((state) => {
        const habitLogs = { ...state.habitLogs };
        if (!habitLogs[habitId]) habitLogs[habitId] = {};
        habitLogs[habitId][dateStr] = !habitLogs[habitId][dateStr];
        return { habitLogs };
      }),

      addWeeklyTask: (dateStr, title) => set((state) => {
        const tasks = state.weeklyTasks[dateStr] || [];
        return {
          weeklyTasks: {
            ...state.weeklyTasks,
            [dateStr]: [...tasks, { id: crypto.randomUUID(), title, done: false, order: tasks.length }]
          }
        };
      }),

      toggleWeeklyTask: (dateStr, taskId) => set((state) => ({
        weeklyTasks: {
          ...state.weeklyTasks,
          [dateStr]: (state.weeklyTasks[dateStr] || []).map(t => t.id === taskId ? { ...t, done: !t.done } : t)
        }
      })),

      updateWeeklyTask: (dateStr, taskId, title) => set((state) => ({
        weeklyTasks: {
          ...state.weeklyTasks,
          [dateStr]: (state.weeklyTasks[dateStr] || []).map(t => t.id === taskId ? { ...t, title } : t)
        }
      })),

      deleteWeeklyTask: (dateStr, taskId) => set((state) => ({
        weeklyTasks: {
          ...state.weeklyTasks,
          [dateStr]: (state.weeklyTasks[dateStr] || []).filter(t => t.id !== taskId)
        }
      })),

      reorderWeeklyTasks: (dateStr, tasks) => set((state) => ({
        weeklyTasks: { ...state.weeklyTasks, [dateStr]: tasks }
      })),

      resetToDemoData: () => {
        const habits = getDemoHabits();
        set({
          habits,
          habitLogs: getDemoHabitLogs(habits),
          weeklyTasks: getDemoWeeklyTasks()
        });
      },

      clearAllData: () => set({ habits: [], habitLogs: {}, weeklyTasks: {} })
    }),
    { name: 'habit-planner-storage' }
  )
);
