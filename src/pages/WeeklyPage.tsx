import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Donut } from '../components/Donut';
import { weeklyTotalPercent } from '../lib/stats';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { format, startOfWeek, addDays } from 'date-fns';

export default function WeeklyPage() {
  const { weeklyTasks, addWeeklyTask, toggleWeeklyTask, deleteWeeklyTask } = useStore();
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [newTask, setNewTask] = useState('');

  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => format(addDays(weekStart, i), 'yyyy-MM-dd'));
  }, [weekStart]);

  const weekTotal = weeklyTotalPercent(weeklyTasks, weekDates);

  const chartData = weekDates.map((dateStr) => {
    const tasks = weeklyTasks[dateStr] || [];
    const done = tasks.filter((t) => t.done).length;
    return { day: format(new Date(dateStr), 'EEE'), percent: tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0 };
  });

  const handleAdd = (e: React.FormEvent, dateStr: string) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    addWeeklyTask(dateStr, newTask.trim());
    setNewTask('');
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight uppercase">Weekly To-Do's</h1>
          <p className="text-sm text-neutral-500 mt-1">Minggu {format(weekStart, 'dd.MM.yyyy')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekStart(addDays(weekStart, -7))} className="px-3 py-1.5 text-xs font-medium border border-neutral-300 dark:border-neutral-700 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900">← Minggu</button>
          <button onClick={() => setWeekStart(addDays(weekStart, 7))} className="px-3 py-1.5 text-xs font-medium border border-neutral-300 dark:border-neutral-700 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900">Minggu →</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex flex-col items-center justify-center text-center">
          <Donut percent={weekTotal.percent} size={140} strokeWidth={12} label="Minggu Ini" sublabel={`${weekTotal.done}/${weekTotal.total} task`} />
        </div>
        <div className="md:col-span-2 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Progress Harian (%)</h3>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#888888" fontSize={10} tickLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="percent" fill="#171717" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {weekDates.map((dateStr, i) => {
          const tasks = weeklyTasks[dateStr] || [];
          const done = tasks.filter((t) => t.done).length;
          const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
          return (
            <motion.div
              key={dateStr}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold uppercase tracking-wide text-sm">{format(new Date(dateStr), 'EEEE')}</h3>
                  <p className="text-xs text-neutral-500">{format(new Date(dateStr), 'dd.MM.yyyy')}</p>
                </div>
                <Donut percent={pct} size={52} strokeWidth={6} />
              </div>

              <form onSubmit={(e) => handleAdd(e, dateStr)} className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Task baru..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
                <button type="submit" className="p-1.5 bg-neutral-900 text-white rounded-md hover:opacity-90"><Plus className="w-3.5 h-3.5" /></button>
              </form>

              <div className="space-y-1.5 min-h-[60px]">
                {tasks.map((t) => (
                  <div key={t.id} className="group flex items-center gap-2.5 p-1.5 rounded hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors">
                    <button
                      onClick={() => toggleWeeklyTask(dateStr, t.id)}
                      className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${
                        t.done ? 'bg-neutral-900 border-neutral-900 dark:bg-neutral-100 dark:border-neutral-100' : 'border-neutral-300 dark:border-neutral-700'
                      }`}
                    >
                      {t.done && <span className="text-white dark:text-neutral-900 text-[10px] font-bold">✓</span>}
                    </button>
                    <span className={`text-sm transition-all ${t.done ? 'line-through text-neutral-400' : 'text-neutral-700 dark:text-neutral-200'}`}>
                      {t.title}
                    </span>
                    <button onClick={() => deleteWeeklyTask(dateStr, t.id)} className="ml-auto opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-600 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-xs text-neutral-400 italic pt-2">Belum ada task</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
