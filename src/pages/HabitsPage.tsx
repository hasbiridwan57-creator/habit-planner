import { useState } from 'react';
import { useStore } from '../store/useStore';
import { HabitGrid } from '../features/habits/HabitGrid';
import { Donut } from '../components/Donut';
import { monthProgress } from '../lib/stats';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { getDaysInMonth } from 'date-fns';

export default function HabitsPage() {
  const { habits, habitLogs, addHabit, updateHabit, deleteHabit, resetToDemoData, clearAllData } = useStore();
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitEmoji, setNewHabitEmoji] = useState('✨');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmoji, setEditEmoji] = useState('');

  const monthStr = '2026-09';
  const progress = monthProgress(habits, habitLogs, monthStr);
  

  const daysCount = getDaysInMonth(new Date(2026, 8, 1));
  const chartData = Array.from({ length: daysCount }, (_, i) => {
    const dayNum = i + 1;
    const dayStr = String(dayNum).padStart(2, '0');
    const dateKey = `2026-09-${dayStr}`;
    let done = 0;
    habits.forEach((h) => {
      if (habitLogs[h.id]?.[dateKey]) done++;
    });
    const pct = habits.length > 0 ? Math.round((done / habits.length) * 100) : 0;
    return { day: `${dayNum}`, percent: pct };
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    addHabit(newHabitName.trim(), newHabitEmoji, monthStr);
    setNewHabitName('');
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    updateHabit(id, editName.trim(), editEmoji);
    setEditingId(null);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight uppercase">Habit Builder</h1>
          <p className="text-sm text-neutral-500 mt-1">September 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={resetToDemoData} className="px-3 py-1.5 text-xs font-medium border border-neutral-300 dark:border-neutral-700 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">Reset Demo</button>
          <button onClick={clearAllData} className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 dark:border-red-900 rounded-md hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors">Kosongkan</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex flex-col items-center justify-center text-center">
          <Donut percent={progress.percent} size={140} strokeWidth={12} label="Bulan Ini" sublabel={`${progress.done}/${progress.total} centang`} />
        </div>
        <div className="md:col-span-2 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Daily Progress (%)</h3>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#888888" fontSize={10} tickLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="percent" stroke="#171717" fill="#171717" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-lg font-bold tracking-tight">My Habits ({habits.length}/10)</h2>
          {habits.length < 10 && (
            <form onSubmit={handleAdd} className="flex gap-2">
              <input type="text" value={newHabitEmoji} onChange={(e) => setNewHabitEmoji(e.target.value)} className="w-12 text-center border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent text-lg" maxLength={2} />
              <input type="text" placeholder="Habit baru..." value={newHabitName} onChange={(e) => setNewHabitName(e.target.value)} className="flex-1 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-neutral-900" />
              <button type="submit" className="p-2 bg-neutral-900 text-white rounded-md hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /></button>
            </form>
          )}
          <div className="space-y-2">
            {habits.map((h, idx) => (
              <motion.div key={h.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                {editingId === h.id ? (
                  <div className="flex items-center gap-2 flex-1 mr-2">
                    <input type="text" value={editEmoji} onChange={(e) => setEditEmoji(e.target.value)} className="w-10 text-center border rounded bg-transparent" maxLength={2} />
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="flex-1 px-2 py-1 text-sm border rounded bg-transparent" />
                    <button onClick={() => handleSaveEdit(h.id)} className="text-xs px-2 py-1 bg-neutral-900 text-white rounded">Simpan</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{h.emoji}</span>
                    <span className="text-sm font-medium">{h.name}</span>
                  </div>
                )}
                {editingId !== h.id && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setEditingId(h.id); setEditName(h.name); setEditEmoji(h.emoji); }} className="p-1.5 text-neutral-400 hover:text-neutral-700 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteHabit(h.id)} className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-8 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Checklist Bulanan</h3>
          <HabitGrid />
        </div>
      </div>
    </div>
  );
}
