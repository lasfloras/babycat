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

  // Data States
  const [briefings, setBriefings] = useState<DailyBriefing[]>([]);
  const [currentBriefing, setCurrentBriefing] = useState<DailyBriefing | null>(null);
  const [stories, setStories] = useState<EconomicStory[]>([]);
  const [policies, setPolicies] = useState<PolicyItem[]>([]);
  const [research, setResearch] = useState<ResearchPaper[]>([]);
  const [indicators, setIndicators] = useState<EconomicIndicator[]>([]);
  const [connections, setConnections] = useState<EconomicConnection[]>([]);
  const [graphNodes, setGraphNodes] = useState<any[]>([]);
  const [sources, setSources] = useState<SourceConfig[]>([]);
  const [pipelineStatus, setPipelineStatus] = useState<PipelineExecutionStatus | null>(null);
  const [isPipelineRunning, setIsPipelineRunning] = useState<boolean>(false);

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

  // Load all initial application data
  const loadData = useCallback(async () => {
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
        fetch('/api/briefings').then((r) => r.json()),
        fetch('/api/briefings/latest').then((r) => r.json()),
        fetch('/api/stories').then((r) => r.json()),
        fetch('/api/policies').then((r) => r.json()),
        fetch('/api/research').then((r) => r.json()),
        fetch('/api/indicators').then((r) => r.json()),
        fetch('/api/connections').then((r) => r.json()),
        fetch('/api/sources').then((r) => r.json()),
        fetch('/api/pipeline/status').then((r) => r.json())
      ]);

      setBriefings(briefingsRes);
      setCurrentBriefing(latestBriefingRes);
      setStories(storiesRes);
      setPolicies(policiesRes);
      setResearch(researchRes);
      setIndicators(indicatorsRes);
      setConnections(connectionsRes.connections || []);
      setGraphNodes(connectionsRes.nodes || []);
      setSources(sourcesRes);
      setPipelineStatus(statusRes);
    } catch (err) {
      console.error('Failed to load observatory datasets:', err);
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
