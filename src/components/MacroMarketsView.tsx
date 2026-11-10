import React, { useState, useMemo } from 'react';
import { EconomicStory, EconomicField, EconomicMechanism } from '../types/index.ts';
import { Search, Filter, Layers, ArrowUpRight, Check } from 'lucide-react';

interface MacroMarketsViewProps {
  stories: EconomicStory[];
  onSelectStory: (story: EconomicStory) => void;
}

const PRIMARY_FIELDS: EconomicField[] = [
  'Macroeconomics',
  'Monetary economics',
  'International economics',
  'International finance',
  'Financial economics',
  'Banking and financial regulation',
  'Public economics',
  'Industrial organisation',
  'Development economics',
  'Economic history',
  'Institutional economics',
  'Microeconomics',
  'Corporate finance'
];

const MECHANISMS: EconomicMechanism[] = [
  'Monetary transmission',
  'Credit transmission',
  'Fiscal transmission',
  'Price mechanisms',
  'Expectations and uncertainty',
  'International capital flows',
  'Capital allocation',
  'Market power',
  'Information asymmetry',
  'Institutional change',
  'Incentives',
  'Welfare and distribution'
];

export const MacroMarketsView: React.FC<MacroMarketsViewProps> = ({ stories, onSelectStory }) => {
  const [selectedField, setSelectedField] = useState<string>('all');
  const [selectedMechanism, setSelectedMechanism] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const regions = useMemo(() => {
    const set = new Set<string>();
    stories.forEach((s) => set.add(s.jurisdiction));
    return Array.from(set);
  }, [stories]);

  const filteredStories = useMemo(() => {
    return stories.filter((s) => {
      if (selectedField !== 'all' && !s.classification.includes(selectedField as any)) {
        return false;
      }
      if (selectedMechanism !== 'all' && !s.mechanisms.includes(selectedMechanism as any)) {
        return false;
      }
      if (selectedRegion !== 'all' && s.jurisdiction !== selectedRegion) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesHeadline = s.headline.toLowerCase().includes(q);
        const matchesSummary = s.factualSummary.toLowerCase().includes(q);
        const matchesInst = s.institutions.some((i) => i.toLowerCase().includes(q));
        const matchesTheory = s.theoreticalFrameworks.some((t) => t.toLowerCase().includes(q));
        if (!matchesHeadline && !matchesSummary && !matchesInst && !matchesTheory) {
          return false;
        }
      }
      return true;
    });
  }, [stories, selectedField, selectedMechanism, selectedRegion, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Editorial Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
          Macroeconomics, Markets & Institutional Classification
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-3xl">
          Structured macroeconomic intelligence indexed by hierarchical theoretical taxonomy, underlying transmission mechanisms, and geographical jurisdictions.
        </p>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="p-4 bg-stone-100/60 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 rounded-lg space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keywords, economic theory, transmission channels, or institutions (e.g. 'Taylor Rule', 'repo', 'tariffs')..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-amber-700"
          />
        </div>

        {/* Primary Economic Field Segmented Bar */}
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-stone-500 mb-1.5 flex items-center justify-between">
            <span>Primary Economic Field</span>
            <span className="text-[10px] lowercase">{filteredStories.length} matching stories</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedField('all')}
              className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                selectedField === 'all'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold'
                  : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
              }`}
            >
              All Fields
            </button>
            {PRIMARY_FIELDS.map((field) => (
              <button
                key={field}
                onClick={() => setSelectedField(field === selectedField ? 'all' : field)}
                className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                  selectedField === field
                    ? 'bg-amber-800 text-white dark:bg-amber-700 font-semibold'
                    : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
                }`}
              >
                {field}
              </button>
            ))}
          </div>
        </div>

        {/* Mechanisms & Jurisdiction Row */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-stone-200/60 dark:border-stone-800/60 text-xs">
          
          <div className="flex items-center gap-2">
            <span className="font-mono text-stone-500 uppercase text-[10px]">Transmission Mechanism:</span>
            <select
              value={selectedMechanism}
              onChange={(e) => setSelectedMechanism(e.target.value)}
              className="px-2 py-1 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-800 dark:text-stone-200 focus:outline-none"
            >
              <option value="all">All Mechanisms</option>
              {MECHANISMS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-stone-500 uppercase text-[10px]">Jurisdiction:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-2 py-1 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-800 dark:text-stone-200 focus:outline-none"
            >
              <option value="all">All Jurisdictions</option>
              {regions.map((reg) => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </select>
          </div>

          {(selectedField !== 'all' || selectedMechanism !== 'all' || selectedRegion !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedField('all');
                setSelectedMechanism('all');
                setSelectedRegion('all');
                setSearchQuery('');
              }}
              className="text-amber-800 dark:text-amber-400 font-mono text-xs hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}

        </div>

      </div>

      {/* Stories Listing */}
      <div className="space-y-4">
        {filteredStories.length === 0 ? (
          <div className="p-12 text-center text-stone-500 border border-stone-200 dark:border-stone-800 rounded bg-white dark:bg-stone-900">
            No economic developments matched the selected taxonomy filters.
          </div>
        ) : (
          filteredStories.map((story) => (
            <div
              key={story.id}
              onClick={() => onSelectStory(story)}
              className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg hover:border-amber-700 dark:hover:border-amber-500 transition-colors cursor-pointer group"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-mono">
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{story.jurisdiction}</span>
                  <span aria-hidden="true">·</span>
                  <span>{story.institutions.join(', ')}</span>
                  <span aria-hidden="true">·</span>
                  <span>{story.publicationDate}</span>
                </div>
                <div className="text-xs font-mono text-amber-800 dark:text-amber-400 font-semibold">
                  Significance: {story.significanceScore}/100
                </div>
              </div>

              <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mt-2 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
                {story.headline}
              </h2>

              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mt-2 leading-relaxed">
                {story.factualSummary}
              </p>

              {/* Taxonomy & Theoretical Framework Line */}
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3 text-stone-600 dark:text-stone-400 font-mono text-[11px]">
                  <span>Field: <strong className="text-stone-800 dark:text-stone-200">{story.classification.join(', ')}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Mechanism: <strong className="text-stone-800 dark:text-stone-200">{story.mechanisms.join(', ')}</strong></span>
                </div>
                <div className="inline-flex items-center gap-1 font-semibold text-amber-800 dark:text-amber-400 text-xs font-mono">
                  Inspect Analytical Dossier →
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
