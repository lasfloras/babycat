import React from 'react';
import { X, ExternalLink, BookOpen, AlertCircle, TrendingUp, Layers, HelpCircle, GitFork } from 'lucide-react';
import { EconomicStory, EconomicConnection } from '../types/index.ts';

interface StoryDetailModalProps {
  story: EconomicStory | null;
  connections?: EconomicConnection[];
  onClose: () => void;
  onSelectStory?: (id: string) => void;
}

export const StoryDetailModal: React.FC<StoryDetailModalProps> = ({
  story,
  connections = [],
  onClose,
  onSelectStory
}) => {
  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl text-stone-900 dark:text-stone-100">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-stone-900/95 backdrop-blur border-b border-stone-200 dark:border-stone-800 px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 dark:text-stone-400 font-sans">
              <span className="font-semibold text-stone-800 dark:text-stone-200">{story.jurisdiction}</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span>{story.originalSource}</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span className="font-mono">Pub: {story.publicationDate}</span>
              {story.eventDate && story.eventDate !== story.publicationDate && (
                <>
                  <span aria-hidden="true" className="text-stone-400">·</span>
                  <span className="font-mono">Event: {story.eventDate}</span>
                </>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold mt-2 text-stone-900 dark:text-stone-100 leading-snug">
              {story.headline}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded text-stone-500 hover:text-stone-900 hover:bg-stone-100 dark:hover:text-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">

          {/* Institutional traceability notice */}
          <div className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 rounded text-xs text-stone-600 dark:text-stone-300">
            <div>
              <span className="font-semibold text-stone-900 dark:text-stone-100">Primary Source Traceability:</span> Verified institutional bulletin from {story.institutions.join(', ')}.
            </div>
            <a
              href={story.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-amber-800 dark:text-amber-400 hover:underline shrink-0 ml-4"
            >
              Original Record <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Section: Factual Summary */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-400 mb-2">
              1. Established Factual Record (Non-Speculative)
            </h3>
            <p className="text-sm leading-relaxed text-stone-800 dark:text-stone-200 bg-stone-50/50 dark:bg-stone-800/30 p-4 rounded border border-stone-200/60 dark:border-stone-800">
              {story.factualSummary}
            </p>
          </div>

          {/* Section: Classification & Theoretical Frameworks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-stone-200 dark:border-stone-800 rounded bg-stone-50/30 dark:bg-stone-950/30">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-400 mb-2">
                Economic Taxonomy
              </h4>
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-stone-500">Fields: </span>
                  <span className="font-medium text-stone-800 dark:text-stone-200">
                    {story.classification.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500">Mechanisms: </span>
                  <span className="font-medium text-stone-800 dark:text-stone-200">
                    {story.mechanisms.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border border-stone-200 dark:border-stone-800 rounded bg-stone-50/30 dark:bg-stone-950/30">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-400 mb-2">
                Theoretical Frameworks Applied
              </h4>
              <ul className="list-disc list-inside text-xs space-y-1 text-stone-800 dark:text-stone-200">
                {story.theoreticalFrameworks.map((t, idx) => (
                  <li key={idx} className="font-medium">{t}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section: Economic Transmission Mechanisms */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-400 mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              2. Transmission Mechanisms & Micro-Foundations
            </h3>
            <p className="text-sm leading-relaxed text-stone-800 dark:text-stone-200">
              {story.economicMechanismsDetail}
            </p>
          </div>

          {/* Section: Implications (Near-Term vs Structural) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border border-stone-200 dark:border-stone-800 rounded">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-400 mb-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-stone-600" />
                Near-Term Implications
              </h4>
              <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                {story.possibleImplications.nearTerm.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-stone-400 font-bold">·</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 border border-stone-200 dark:border-stone-800 rounded">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-400 mb-2 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-stone-600" />
                Structural & Institutional Effects
              </h4>
              <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                {story.possibleImplications.structural.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-stone-400 font-bold">·</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section: Distributional Effects & Balance Sheets */}
          {story.distributionalEffects && (
            <div>
              <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-400 mb-1.5">
                3. Distributional & Institutional Balance Sheet Effects
              </h3>
              <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                {story.distributionalEffects}
              </p>
            </div>
          )}

          {/* Section: Uncertainty & Alternative Counterarguments */}
          <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-900 dark:text-amber-300 mb-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Epistemic Caveat: Uncertainty & Alternative Explanations
            </h4>
            <p className="text-sm leading-relaxed text-amber-950 dark:text-amber-200">
              {story.uncertaintyAndAlternatives}
            </p>
          </div>

          {/* Section: Academic Citations */}
          {story.academicResearchCitations.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-400 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-stone-600" />
                4. Relevant Academic Research & Empirical Literature
              </h3>
              <div className="space-y-2.5">
                {story.academicResearchCitations.map((cit, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 border border-stone-200/80 dark:border-stone-800 rounded bg-stone-50/40 dark:bg-stone-900 text-xs"
                  >
                    <div className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
                      "{cit.paperTitle}"
                    </div>
                    <div className="text-stone-600 dark:text-stone-400 mt-1">
                      {cit.authors} ({cit.year}) · <span className="italic">{cit.sourceOrJournal}</span>
                    </div>
                    <div className="mt-1.5 text-stone-700 dark:text-stone-300 leading-relaxed">
                      <span className="font-semibold text-stone-900 dark:text-stone-200">Core Finding: </span>
                      {cit.keyFinding}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Potential Research Questions & Indicators to Watch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 border-t border-stone-200 dark:border-stone-800">
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-400 mb-2 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                Potential Research Questions
              </h4>
              <ul className="list-disc list-inside text-xs space-y-1.5 text-stone-700 dark:text-stone-300 leading-relaxed">
                {story.potentialResearchQuestions.map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-400 mb-2">
                Future Indicators to Watch
              </h4>
              <ul className="list-disc list-inside text-xs space-y-1.5 text-stone-700 dark:text-stone-300 leading-relaxed">
                {story.futureIndicatorsToWatch.map((ind, idx) => (
                  <li key={idx} className="font-medium">{ind}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section: Related Connections */}
          {connections.length > 0 && (
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
              <h4 className="text-xs uppercase tracking-widest font-mono text-stone-500 dark:text-stone-400 mb-2 flex items-center gap-1.5">
                <GitFork className="w-4 h-4" />
                Active Economic Connections ({connections.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {connections.map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 border border-stone-200 dark:border-stone-800 rounded bg-stone-50/50 dark:bg-stone-900 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] text-amber-800 dark:text-amber-400 font-mono capitalize">
                      <span>{c.type}</span>
                      <span className="text-stone-400 lowercase">{c.confidence}</span>
                    </div>
                    <div className="font-medium text-stone-900 dark:text-stone-100 mt-1">
                      {c.sourceId === story.id ? c.targetTitle : c.sourceTitle}
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1">
                      {c.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-stone-50 dark:bg-stone-950 px-6 py-3 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center text-xs text-stone-500">
          <span>Economic Observatory Intelligence Record · ID: {story.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-medium text-stone-800 bg-white border border-stone-300 rounded hover:bg-stone-100 dark:bg-stone-900 dark:text-stone-200 dark:border-stone-700 dark:hover:bg-stone-800"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
};
