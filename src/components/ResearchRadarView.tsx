import React, { useState, useMemo } from 'react';
import { ResearchPaper } from '../types/index.ts';
import { BookOpen, ExternalLink, Filter, Search, FileText, CheckCircle2 } from 'lucide-react';

interface ResearchRadarViewProps {
  research: ResearchPaper[];
}

export const ResearchRadarView: React.FC<ResearchRadarViewProps> = ({ research }) => {
  const [selectedInst, setSelectedInst] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const institutions = useMemo(() => {
    const set = new Set<string>();
    research.forEach((r) => set.add(r.institution));
    return Array.from(set);
  }, [research]);

  const filtered = useMemo(() => {
    return research.filter((p) => {
      if (selectedInst !== 'all' && p.institution !== selectedInst) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesAuthor = p.authors.some((a) => a.toLowerCase().includes(q));
        const matchesQuestion = p.researchQuestion.toLowerCase().includes(q);
        const matchesField = p.field.toLowerCase().includes(q);
        if (!matchesTitle && !matchesAuthor && !matchesQuestion && !matchesField) {
          return false;
        }
      }
      return true;
    });
  }, [research, selectedInst, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Editorial Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
          Academic Research Radar & Frontier Working Papers
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-3xl">
          Empirical and theoretical economic literature from the NBER, CEPR, BIS, and central bank research networks. Distinguishes peer-reviewed findings from working papers with verified abstract vs. full-text identification.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-stone-100/60 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 rounded-lg flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papers by author, research question, methodology, or topic..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono text-stone-500 uppercase text-[10px]">Institution:</span>
          <select
            value={selectedInst}
            onChange={(e) => setSelectedInst(e.target.value)}
            className="px-2.5 py-1.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-800 dark:text-stone-200"
          >
            <option value="all">All Institutions</option>
            {institutions.map((inst) => (
              <option key={inst} value={inst}>{inst}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Research Papers Grid */}
      <div className="space-y-4">
        {filtered.map((paper) => {
          const isExpanded = expandedId === paper.id;
          return (
            <div
              key={paper.id}
              className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg space-y-3"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 dark:text-stone-400 font-sans">
                  <span className="font-bold text-stone-900 dark:text-stone-100">{paper.institution}</span>
                  <span aria-hidden="true" className="text-stone-400">·</span>
                  <span>{paper.format}</span>
                  <span aria-hidden="true" className="text-stone-400">·</span>
                  <span className="font-mono">{paper.publicationDate}</span>
                  <span aria-hidden="true" className="text-stone-400">·</span>
                  <span>{paper.field}</span>
                </div>

                <div className="flex items-center gap-2">
                  {paper.isAbstractOnly ? (
                    <span className="text-[11px] font-sans font-semibold text-amber-800 dark:text-amber-400">
                      [Abstract-Based Analysis]
                    </span>
                  ) : (
                    <span className="text-[11px] font-sans font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Full-Text Access
                    </span>
                  )}
                  <a
                    href={paper.paperUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                    title="View Original Paper"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-stone-100 leading-snug">
                {paper.title}
              </h2>

              <div className="text-xs text-stone-600 dark:text-stone-400 font-medium">
                Authors: {paper.authors.join(', ')}
              </div>

              {/* Research Question Box */}
              <div className="p-3.5 bg-stone-50 dark:bg-stone-950/40 border border-stone-200/60 dark:border-stone-800 rounded text-xs space-y-1">
                <div className="text-stone-500 text-[10px] uppercase tracking-wider font-semibold font-sans">
                  Core Research Question
                </div>
                <div className="text-stone-800 dark:text-stone-200 leading-relaxed italic text-sm">
                  "{paper.researchQuestion}"
                </div>
              </div>

              {/* Methodology */}
              <div className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                <span className="font-semibold text-stone-900 dark:text-stone-100 font-sans">Econometric / Theoretical Methodology: </span>
                {paper.methodology}
              </div>

              {/* Main Empirical Findings */}
              <div className="space-y-1.5 text-xs">
                <div className="font-semibold text-stone-900 dark:text-stone-100 text-[11px] uppercase tracking-wider font-sans">
                  Key Findings & Identification
                </div>
                <ul className="list-disc list-inside space-y-1 text-stone-700 dark:text-stone-300">
                  {paper.mainFindings.map((finding, idx) => (
                    <li key={idx} className="leading-relaxed">{finding}</li>
                  ))}
                </ul>
              </div>

              {/* Expandable Limitations & Literature Contribution */}
              {isExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-stone-200 dark:border-stone-800 text-xs">
                  <div>
                    <div className="uppercase text-stone-500 text-[10px] font-semibold mb-1 font-sans">
                      Contribution to Existing Literature
                    </div>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                      {paper.contribution}
                    </p>
                    <div className="mt-2 text-stone-500 text-[11px]">
                      <span className="font-semibold">Related Predecessor Work: </span>
                      {paper.relatedPreviousResearch.join('; ')}
                    </div>
                  </div>

                  <div>
                    <div className="uppercase text-stone-500 text-[10px] font-semibold mb-1 font-sans">
                      Analytical & Methodological Limitations
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-stone-600 dark:text-stone-400">
                      {paper.limitations.map((lim, idx) => (
                        <li key={idx}>{lim}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="pt-1 flex items-center justify-between text-xs">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : paper.id)}
                  className="text-amber-800 dark:text-amber-400 font-medium hover:underline font-sans"
                >
                  {isExpanded ? 'Collapse Academic Review' : 'Inspect Contribution & Limitations ↓'}
                </button>
                <span className="text-stone-400 text-[11px] font-sans">
                  Format: {paper.format}
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
