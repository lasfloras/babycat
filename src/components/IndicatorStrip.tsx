import React from 'react';
import { EconomicIndicator } from '../types/index.ts';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface IndicatorStripProps {
  indicators: EconomicIndicator[];
  onSelectIndicator?: (indicator: EconomicIndicator) => void;
}

export const IndicatorStrip: React.FC<IndicatorStripProps> = ({ indicators, onSelectIndicator }) => {
  return (
    <div className="border-b border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/40 py-2.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
          <span className="font-mono uppercase tracking-widest text-[10px]">
            Key Economic Benchmarks · Reference vs Observation Precision
          </span>
          <span className="font-mono text-[10px]">Updated Daily</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
          {indicators.slice(0, 6).map((ind) => {
            const isNegative = typeof ind.latestObservation === 'number' && ind.latestObservation < 0;
            return (
              <div
                key={ind.id}
                onClick={() => onSelectIndicator && onSelectIndicator(ind)}
                className="p-2 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded hover:border-stone-400 dark:hover:border-stone-600 transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-medium text-stone-600 dark:text-stone-300 truncate" title={ind.name}>
                  {ind.name}
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-base font-semibold font-mono tabular-nums text-stone-900 dark:text-stone-100">
                    {ind.latestObservation}
                    <span className="text-xs ml-1 text-stone-500 font-normal">{ind.unit}</span>
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {ind.referencePeriod}
                  </span>
                </div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 truncate">
                  {ind.revision || `Rel: ${ind.releaseDate}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
