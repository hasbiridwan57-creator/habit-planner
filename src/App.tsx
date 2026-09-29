import { Outlet } from 'react-router-dom';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useStore } from './store/useStore';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function App() {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const resetToDemoData = useStore((s) => s.resetToDemoData);
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
    }
  }, [theme]);

  useEffect(() => {
    if (!useStore.getState().habits.length) {
      resetToDemoData();
    }
  }, [resetToDemoData]);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <header className="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="text-xl">✓</span>
            <span className="hidden sm:block text-sm uppercase tracking-[0.2em]">Habit Planner</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link to="/habits" className="hidden sm:block px-3 py-1.5 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
              Habits
            </Link>
            <Link to="/weekly" className="hidden sm:block px-3 py-1.5 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
              Weekly
            </Link>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 sm:pb-8">
        <Outlet />
      </main>
      <BottomNav location={location} />
    </div>
  );
}

function ThemeToggle({ theme, setTheme }: { theme: string; setTheme: (t: any) => void }) {
  const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
  return (
    <button
      onClick={() => setTheme(next)}
      className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
      aria-label="Toggle theme"
      title={`Tema: ${theme}`}
    >
      {theme === 'light' && <Sun className="w-4 h-4" />}
      {theme === 'dark' && <Moon className="w-4 h-4" />}
      {theme === 'system' && <Monitor className="w-4 h-4" />}
    </button>
  );
}

function BottomNav({ location }: { location: any }) {
  const items = [
    { to: '/habits', label: 'Habits', icon: '✓' },
    { to: '/weekly', label: 'Weekly', icon: '📅' },
  ];
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-sm">
      <div className="flex">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
              location.pathname === item.to ? 'text-neutral-900 dark:text-neutral-100 font-bold' : 'text-neutral-500'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default App;
