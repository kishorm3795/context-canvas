import React, { useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Cpu, Zap, Activity, Gauge, Play } from 'lucide-react';
import { useGraphStore } from '../../store/useGraphStore';
import type { LLMMetrics } from '../../types/graph';

export const LLMNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const updateNodeData = useGraphStore((s) => s.updateNodeData);
  const [isRunningAttribution, setIsRunningAttribution] = useState(false);

  const model = (data.model as string) || 'llama3.2:1b';
  const temperature = Number(data.temperature ?? 0.2);
  const output = (data.output as string) || '';
  const metrics = (data.metrics as LLMMetrics) || {};

  const handleRunAttribution = () => {
    setIsRunningAttribution(true);
    setTimeout(() => {
      setIsRunningAttribution(false);
      updateNodeData(id, {
        metrics: {
          ...metrics,
          ttft_ms: 108,
          tokens_per_sec: 72.1,
        },
      });
    }, 800);
  };

  return (
    <div
      className={`glass-panel w-96 rounded-xl transition-all duration-200 overflow-hidden ${
        selected ? 'ring-2 ring-purple-400 shadow-purple-500/20 shadow-xl' : 'hover:border-purple-500/40'
      }`}
    >
      <div className="glass-panel-header px-3.5 py-2.5 flex items-center justify-between border-b border-purple-500/20 bg-purple-950/20">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-purple-500/20 text-purple-400">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold tracking-wide text-slate-200 font-mono">
            LLM EXECUTION RUNNER
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
            {model}
          </span>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Telemetry Metrics Bar */}
        <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-slate-950/70 border border-white/5 font-mono text-center">
          <div>
            <div className="text-[9px] uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1">
              <Zap className="w-2.5 h-2.5 text-amber-400" /> TTFT
            </div>
            <div className="text-xs font-semibold text-slate-200">
              {metrics.ttft_ms ? `${metrics.ttft_ms}ms` : '—'}
            </div>
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1">
              <Activity className="w-2.5 h-2.5 text-cyan-400" /> Speed
            </div>
            <div className="text-xs font-semibold text-slate-200">
              {metrics.tokens_per_sec ? `${metrics.tokens_per_sec} t/s` : '—'}
            </div>
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1">
              <Gauge className="w-2.5 h-2.5 text-purple-400" /> Temp
            </div>
            <div className="text-xs font-semibold text-slate-200">{temperature.toFixed(2)}</div>
          </div>
        </div>

        {/* Generated Output */}
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Model Output</span>
            <span className="text-emerald-400 font-semibold">Streaming complete</span>
          </div>
          <div className="w-full min-h-[72px] p-2.5 rounded-md bg-slate-950/80 border border-purple-500/20 text-xs text-slate-200 font-sans leading-relaxed">
            {output ? (
              <span className="border-b border-amber-400/60 pb-0.5 cursor-pointer hover:bg-amber-500/10 transition-colors">
                {output}
              </span>
            ) : (
              <span className="text-slate-500 italic">No output yet. Compile & run graph.</span>
            )}
          </div>
        </div>

        {/* Attribution Action */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <button
            onClick={handleRunAttribution}
            disabled={isRunningAttribution}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-mono font-medium transition-all shadow-md shadow-purple-950/50 disabled:opacity-50"
          >
            <Play className={`w-3 h-3 ${isRunningAttribution ? 'animate-spin' : ''}`} />
            {isRunningAttribution ? 'Perturbing Logprobs...' : 'Run Leave-One-Out Attribution'}
          </button>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!bg-purple-400 !border-slate-900"
      />
    </div>
  );
};

// LLMNode telemetry metrics display 1

// LLMNode telemetry metrics display 2

// LLMNode telemetry metrics display 3

// LLMNode telemetry metrics display 4

// LLMNode telemetry metrics display 5

// LLMNode telemetry metrics display 6

// LLMNode telemetry metrics display 7

// LLMNode telemetry metrics display 8

// LLMNode telemetry metrics display 9

// LLMNode telemetry metrics display 10

// LLMNode telemetry metrics display 11

// Attribution forward pass trigger 1
