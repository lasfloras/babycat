import React from 'react';
import { Sun, Moon, RefreshCw, Database } from 'lucide-react';
import { PipelineExecutionStatus } from '../types/index.ts';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  pipelineStatus: PipelineExecutionStatus | null;
  onRunPipeline: () => void;
  isPipelineRunning: boolean;
}

const NAV_ITEMS = [
  { id: 'daily-brief', label: 'Daily Brief' },
  { id: 'macro-markets', label: 'Macro & Markets' },
  { id: 'policy-tracker', label: 'Policy Tracker' },
  { id: 'international-finance', label: 'International Finance' },
  { id: 'research-radar', label: 'Research Radar' },
  { id: 'connections', label: 'Connections' },
  { id: 'archive', label: 'Historical Archive' },
  { id: 'settings', label: 'Sources & Pipeline' }
];

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  isDark,
  toggleTheme,
  pipelineStatus,
  onRunPipeline,
  isPipelineRunning
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur border-b border-stone-200 dark:bg-stone-950/95 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => setCurrentTab('daily-brief')}
              className="text-left group cursor-pointer focus:outline-none whitespace-nowrap"
            >
              <span className="text-lg sm:text-xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors whitespace-nowrap block">
                Economic Observatory
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-stone-500 dark:text-stone-400 font-mono">
                Institutional Macro Intelligence
              </span>
            </button>
          </div>

          {/* Zone 2: 8 concise single-line nav tabs */}
          <nav className="hidden xl:flex items-center gap-3.5 2xl:gap-5 text-sm font-medium text-stone-600 dark:text-stone-300">
            {NAV_ITEMS.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`py-1 text-xs uppercase tracking-wider font-semibold transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                    active
                      ? 'border-amber-700 text-stone-900 dark:border-amber-400 dark:text-stone-100'
                      : 'border-transparent text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Theme Toggle & Pipeline Runner) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onRunPipeline}
              disabled={isPipelineRunning}
              title="Run Ingestion & Analysis Pipeline"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded dark:bg-stone-900 dark:text-stone-200 dark:border-stone-700 dark:hover:bg-stone-800 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPipelineRunning ? 'animate-spin text-amber-600' : ''}`} />
              <span className="hidden sm:inline">
                {isPipelineRunning ? 'Running Pipeline...' : 'Run Pipeline'}
              </span>
            </button>

            <button
              onClick={toggleTheme}
              aria-label="Toggle visual theme"
              className="p-1.5 rounded text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 dark:text-stone-300 dark:hover:text-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Secondary Nav Bar */}
        <div className="flex xl:hidden overflow-x-auto py-2 gap-4 border-t border-stone-200/60 dark:border-stone-800/60 scrollbar-none text-xs">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`whitespace-nowrap pb-1 font-medium ${
                currentTab === item.id
                  ? 'border-b-2 border-amber-700 text-stone-900 dark:border-amber-400 dark:text-stone-100 font-semibold'
                  : 'text-stone-500 dark:text-stone-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
