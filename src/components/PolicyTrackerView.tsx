import React, { useState, useMemo } from 'react';
import { PolicyItem, PolicyStatus } from '../types/index.ts';
import { Plus, Filter, Calendar, ExternalLink, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface PolicyTrackerViewProps {
  policies: PolicyItem[];
  onAddPolicy: (policy: PolicyItem) => Promise<void>;
}

export const PolicyTrackerView: React.FC<PolicyTrackerViewProps> = ({ policies, onAddPolicy }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [expandedPolicyId, setExpandedPolicyId] = useState<string | null>(null);

  // New policy form state
  const [newTitle, setNewTitle] = useState('');
  const [newJurisdiction, setNewJurisdiction] = useState('United States');
  const [newInstitution, setNewInstitution] = useState('');
  const [newStatus, setNewStatus] = useState<PolicyStatus>('Proposed');
  const [newAnnounceDate, setNewAnnounceDate] = useState(new Date().toISOString().split('T')[0]);
  const [newProblem, setNewProblem] = useState('');
  const [newTransmission, setNewTransmission] = useState('');
  const [newWinners, setNewWinners] = useState('');
  const [newLosers, setNewLosers] = useState('');
  const [newUnintended, setNewUnintended] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const jurisdictions = useMemo(() => {
    const set = new Set<string>();
    policies.forEach((p) => set.add(p.jurisdiction));
    return Array.from(set);
  }, [policies]);

  const filtered = useMemo(() => {
    return policies.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (selectedJurisdiction !== 'all' && p.jurisdiction !== selectedJurisdiction) return false;
      return true;
    });
  }, [policies, statusFilter, selectedJurisdiction]);

  const handleCreatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newInstitution.trim()) return;

    setIsSubmitting(true);
    try {
      const item: PolicyItem = {
        id: `policy-${Date.now()}`,
        title: newTitle.trim(),
        jurisdiction: newJurisdiction,
        institution: newInstitution.trim(),
        status: newStatus,
        announcementDate: newAnnounceDate,
        targetedEconomicProblem: newProblem.trim() || 'Macroeconomic stabilization and market structure',
        expectedTransmissionMechanisms: newTransmission
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        winners: newWinners.split(',').map((s) => s.trim()).filter(Boolean),
        losers: newLosers.split(',').map((s) => s.trim()).filter(Boolean),
        unintendedConsequences: newUnintended.split(',').map((s) => s.trim()).filter(Boolean),
        relatedStoryIds: []
      };

      await onAddPolicy(item);
      setShowAddModal(false);
      // Reset
      setNewTitle('');
      setNewInstitution('');
      setNewProblem('');
      setNewTransmission('');
      setNewWinners('');
      setNewLosers('');
      setNewUnintended('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: PolicyStatus) => {
    switch (status) {
      case 'Implemented':
        return 'text-emerald-700 dark:text-emerald-400 font-bold';
      case 'Enacted':
        return 'text-blue-700 dark:text-blue-400 font-bold';
      case 'Consultation':
        return 'text-amber-700 dark:text-amber-400 font-bold';
      case 'Proposed':
        return 'text-stone-600 dark:text-stone-400 font-medium';
      default:
        return 'text-stone-500 font-medium';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Editorial Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Institutional Policy & Regulatory Tracker
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
            Systematic surveillance of proposed, enacted, and implemented central bank decisions and government economic interventions.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-stone-900 hover:bg-stone-800 rounded dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 transition-colors self-start shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Track New Policy
        </button>
      </div>

      {/* Filter Segmented Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-stone-100/70 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 rounded">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-mono text-stone-500 uppercase text-[10px]">Status:</span>
          {(['all', 'Proposed', 'Consultation', 'Enacted', 'Implemented', 'Under Review'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === st
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold'
                  : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
              }`}
            >
              {st === 'all' ? 'All Statuses' : st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono text-stone-500 uppercase text-[10px]">Jurisdiction:</span>
          <select
            value={selectedJurisdiction}
            onChange={(e) => setSelectedJurisdiction(e.target.value)}
            className="px-2 py-1 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-800 dark:text-stone-200 text-xs"
          >
            <option value="all">All Jurisdictions</option>
            {jurisdictions.map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Policy Table / Dossier Cards */}
      <div className="space-y-4">
        {filtered.map((policy) => {
          const isExpanded = expandedPolicyId === policy.id;
          return (
            <div
              key={policy.id}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-5 transition-colors"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-mono">
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{policy.jurisdiction}</span>
                  <span aria-hidden="true">·</span>
                  <span>{policy.institution}</span>
                  <span aria-hidden="true">·</span>
                  <span>Announced: {policy.announcementDate}</span>
                  {policy.effectiveDate && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>Effective: {policy.effectiveDate}</span>
                    </>
                  )}
                </div>
                <div className={`text-xs font-mono uppercase tracking-wider ${getStatusBadge(policy.status)}`}>
                  Status: {policy.status}
                </div>
              </div>

              <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mt-2">
                {policy.title}
              </h2>

              <div className="mt-3 text-xs leading-relaxed text-stone-700 dark:text-stone-300">
                <span className="font-semibold text-stone-900 dark:text-stone-100 font-sans">Targeted Economic Problem: </span>
                {policy.targetedEconomicProblem}
              </div>

              {/* Transmission Mechanism & Breakdown */}
              <div className="mt-3 p-3.5 bg-stone-50 dark:bg-stone-950/40 rounded border border-stone-200/60 dark:border-stone-800 text-xs space-y-2">
                <div>
                  <span className="font-sans font-semibold text-stone-600 dark:text-stone-400 uppercase text-[10px] tracking-wider">Expected Transmission Channels: </span>
                  <span className="text-stone-800 dark:text-stone-200 font-medium font-sans">
                    {policy.expectedTransmissionMechanisms.join(', ') || 'Direct central bank operational implementation'}
                  </span>
                </div>

                {isExpanded && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2.5 border-t border-stone-200 dark:border-stone-800">
                    <div>
                      <div className="font-sans text-[10px] text-emerald-800 dark:text-emerald-400 font-bold uppercase tracking-wider">
                        Anticipated Beneficiaries (Winners)
                      </div>
                      <ul className="list-disc list-inside mt-1 text-[11px] text-stone-700 dark:text-stone-300 space-y-0.5 leading-relaxed">
                        {policy.winners.map((w, idx) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="font-sans text-[10px] text-rose-800 dark:text-rose-400 font-bold uppercase tracking-wider">
                        Cost Bearers (Losers)
                      </div>
                      <ul className="list-disc list-inside mt-1 text-[11px] text-stone-700 dark:text-stone-300 space-y-0.5 leading-relaxed">
                        {policy.losers.map((l, idx) => (
                          <li key={idx}>{l}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="font-sans text-[10px] text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider">
                        Potential Unintended Consequences
                      </div>
                      <ul className="list-disc list-inside mt-1 text-[11px] text-stone-700 dark:text-stone-300 space-y-0.5 leading-relaxed">
                        {policy.unintendedConsequences.map((u, idx) => (
                          <li key={idx}>{u}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs pt-1">
                <button
                  onClick={() => setExpandedPolicyId(isExpanded ? null : policy.id)}
                  className="text-amber-800 dark:text-amber-400 font-mono font-medium hover:underline"
                >
                  {isExpanded ? 'Hide Transmission & Distributional Analysis' : 'Expand Transmission & Distributional Analysis ↓'}
                </button>
                {policy.previousPolicyVersion && (
                  <span className="text-stone-400 font-mono text-[11px]">
                    Predecessor: {policy.previousPolicyVersion}
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal: Add Policy */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg max-w-xl w-full p-6 space-y-4 shadow-xl">
            <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
              Track New Institutional Policy Intervention
            </h2>
            
            <form onSubmit={handleCreatePolicy} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-mono uppercase text-[10px] mb-1">
                  Policy Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Standing Liquidity Facility Corridor Revision"
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
                    Institution
                  </label>
                  <input
                    type="text"
                    required
                    value={newInstitution}
                    onChange={(e) => setNewInstitution(e.target.value)}
                    placeholder="e.g. Federal Reserve, Bank of England"
                    className="w-full px-3 py-1.5 border border-stone-300 dark:border-stone-700 rounded bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 dark:text-stone-300 font-mono uppercase text-[10px] mb-1">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as PolicyStatus)}
                    className="w-full px-3 py-1.5 border border-stone-300 dark:border-stone-700 rounded bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                  >
                    <option value="Proposed">Proposed</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Enacted">Enacted</option>
                    <option value="Implemented">Implemented</option>
                    <option value="Under Review">Under Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-300 font-mono uppercase text-[10px] mb-1">
                    Announcement Date
                  </label>
                  <input
                    type="date"
                    value={newAnnounceDate}
                    onChange={(e) => setNewAnnounceDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-300 dark:border-stone-700 rounded bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-mono uppercase text-[10px] mb-1">
                  Targeted Economic Problem
                </label>
                <textarea
                  rows={2}
                  value={newProblem}
                  onChange={(e) => setNewProblem(e.target.value)}
                  placeholder="The specific macroeconomic or market failure targeted..."
                  className="w-full px-3 py-1.5 border border-stone-300 dark:border-stone-700 rounded bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-mono uppercase text-[10px] mb-1">
                  Expected Transmission Channels (comma separated)
                </label>
                <input
                  type="text"
                  value={newTransmission}
                  onChange={(e) => setNewTransmission(e.target.value)}
                  placeholder="e.g. Bank lending channel, Liquidity buffer requirements"
                  className="w-full px-3 py-1.5 border border-stone-300 dark:border-stone-700 rounded bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 dark:text-stone-300 font-mono uppercase text-[10px] mb-1">
                    Beneficiaries / Winners
                  </label>
                  <input
                    type="text"
                    value={newWinners}
                    onChange={(e) => setNewWinners(e.target.value)}
                    placeholder="e.g. Regional banks, mortgage borrowers"
                    className="w-full px-3 py-1.5 border border-stone-300 dark:border-stone-700 rounded bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 dark:text-stone-300 font-mono uppercase text-[10px] mb-1">
                    Cost Bearers / Losers
                  </label>
                  <input
                    type="text"
                    value={newLosers}
                    onChange={(e) => setNewLosers(e.target.value)}
                    placeholder="e.g. Speculative short sellers"
                    className="w-full px-3 py-1.5 border border-stone-300 dark:border-stone-700 rounded bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                  />
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
                  {isSubmitting ? 'Saving...' : 'Add to Tracker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
