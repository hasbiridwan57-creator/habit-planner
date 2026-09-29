import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { format, getDaysInMonth } from 'date-fns';

export function HabitGrid() {
  const { habits, habitLogs, toggleHabitLog } = useStore();
  const [currentDate] = useState(() => new Date());
  const daysInMonth = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  const dates = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) =>
      format(new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1), 'yyyy-MM-dd')
    );
  }, [currentDate, daysInMonth]);

  return (
    <div className="overflow-x-auto pb-4">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 bg-white dark:bg-neutral-950 p-2 text-left z-10 w-48">Habit</th>
            {dates.map((date) => (
              <th key={date} className="p-1 min-w-[28px] text-[10px] text-center uppercase text-neutral-400">
                {format(new Date(date), 'd')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.map((h) => (
            <tr key={h.id}>
              <td className="sticky left-0 bg-white dark:bg-neutral-950 p-2 font-medium truncate z-10 border-t border-neutral-100 dark:border-neutral-800">
                {h.emoji} {h.name}
              </td>
              {dates.map((date) => (
                <td key={date} className="p-1 border-t border-neutral-100 dark:border-neutral-800 text-center">
                  <button
                    onClick={() => toggleHabitLog(h.id, date)}
                    className={`w-5 h-5 rounded border ${
                      habitLogs[h.id]?.[date] 
                        ? 'bg-neutral-900 border-neutral-900 dark:bg-neutral-100 dark:border-neutral-100' 
                        : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400'
                    }`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
