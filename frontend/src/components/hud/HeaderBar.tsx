import React from 'react';
import { Layers, Play, RefreshCw, Cpu, Gauge } from 'lucide-react';
import { useGraphStore } from '../../store/useGraphStore';

export const HeaderBar: React.FC = () => {
  const totalTokens = useGraphStore((s) => s.totalTokens);
  const maxLimit = useGraphStore((s) => s.maxContextLimit);
  const isCompiling = useGraphStore((s) => s.isCompiling);
  const compileGraph = useGraphStore((s) => s.compileGraph);
  const resetGraph = useGraphStore((s) => s.resetGraph);

  const usagePercent = Math.min(100, Math.round((totalTokens / maxLimit) * 100));

  let budgetColor = 'bg-emerald-400';
  let budgetTextColor = 'text-emerald-400';
  if (usagePercent > 75) {
    budgetColor = 'bg-amber-400';
    budgetTextColor = 'text-amber-400';
  }
  if (usagePercent > 90) {
    budgetColor = 'bg-rose-500';
    budgetTextColor = 'text-rose-400';
  }

  return (
    <header className="h-14 border-b border-white/10 bg-canvas-surface/80 backdrop-blur-xl px-4 flex items-center justify-between z-20 select-none">
      {/* Brand & Workspace */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-cyan-500/30 to-purple-500/30 border border-cyan-400/30 text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wider font-mono text-slate-100">
                LOOM
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                ContextGraph v0.1
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans hidden sm:block">
              Spatial Canvas & Node-Based Prompt Debugger
            </p>
          </div>
        </div>

        <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-900/60 px-2 py-1 rounded border border-white/5">
          <span className="text-slate-500 text-[10px]">WORKSPACE:</span>
          <span className="text-slate-200 font-semibold">ws_01</span>
        </div>
      </div>

      {/* Center Token Budget Progress Bar */}
      <div className="flex items-center gap-3 max-w-xs w-full mx-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-[11px] font-mono mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-slate-500" /> Token Budget
            </span>
            <span className={`font-semibold ${budgetTextColor}`}>
              {totalTokens} <span className="text-slate-500 font-normal">/ {maxLimit}t</span> ({usagePercent}%)
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${budgetColor} transition-all duration-300 rounded-full`}
              style={{ width: `${Math.max(2, usagePercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={resetGraph}
          title="Reset to Blueprint Seed Graph"
          className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={compileGraph}
          disabled={isCompiling}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-mono font-semibold transition-all shadow-md shadow-cyan-950/40 disabled:opacity-50"
        >
          <Play className={`w-3.5 h-3.5 ${isCompiling ? 'animate-spin' : ''}`} />
          <span>{isCompiling ? 'Compiling...' : 'Compile DAG'}</span>
        </button>
      </div>
    </header>
  );
};

// HeaderBar budget threshold calculations 1

// HeaderBar budget threshold calculations 2

// HeaderBar budget threshold calculations 3

// HeaderBar budget threshold calculations 4

// HeaderBar budget threshold calculations 5

// HeaderBar budget threshold calculations 6

// HeaderBar budget threshold calculations 7

// HeaderBar budget threshold calculations 8

// HeaderBar budget threshold calculations 9

// HeaderBar budget threshold calculations 10
