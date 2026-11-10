import React, { useState, useMemo } from 'react';
import { EconomicConnection, ConnectionType } from '../types/index.ts';
import { GitFork, History, Network, Filter, ArrowRight, ShieldAlert, Info } from 'lucide-react';

interface EconomicConnectionsViewProps {
  connections: EconomicConnection[];
  nodes: Array<{ id: string; label: string; type: string; jurisdiction?: string; date?: string }>;
  onSelectNode?: (id: string) => void;
}

export const EconomicConnectionsView: React.FC<EconomicConnectionsViewProps> = ({
  connections,
  nodes,
  onSelectNode
}) => {
  const [viewMode, setViewMode] = useState<'graph' | 'timeline'>('graph');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedConnection, setSelectedConnection] = useState<EconomicConnection | null>(null);

  const filteredConnections = useMemo(() => {
    if (selectedType === 'all') return connections;
    return connections.filter((c) => c.type === selectedType);
  }, [connections, selectedType]);

  // Types list
  const connectionTypes: ConnectionType[] = [
    'continuation',
    'institutional relationship',
    'theoretical connection',
    'historical analogy',
    'causal hypothesis',
    'contradictory evidence'
  ];

  // SVG Coordinates calculation for interactive network graph
  const graphLayout = useMemo(() => {
    const width = 800;
    const height = 480;
    const centerX = width / 2;
    const centerY = height / 2;

    // Collect all unique node IDs in filtered connections
    const connectedNodeIds = new Set<string>();
    filteredConnections.forEach((c) => {
      connectedNodeIds.add(c.sourceId);
      connectedNodeIds.add(c.targetId);
    });

    const activeNodes = nodes.filter((n) => connectedNodeIds.has(n.id));
    const total = activeNodes.length || 1;

    const nodePositions = new Map<string, { x: number; y: number; node: any }>();
    activeNodes.forEach((node, i) => {
      const angle = (i / total) * 2 * Math.PI;
      const radius = node.type === 'historical' ? 200 : node.type === 'story' ? 140 : 180;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      nodePositions.set(node.id, { x, y, node });
    });

    return { width, height, nodePositions, activeNodes };
  }, [filteredConnections, nodes]);

  const getTypeColor = (type: ConnectionType) => {
    switch (type) {
      case 'continuation':
        return '#0284c7'; // sky blue
      case 'theoretical connection':
        return '#7c3aed'; // purple
      case 'historical analogy':
        return '#d97706'; // amber
      case 'institutional relationship':
        return '#059669'; // emerald
      case 'causal hypothesis':
        return '#2563eb'; // blue
      case 'contradictory evidence':
        return '#dc2626'; // crimson
      default:
        return '#78716c';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Persistent Economic Connections & Precedent Explorer
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-3xl">
            Empirical relationship mapping linking contemporary policy actions to theoretical frameworks, predecessor decisions, and historical market analogies without assuming false causation.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded self-start shrink-0 text-xs font-mono">
          <button
            onClick={() => setViewMode('graph')}
            className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
              viewMode === 'graph'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm font-semibold'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            Visual Explorer
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
              viewMode === 'timeline'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm font-semibold'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Chronological Timeline
          </button>
        </div>
      </div>

      {/* Relationship Type Filters */}
      <div className="p-3 bg-stone-100/70 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 rounded flex flex-wrap items-center gap-2 text-xs">
        <span className="font-mono text-stone-500 uppercase text-[10px]">Filter Relationship Type:</span>
        <button
          onClick={() => setSelectedType('all')}
          className={`px-2.5 py-1 rounded transition-colors ${
            selectedType === 'all'
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold'
              : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800'
          }`}
        >
          All Types ({connections.length})
        </button>
        {connectionTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type === selectedType ? 'all' : type)}
            className={`px-2.5 py-1 rounded transition-colors capitalize ${
              selectedType === type
                ? 'bg-amber-800 text-white dark:bg-amber-700 font-semibold'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Main View Area */}
      {viewMode === 'graph' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Interactive SVG Network Graph (8 Cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-4 overflow-hidden relative">
            <div className="flex items-center justify-between text-xs text-stone-500 font-mono mb-2">
              <span>Interactive Relationship Graph ({graphLayout.activeNodes.length} nodes · {filteredConnections.length} links)</span>
              <span>Click links or nodes to inspect analytical comparison</span>
            </div>

            <div className="w-full flex items-center justify-center overflow-x-auto">
              <svg
                viewBox={`0 0 ${graphLayout.width} ${graphLayout.height}`}
                className="w-full max-w-[800px] h-[480px] select-none"
              >
                {/* Edges / Connections */}
                {filteredConnections.map((conn) => {
                  const srcPos = graphLayout.nodePositions.get(conn.sourceId);
                  const tgtPos = graphLayout.nodePositions.get(conn.targetId);
                  if (!srcPos || !tgtPos) return null;

                  const isSelected = selectedConnection?.id === conn.id;
                  const color = getTypeColor(conn.type);

                  return (
                    <g key={conn.id} onClick={() => setSelectedConnection(conn)} className="cursor-pointer">
                      <line
                        x1={srcPos.x}
                        y1={srcPos.y}
                        x2={tgtPos.x}
                        y2={tgtPos.y}
                        stroke={color}
                        strokeWidth={isSelected ? 3 : 1.5}
                        strokeDasharray={conn.type === 'historical analogy' ? '4 3' : undefined}
                        opacity={isSelected ? 1 : 0.65}
                      />
                      {/* Edge Label Pill */}
                      <rect
                        x={(srcPos.x + tgtPos.x) / 2 - 35}
                        y={(srcPos.y + tgtPos.y) / 2 - 8}
                        width={70}
                        height={16}
                        rx={3}
                        fill="#1c1917"
                        opacity={0.8}
                      />
                      <text
                        x={(srcPos.x + tgtPos.x) / 2}
                        y={(srcPos.y + tgtPos.y) / 2 + 3}
                        fontSize={8}
                        fontFamily="monospace"
                        textAnchor="middle"
                        fill="#fafaf9"
                      >
                        {conn.type.slice(0, 11)}
                      </text>
                    </g>
                  );
                })}

                {/* Nodes */}
                {Array.from(graphLayout.nodePositions.values()).map(({ x, y, node }) => {
                  const isHistorical = node.type === 'historical';
                  const isPolicy = node.type === 'policy';
                  const isResearch = node.type === 'research';

                  return (
                    <g
                      key={node.id}
                      onClick={() => onSelectNode && onSelectNode(node.id)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={isHistorical ? 16 : 14}
                        fill={
                          isHistorical
                            ? '#b45309'
                            : isPolicy
                            ? '#0369a1'
                            : isResearch
                            ? '#4f46e5'
                            : '#292524'
                        }
                        stroke="#fafaf9"
                        strokeWidth={2}
                      />
                      <text
                        x={x}
                        y={y + 24}
                        fontSize={10}
                        fontFamily="sans-serif"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="fill-stone-800 dark:fill-stone-200"
                      >
                        {node.label.length > 20 ? `${node.label.slice(0, 20)}...` : node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-stone-500 pt-3 border-t border-stone-100 dark:border-stone-800">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#292524]"></span> Story
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0369a1]"></span> Policy
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4f46e5]"></span> Research Paper
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#b45309]"></span> Historical Precedent
              </span>
            </div>
          </div>

          {/* Connection Inspector Panel (4 Cols) */}
          <div className="lg:col-span-4 p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg space-y-4">
            <div className="font-mono uppercase tracking-widest text-stone-500 text-[10px] font-semibold flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Connection Inspector & Precedent Analysis
            </div>

            {selectedConnection ? (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="text-[10px] font-mono uppercase text-amber-800 dark:text-amber-400 font-bold">
                    Relationship: {selectedConnection.type} ({selectedConnection.confidence})
                  </div>
                  <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm mt-1">
                    {selectedConnection.sourceTitle}
                  </h3>
                  <div className="text-stone-400 font-mono text-[10px] my-1">linked to:</div>
                  <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {selectedConnection.targetTitle}
                  </h3>
                </div>

                <div className="p-3 bg-stone-50 dark:bg-stone-950/60 rounded border border-stone-200 dark:border-stone-800">
                  <div className="font-mono text-stone-500 uppercase text-[10px] mb-1 font-semibold">
                    Analytical Rationale
                  </div>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                    {selectedConnection.rationale}
                  </p>
                </div>

                {selectedConnection.historicalPrecedent && (
                  <div className="p-3 bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded space-y-2">
                    <div className="font-mono text-amber-900 dark:text-amber-300 text-[10px] font-bold uppercase">
                      Historical Analogy: {selectedConnection.historicalPrecedent.era}
                    </div>
                    <p className="text-stone-700 dark:text-stone-300 text-[11px] leading-relaxed">
                      {selectedConnection.historicalPrecedent.description}
                    </p>
                    <div className="pt-1 text-[11px]">
                      <strong className="text-stone-900 dark:text-stone-100">Key Similarity: </strong>
                      <span className="text-stone-700 dark:text-stone-300">
                        {selectedConnection.historicalPrecedent.keySimilarity}
                      </span>
                    </div>
                    <div className="text-[11px]">
                      <strong className="text-stone-900 dark:text-stone-100">Key Difference: </strong>
                      <span className="text-stone-700 dark:text-stone-300">
                        {selectedConnection.historicalPrecedent.keyDifference}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-stone-500 text-xs">
                Select an edge or connection in the network to inspect the analytical rationale and comparative historical precedent.
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Chronological Timeline Mode */
        <div className="space-y-4">
          <div className="text-xs text-stone-500 font-mono">
            Chronological Evolution of Macroeconomic Policy Regimes and Market Events
          </div>
          <div className="border-l-2 border-stone-300 dark:border-stone-700 ml-4 pl-6 space-y-6">
            {connections.map((c) => (
              <div key={c.id} className="relative group">
                <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-stone-900 dark:bg-stone-100 border-2 border-white dark:border-stone-900"></div>
                
                <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-xs space-y-2">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-amber-800 dark:text-amber-400 font-bold uppercase">{c.type}</span>
                    <span className="text-stone-400">{c.confidence}</span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                    {c.sourceTitle} → {c.targetTitle}
                  </h3>
                  <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                    {c.rationale}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
