import React from 'react';
import { DailyBriefing, EconomicStory, PolicyItem, ResearchPaper } from '../types/index.ts';
import { ArrowRight, ShieldCheck, ChevronRight, Globe, Layers, BookOpen, AlertCircle } from 'lucide-react';

interface DailyBriefViewProps {
  briefing: DailyBriefing | null;
  stories: EconomicStory[];
  policies: PolicyItem[];
  research: ResearchPaper[];
  onSelectStory: (story: EconomicStory) => void;
  onNavigateTab: (tab: string) => void;
}

export const DailyBriefView: React.FC<DailyBriefViewProps> = ({
  briefing,
  stories,
  policies,
  research,
  onSelectStory,
  onNavigateTab
}) => {
  if (!briefing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-8 border border-stone-200 dark:border-stone-800 rounded-lg bg-stone-100/50 dark:bg-stone-900/50 space-y-4">
          <div className="inline-flex p-3 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <AlertCircle className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Initializing Daily Economic Briefing
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto">
            Retrieving today's classified macro bulletins, institutional policy trackers, and theoretical frameworks.
          </p>
          <div className="pt-2">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-stone-900 rounded hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 cursor-pointer"
            >
              Refresh Observatory
            </button>
          </div>
        </div>
      </div>
    );
  }

  const leadStory = stories.find((s) => s.id === briefing.leadStoryId) || stories[0];
  const secondaryStories = stories
    .filter((s) => s.id !== leadStory?.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Editorial Edition Metadata Bar */}
      <div className="flex flex-wrap items-baseline justify-between border-b border-stone-300 dark:border-stone-800 pb-3 gap-2">
        <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400 font-mono">
          <span className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-widest">
            Edition {briefing.editionDate}
          </span>
          <span aria-hidden="true">·</span>
          <span>Last Ingested: {new Date(briefing.generatedAt).toLocaleTimeString()} UTC</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Primary Institutional Sources ({briefing.sourcesQueriedCount} queried)
          </span>
        </div>
        <div className="text-xs text-stone-500 font-mono">
          {briefing.articlesIngestedCount} bulletins processed
        </div>
      </div>

      {/* Main Editorial Hero: Split Columns (Lead Story & Executive Macro Synthesis) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Lead Story: 7 Cols */}
        {leadStory && (
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs uppercase tracking-widest font-mono text-amber-800 dark:text-amber-400 font-semibold">
              Primary Lead Economic Development
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 leading-tight">
              {leadStory.headline}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-mono">
              <span className="font-medium text-stone-800 dark:text-stone-200">{leadStory.jurisdiction}</span>
              <span aria-hidden="true">·</span>
              <span>{leadStory.institutions.join(', ')}</span>
              <span aria-hidden="true">·</span>
              <span>Event Date: {leadStory.eventDate || leadStory.publicationDate}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-800 dark:text-amber-400 font-semibold">Significance {leadStory.significanceScore}/100</span>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-stone-800 dark:text-stone-200 font-sans">
              {leadStory.factualSummary}
            </p>

            <div className="p-4 bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded">
              <div className="text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-400 mb-1 font-sans">
                Theoretical Transmission Channel:
              </div>
              <div className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
                {leadStory.economicMechanismsDetail}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onSelectStory(leadStory)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-stone-900 hover:bg-stone-800 rounded dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 transition-colors"
              >
                Inspect Analytical Dossier
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Executive Summary & Macro Environment: 5 Cols */}
        <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-stone-200 dark:lg:border-stone-800 lg:pl-8">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-400 mb-2 font-sans">
              Executive Environment Synthesis
            </div>
            <p className="text-sm leading-relaxed text-stone-800 dark:text-stone-200 font-sans bg-amber-50/40 dark:bg-amber-950/20 p-4 border border-amber-200/60 dark:border-amber-900/40 rounded">
              {briefing.executiveSummary}
            </p>
          </div>

          {/* Macro Environment Pillars */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-400 font-sans">
              Key Macroeconomic Pillars
            </div>

            <div className="text-xs space-y-2">
              <div className="p-2.5 border border-stone-200 dark:border-stone-800 rounded bg-white dark:bg-stone-900">
                <span className="font-semibold text-stone-900 dark:text-stone-100 font-sans">Monetary Stance: </span>
                <span className="text-stone-600 dark:text-stone-300">{briefing.environmentOverview.monetaryStance}</span>
              </div>
              <div className="p-2.5 border border-stone-200 dark:border-stone-800 rounded bg-white dark:bg-stone-900">
                <span className="font-semibold text-stone-900 dark:text-stone-100 font-sans">Fiscal Outlook: </span>
                <span className="text-stone-600 dark:text-stone-300">{briefing.environmentOverview.fiscalOutlook}</span>
              </div>
              <div className="p-2.5 border border-stone-200 dark:border-stone-800 rounded bg-white dark:bg-stone-900">
                <span className="font-semibold text-stone-900 dark:text-stone-100 font-sans">Stability Alerts: </span>
                <span className="text-stone-600 dark:text-stone-300">{briefing.environmentOverview.financialStabilityAlerts}</span>
              </div>
              <div className="p-2.5 border border-stone-200 dark:border-stone-800 rounded bg-white dark:bg-stone-900">
                <span className="font-semibold text-stone-900 dark:text-stone-100 font-sans">Cross-Border Risks: </span>
                <span className="text-stone-600 dark:text-stone-300">{briefing.environmentOverview.crossBorderRisks}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Section Divider */}
      <div className="border-t border-stone-200 dark:border-stone-800 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
            Significant Daily Economic Developments
          </h2>
          <button
            onClick={() => onNavigateTab('macro-markets')}
            className="text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1"
          >
            View All Classified Stories <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Secondary Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {secondaryStories.map((story) => (
            <div
              key={story.id}
              onClick={() => onSelectStory(story)}
              className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded hover:border-amber-700 dark:hover:border-amber-500 transition-colors cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                  <span>{story.jurisdiction}</span>
                  <span aria-hidden="true">·</span>
                  <span>{story.institutions[0]}</span>
                </div>
                <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 mt-2 line-clamp-2">
                  {story.headline}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 line-clamp-3">
                  {story.factualSummary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px] flex items-center justify-between text-stone-500 font-mono">
                <span>{story.classification[0]}</span>
                <span className="text-amber-800 dark:text-amber-400 font-medium">Read Dossier →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Macroeconomic Summaries Grid */}
      <div className="border-t border-stone-200 dark:border-stone-800 pt-6">
        <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-stone-600 dark:text-stone-400" />
          Geographical & Regional Classifications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(briefing.regionalSummary).map(([region, summary]) => (
            <div
              key={region}
              className="p-3.5 bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 rounded"
            >
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-1">
                {region}
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {summary}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Policy & Research Radar Highlights Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-t border-stone-200 dark:border-stone-800 pt-6">
        
        {/* Latest Policy Actions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-stone-600" />
              Active Policy & Regulatory Actions
            </h3>
            <button
              onClick={() => onNavigateTab('policy-tracker')}
              className="text-xs text-amber-800 dark:text-amber-400 hover:underline font-mono"
            >
              Full Policy Tracker →
            </button>
          </div>
          <div className="space-y-2">
            {policies.slice(0, 2).map((pol) => (
              <div
                key={pol.id}
                className="p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded text-xs"
              >
                <div className="flex items-center justify-between text-stone-500 font-mono text-[11px]">
                  <span>{pol.jurisdiction} · {pol.institution}</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200 uppercase">{pol.status}</span>
                </div>
                <div className="font-medium text-stone-900 dark:text-stone-100 mt-1">
                  {pol.title}
                </div>
                <div className="text-stone-500 dark:text-stone-400 mt-1 line-clamp-1">
                  Target: {pol.targetedEconomicProblem}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Academic Research */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-stone-600" />
              New Academic Research & Working Papers
            </h3>
            <button
              onClick={() => onNavigateTab('research-radar')}
              className="text-xs text-amber-800 dark:text-amber-400 hover:underline font-mono"
            >
              Full Research Radar →
            </button>
          </div>
          <div className="space-y-2">
            {research.slice(0, 2).map((paper) => (
              <div
                key={paper.id}
                className="p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded text-xs"
              >
                <div className="flex items-center justify-between text-stone-500 font-mono text-[11px]">
                  <span>{paper.institution} · {paper.format}</span>
                  <span>{paper.publicationDate}</span>
                </div>
                <div className="font-medium text-stone-900 dark:text-stone-100 mt-1">
                  {paper.title}
                </div>
                <div className="text-stone-500 dark:text-stone-400 mt-1 line-clamp-1">
                  By {paper.authors.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
