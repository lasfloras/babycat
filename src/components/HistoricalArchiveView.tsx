import React, { useState, useMemo } from 'react';
import { DailyBriefing, EconomicStory } from '../types/index.ts';
import { Search, Calendar, Download, BookOpen, ExternalLink } from 'lucide-react';

interface HistoricalArchiveViewProps {
  briefings: DailyBriefing[];
  stories: EconomicStory[];
  onSelectStory: (story: EconomicStory) => void;
  onSelectBriefingDate: (date: string) => void;
}

export const HistoricalArchiveView: React.FC<HistoricalArchiveViewProps> = ({
  briefings,
  stories,
  onSelectStory,
  onSelectBriefingDate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('all');

  const filteredStories = useMemo(() => {
    return stories.filter((s) => {
      if (selectedDate !== 'all' && s.publicationDate !== selectedDate) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.headline.toLowerCase().includes(q) ||
          s.factualSummary.toLowerCase().includes(q) ||
          s.institutions.some((i) => i.toLowerCase().includes(q)) ||
          s.classification.some((c) => c.toLowerCase().includes(q)) ||
          s.theoreticalFrameworks.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [stories, selectedDate, searchQuery]);

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ briefings, stories }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `economic_observatory_archive_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Historical Archive & Structured Records Repository
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-3xl">
            Complete indexed repository of past daily briefings, classified stories, and persistent institutional records.
          </p>
        </div>

        <button
          onClick={handleExportJson}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-stone-800 bg-white border border-stone-300 rounded hover:bg-stone-50 dark:bg-stone-900 dark:text-stone-200 dark:border-stone-700 dark:hover:bg-stone-800 transition-colors self-start shrink-0 font-mono"
        >
          <Download className="w-3.5 h-3.5" />
          Export JSON Archive
        </button>
      </div>

      {/* Historical Editions Rail */}
      <div className="p-4 bg-stone-100/60 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 rounded-lg space-y-3">
        <div className="font-mono text-stone-500 uppercase text-[10px] tracking-wider font-semibold">
          Daily Editions Archive ({briefings.length} archived editions)
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedDate('all')}
            className={`px-3 py-1.5 text-xs rounded transition-colors font-mono ${
              selectedDate === 'all'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold'
                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
            }`}
          >
            All Archived Stories
          </button>
          {briefings.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedDate(b.editionDate)}
              className={`px-3 py-1.5 text-xs rounded transition-colors font-mono ${
                selectedDate === b.editionDate
                  ? 'bg-amber-800 text-white dark:bg-amber-700 font-semibold'
                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
              }`}
            >
              Edition {b.editionDate}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search full historical records by headline, theory, institution, or empirical finding..."
          className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
        />
      </div>

      {/* Archived Stories Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
          <span>Displaying {filteredStories.length} archived records</span>
          {selectedDate !== 'all' && <span>Filtered to: {selectedDate}</span>}
        </div>

        {filteredStories.map((story) => (
          <div
            key={story.id}
            onClick={() => onSelectStory(story)}
            className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg hover:border-amber-700 dark:hover:border-amber-500 transition-colors cursor-pointer"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-stone-500 font-mono">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-800 dark:text-stone-200">{story.publicationDate}</span>
                <span aria-hidden="true">·</span>
                <span>{story.jurisdiction}</span>
                <span aria-hidden="true">·</span>
                <span>{story.institutions.join(', ')}</span>
              </div>
              <span className="text-amber-800 dark:text-amber-400 font-medium">Score: {story.significanceScore}</span>
            </div>

            <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100 mt-1">
              {story.headline}
            </h3>

            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 line-clamp-2">
              {story.factualSummary}
            </p>

            <div className="mt-2 text-[11px] font-mono text-stone-500 flex flex-wrap gap-2">
              <span>{story.classification.join(', ')}</span>
              <span aria-hidden="true">·</span>
              <span>Framework: {story.theoreticalFrameworks[0]}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
