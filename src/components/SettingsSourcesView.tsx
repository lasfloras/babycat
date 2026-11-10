import React, { useState } from 'react';
import { SourceConfig, PipelineExecutionStatus } from '../types/index.ts';
import { Plus, RefreshCw, Trash2, CheckCircle, AlertCircle, Terminal, ExternalLink, ShieldCheck } from 'lucide-react';

interface SettingsSourcesViewProps {
  sources: SourceConfig[];
  pipelineStatus: PipelineExecutionStatus | null;
  onRunPipeline: () => void;
  isPipelineRunning: boolean;
  onAddSource: (source: SourceConfig) => Promise<void>;
  onDeleteSource: (id: string) => Promise<void>;
  onToggleSource: (source: SourceConfig) => Promise<void>;
}

export const SettingsSourcesView: React.FC<SettingsSourcesViewProps> = ({
  sources,
  pipelineStatus,
  onRunPipeline,
  isPipelineRunning,
  onAddSource,
  onDeleteSource,
  onToggleSource
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newInstitution, setNewInstitution] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newJurisdiction, setNewJurisdiction] = useState('Global');
  const [newCategory, setNewCategory] = useState('Monetary Policy');
  const [newType, setNewType] = useState<'rss' | 'api'>('rss');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;

    setIsSubmitting(true);
    try {
      const source: SourceConfig = {
        id: `custom-src-${Date.now()}`,
        name: newName.trim(),
        institution: newInstitution.trim() || newName.trim(),
        url: newUrl.trim(),
        jurisdiction: newJurisdiction.trim(),
        category: newCategory.trim(),
        type: newType,
        active: true,
        lastChecked: undefined,
        itemCount: 0
      };

      await onAddSource(source);
      setShowAddModal(false);
      setNewName('');
      setNewInstitution('');
      setNewUrl('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
          Source Management & Pipeline Orchestration
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-3xl">
          Configure primary institutional feeds, monitor scheduled daily ingestion runs, and trigger on-demand macroeconomic analysis pipelines.
        </p>
      </div>

      {/* Pipeline Control Dashboard */}
      <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-stone-500 font-semibold">
              Daily Processing Pipeline Status
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2.5 h-2.5 rounded-full ${
                pipelineStatus?.status === 'running'
                  ? 'bg-amber-500 animate-pulse'
                  : pipelineStatus?.status === 'error'
                  ? 'bg-rose-500'
                  : 'bg-emerald-500'
              }`} />
              <span className="text-base font-serif font-bold text-stone-900 dark:text-stone-100 capitalize">
                {pipelineStatus?.status === 'running'
                  ? 'Pipeline Currently Running'
                  : pipelineStatus?.status === 'error'
                  ? 'Execution Error Encountered'
                  : 'Idle · Up to Date'}
              </span>
              {pipelineStatus?.currentStage && (
                <span className="text-xs text-stone-500 font-mono">
                  ({pipelineStatus.currentStage})
                </span>
              )}
            </div>
            <div className="text-xs text-stone-500 font-mono mt-1">
              Last Execution: {pipelineStatus?.lastRunTimestamp ? new Date(pipelineStatus.lastRunTimestamp).toLocaleString() : 'Never'}
            </div>
          </div>

          <button
            onClick={onRunPipeline}
            disabled={isPipelineRunning}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-amber-800 hover:bg-amber-900 rounded dark:bg-amber-700 dark:hover:bg-amber-600 transition-colors disabled:opacity-50 self-start shrink-0 font-mono"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPipelineRunning ? 'animate-spin' : ''}`} />
            {isPipelineRunning ? 'Running Ingestion Pipeline...' : 'Run Pipeline Now'}
          </button>
        </div>

        {/* Pipeline Execution Logs */}
        {pipelineStatus?.logs && pipelineStatus.logs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-1.5 text-xs font-mono text-stone-500 uppercase tracking-wider mb-2">
              <Terminal className="w-3.5 h-3.5" />
              Pipeline Execution Log Stream
            </div>
            <div className="p-3 bg-stone-950 text-stone-300 font-mono text-[11px] rounded max-h-48 overflow-y-auto space-y-1">
              {pipelineStatus.logs.slice(-10).map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sources Registry */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              Configured Institutional Sources ({sources.length})
            </h2>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              Primary central banks, statistical agencies, and economic research repositories
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-stone-900 hover:bg-stone-800 rounded dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 transition-colors self-start shrink-0 font-mono"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Custom Source
          </button>
        </div>

        <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-900">
          <table className="w-full text-left text-xs text-stone-700 dark:text-stone-300">
            <thead className="bg-stone-100/80 dark:bg-stone-900/80 border-b border-stone-200 dark:border-stone-800 font-mono text-[10px] uppercase tracking-wider text-stone-500">
              <tr>
                <th className="py-2.5 px-4">Source & Institution</th>
                <th className="py-2.5 px-4">Jurisdiction</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Last Ingestion</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/60 dark:divide-stone-800">
              {sources.map((src) => (
                <tr key={src.id} className="hover:bg-stone-50 dark:hover:bg-stone-900/40">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-stone-900 dark:text-stone-100">{src.name}</div>
                    <div className="text-[11px] text-stone-400 font-mono truncate max-w-sm">{src.url}</div>
                  </td>
                  <td className="py-3 px-4 font-mono">{src.jurisdiction}</td>
                  <td className="py-3 px-4 font-mono">{src.category}</td>
                  <td className="py-3 px-4 font-mono uppercase">{src.type}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-stone-500">
                    {src.lastChecked ? new Date(src.lastChecked).toLocaleDateString() : 'Pending'}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onToggleSource({ ...src, active: !src.active })}
                      className={`text-xs font-mono font-semibold ${
                        src.active
                          ? 'text-emerald-800 dark:text-emerald-400'
                          : 'text-stone-400'
                      }`}
                    >
                      {src.active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {src.id.startsWith('custom-src-') && (
                      <button
                        onClick={() => onDeleteSource(src.id)}
                        className="text-rose-600 hover:text-rose-800 p-1"
                        title="Delete custom source"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GitHub Actions Scheduled Automation Guidance */}
      <div className="p-5 bg-stone-100/60 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-800 rounded-lg space-y-3 text-xs">
        <div className="font-mono uppercase text-stone-500 text-[10px] font-bold">
          Autonomous Daily Ingestion Workflow (GitHub Actions)
        </div>
        <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
          The pipeline is scheduled via <code className="bg-stone-200 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">.github/workflows/daily-pipeline.yml</code> to run automatically every morning at 06:00 UTC prior to market open. It can also be invoked manually from GitHub or via CLI with <code className="bg-stone-200 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">npm run pipeline</code>.
        </p>
      </div>

      {/* Modal: Add Source */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
              Register New Economic Source Feed
            </h2>
            
            <form onSubmit={handleCreateSource} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-mono uppercase text-[10px] mb-1">
                  Source Feed Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Bank of England Monetary Policy Releases"
                  className="w-full px-3 py-1.5 border border-stone-300 dark:border-stone-700 rounded bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-mono uppercase text-[10px] mb-1">
                  Responsible Institution
                </label>
                <input
                  type="text"
                  required
                  value={newInstitution}
                  onChange={(e) => setNewInstitution(e.target.value)}
                  placeholder="e.g. Bank of England"
                  className="w-full px-3 py-1.5 border border-stone-300 dark:border-stone-700 rounded bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-mono uppercase text-[10px] mb-1">
                  RSS/Atom or Public API URL
                </label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://institution.gov/rss/press.xml"
                  className="w-full px-3 py-1.5 border border-stone-300 dark:border-stone-700 rounded bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 dark:text-stone-300 font-mono uppercase text-[10px] mb-1">
                    Jurisdiction
                  </label>
                  <input
                    type="text"
                    required
                    value={newJurisdiction}
                    onChange={(e) => setNewJurisdiction(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-300 dark:border-stone-700 rounded bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-300 font-mono uppercase text-[10px] mb-1">
                    Feed Protocol
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-stone-300 dark:border-stone-700 rounded bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                  >
                    <option value="rss">RSS / Atom</option>
                    <option value="api">Public API</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-stone-300 rounded text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-stone-900 text-white rounded dark:bg-stone-100 dark:text-stone-900 font-medium hover:bg-stone-800 disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering...' : 'Add Source'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
