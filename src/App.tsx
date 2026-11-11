import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { IndicatorStrip } from './components/IndicatorStrip.tsx';
import { DailyBriefView } from './components/DailyBriefView.tsx';
import { MacroMarketsView } from './components/MacroMarketsView.tsx';
import { PolicyTrackerView } from './components/PolicyTrackerView.tsx';
import { InternationalFinanceView } from './components/InternationalFinanceView.tsx';
import { ResearchRadarView } from './components/ResearchRadarView.tsx';
import { EconomicConnectionsView } from './components/EconomicConnectionsView.tsx';
import { HistoricalArchiveView } from './components/HistoricalArchiveView.tsx';
import { SettingsSourcesView } from './components/SettingsSourcesView.tsx';
import { StoryDetailModal } from './components/StoryDetailModal.tsx';
import {
  DailyBriefing,
  EconomicStory,
  PolicyItem,
  ResearchPaper,
  EconomicIndicator,
  EconomicConnection,
  SourceConfig,
  PipelineExecutionStatus
} from './types/index.ts';
import {
  initialBriefings,
  initialStories,
  initialPolicies,
  initialResearch,
  initialIndicators,
  initialConnections,
  initialSources
} from './server/storage/seedData.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('daily-brief');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eo_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Pre-seed Data States with initial institutional dataset so UI never hangs indefinitely
  const [briefings, setBriefings] = useState<DailyBriefing[]>(initialBriefings);
  const [currentBriefing, setCurrentBriefing] = useState<DailyBriefing | null>(initialBriefings[0] || null);
  const [stories, setStories] = useState<EconomicStory[]>(initialStories);
  const [policies, setPolicies] = useState<PolicyItem[]>(initialPolicies);
  const [research, setResearch] = useState<ResearchPaper[]>(initialResearch);
  const [indicators, setIndicators] = useState<EconomicIndicator[]>(initialIndicators);
  const [connections, setConnections] = useState<EconomicConnection[]>(initialConnections);
  const [graphNodes, setGraphNodes] = useState<any[]>([]);
  const [sources, setSources] = useState<SourceConfig[]>(initialSources);
  const [pipelineStatus, setPipelineStatus] = useState<PipelineExecutionStatus | null>(null);
  const [isPipelineRunning, setIsPipelineRunning] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'connected' | 'syncing' | 'snapshot'>('syncing');

  // Selected story for modal dossier
  const [selectedStory, setSelectedStory] = useState<EconomicStory | null>(null);
  const [storyConnections, setStoryConnections] = useState<EconomicConnection[]>([]);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('eo_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('eo_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Safe fetch helper verifying HTTP ok and JSON content-type
  const safeFetch = async <T,>(url: string, fallback: T): Promise<{ data: T; ok: boolean }> => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        return { data: fallback, ok: false };
      }
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return { data: fallback, ok: false };
      }
      const data = await res.json();
      return { data, ok: true };
    } catch {
      return { data: fallback, ok: false };
    }
  };

  // Load all initial application data
  const loadData = useCallback(async () => {
    setSyncStatus('syncing');
    try {
      const [
        briefingsRes,
        latestBriefingRes,
        storiesRes,
        policiesRes,
        researchRes,
        indicatorsRes,
        connectionsRes,
        sourcesRes,
        statusRes
      ] = await Promise.all([
        safeFetch<DailyBriefing[]>('/api/briefings', initialBriefings),
        safeFetch<DailyBriefing>('/api/briefings/latest', initialBriefings[0]),
        safeFetch<EconomicStory[]>('/api/stories', initialStories),
        safeFetch<PolicyItem[]>('/api/policies', initialPolicies),
        safeFetch<ResearchPaper[]>('/api/research', initialResearch),
        safeFetch<EconomicIndicator[]>('/api/indicators', initialIndicators),
        safeFetch<{ connections?: EconomicConnection[]; nodes?: any[] }>('/api/connections', {
          connections: initialConnections,
          nodes: []
        }),
        safeFetch<SourceConfig[]>('/api/sources', initialSources),
        safeFetch<PipelineExecutionStatus | null>('/api/pipeline/status', null)
      ]);

      const anySuccessful = [
        briefingsRes,
        latestBriefingRes,
        storiesRes,
        policiesRes,
        researchRes,
        indicatorsRes,
        connectionsRes,
        sourcesRes
      ].some((r) => r.ok);

      setBriefings(briefingsRes.data);
      if (latestBriefingRes.data) {
        setCurrentBriefing(latestBriefingRes.data);
      }
      setStories(storiesRes.data);
      setPolicies(policiesRes.data);
      setResearch(researchRes.data);
      setIndicators(indicatorsRes.data);
      setConnections(connectionsRes.data.connections || initialConnections);
      setGraphNodes(connectionsRes.data.nodes || []);
      setSources(sourcesRes.data);
      if (statusRes.data) {
        setPipelineStatus(statusRes.data);
      }

      setSyncStatus(anySuccessful ? 'connected' : 'snapshot');
    } catch (err) {
      console.warn('Failed to refresh observatory datasets:', err);
      setSyncStatus('snapshot');
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Story click handler
  const handleSelectStory = async (story: EconomicStory) => {
    setSelectedStory(story);
    try {
      const detail = await fetch(`/api/stories/${story.id}`).then((r) => r.json());
      setStoryConnections(detail.connections || []);
    } catch {
      setStoryConnections(
        connections.filter((c) => c.sourceId === story.id || c.targetId === story.id)
      );
    }
  };

  // Pipeline manual execution
  const handleRunPipeline = async () => {
    if (isPipelineRunning) return;
    setIsPipelineRunning(true);
    try {
      await fetch('/api/pipeline/run', { method: 'POST' });
      // Poll status every 1.5 seconds until done
      const interval = setInterval(async () => {
        try {
          const status = await fetch('/api/pipeline/status').then((r) => r.json());
          setPipelineStatus(status);
          if (status.status !== 'running') {
            clearInterval(interval);
            setIsPipelineRunning(false);
            loadData(); // refresh fresh data
          }
        } catch {
          clearInterval(interval);
          setIsPipelineRunning(false);
        }
      }, 1500);
    } catch (err) {
      console.error('Failed to trigger pipeline:', err);
      setIsPipelineRunning(false);
    }
  };

  // Source management handlers
  const handleAddSource = async (newSource: SourceConfig) => {
    await fetch('/api/sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSource)
    });
    const updated = await fetch('/api/sources').then((r) => r.json());
    setSources(updated);
  };

  const handleDeleteSource = async (id: string) => {
    await fetch(`/api/sources/${id}`, { method: 'DELETE' });
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  const handleToggleSource = async (updatedSource: SourceConfig) => {
    await fetch('/api/sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSource)
    });
    setSources((prev) =>
      prev.map((s) => (s.id === updatedSource.id ? updatedSource : s))
    );
  };

  // Policy handler
  const handleAddPolicy = async (policy: PolicyItem) => {
    const saved = await fetch('/api/policies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(policy)
    }).then((r) => r.json());
    setPolicies((prev) => [saved, ...prev]);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 flex flex-col font-sans transition-colors">
      
      {/* Editorial Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
        pipelineStatus={pipelineStatus}
        onRunPipeline={handleRunPipeline}
        isPipelineRunning={isPipelineRunning}
      />

      {/* Global Economic Indicator Benchmark Strip */}
      <IndicatorStrip
        indicators={indicators}
        onSelectIndicator={(ind) => {
          setCurrentTab('macro-markets');
        }}
      />

      {/* Snapshot / Offline Fallback Status Indicator */}
      {syncStatus === 'snapshot' && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-900 dark:text-amber-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>
                <strong>Archive Snapshot Active:</strong> Displaying verified baseline institutional briefings and indicators while live serverless sync initializes.
              </span>
            </div>
            <button
              onClick={() => loadData()}
              className="px-2.5 py-1 text-xs font-semibold bg-amber-600 text-white rounded hover:bg-amber-700 cursor-pointer transition-colors"
            >
              Retry Live Sync
            </button>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1">
        {currentTab === 'daily-brief' && (
          <DailyBriefView
            briefing={currentBriefing}
            stories={stories}
            policies={policies}
            research={research}
            onSelectStory={handleSelectStory}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'macro-markets' && (
          <MacroMarketsView
            stories={stories}
            onSelectStory={handleSelectStory}
          />
        )}

        {currentTab === 'policy-tracker' && (
          <PolicyTrackerView
            policies={policies}
            onAddPolicy={handleAddPolicy}
          />
        )}

        {currentTab === 'international-finance' && (
          <InternationalFinanceView indicators={indicators} />
        )}

        {currentTab === 'research-radar' && (
          <ResearchRadarView research={research} />
        )}

        {currentTab === 'connections' && (
          <EconomicConnectionsView
            connections={connections}
            nodes={graphNodes}
            onSelectNode={(nodeId) => {
              const matchedStory = stories.find((s) => s.id === nodeId);
              if (matchedStory) handleSelectStory(matchedStory);
            }}
          />
        )}

        {currentTab === 'archive' && (
          <HistoricalArchiveView
            briefings={briefings}
            stories={stories}
            onSelectStory={handleSelectStory}
            onSelectBriefingDate={(date) => {
              const b = briefings.find((x) => x.editionDate === date);
              if (b) {
                setCurrentBriefing(b);
                setCurrentTab('daily-brief');
              }
            }}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsSourcesView
            sources={sources}
            pipelineStatus={pipelineStatus}
            onRunPipeline={handleRunPipeline}
            isPipelineRunning={isPipelineRunning}
            onAddSource={handleAddSource}
            onDeleteSource={handleDeleteSource}
            onToggleSource={handleToggleSource}
          />
        )}
      </main>

      {/* Analytical Story Dossier Modal */}
      <StoryDetailModal
        story={selectedStory}
        connections={storyConnections}
        onClose={() => setSelectedStory(null)}
        onSelectStory={(id) => {
          const next = stories.find((s) => s.id === id);
          if (next) handleSelectStory(next);
        }}
      />

      {/* Editorial Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-6 text-xs text-stone-500 font-mono transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold font-serif text-stone-800 dark:text-stone-200 text-sm">
              Economic Observatory
            </span>{' '}
            · Institutional Macroeconomics & Financial Intelligence Platform
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Primary Sources: Fed, ECB, BIS, IMF, OECD, NBER, BLS, PBOC</span>
            <span>·</span>
            <span>Scheduled Daily Pipeline: Active</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
