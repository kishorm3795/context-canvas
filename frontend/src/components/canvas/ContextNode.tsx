import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { FileText, VolumeX, Volume2, Hash, Sparkles } from 'lucide-react';
import { useGraphStore } from '../../store/useGraphStore';
import type { TokenHighlight } from '../../types/graph';

export const ContextNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const toggleMute = useGraphStore((s) => s.toggleMute);
  const updateNodeData = useGraphStore((s) => s.updateNodeData);

  const title = (data.title as string) || 'Context Chunk';
  const content = (data.content as string) || '';
  const tokenCount = Number(data.token_count) || 0;
  const isMuted = Boolean(data.muted);
  const weight = Number(data.weight ?? 1.0);
  const attributionScore = data.attribution_score !== undefined ? Number(data.attribution_score) : null;
  const tokenHighlights = (data.token_highlights as TokenHighlight[]) || [];

  return (
    <div
      className={`glass-panel w-84 rounded-xl transition-all duration-200 overflow-hidden ${
        isMuted
          ? 'opacity-40 grayscale border-slate-700/50'
          : selected
          ? 'ring-2 ring-amber-400 shadow-amber-500/20 shadow-xl'
          : 'hover:border-amber-500/40'
      }`}
    >
      <div className="glass-panel-header px-3.5 py-2.5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-amber-500/20 text-amber-400">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold tracking-wide text-slate-200 font-mono truncate max-w-[140px]">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {attributionScore !== null && !isMuted && (
            <span className="flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-2.5 h-2.5" />
              {(attributionScore * 100).toFixed(0)}%
            </span>
          )}

          <span className="flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
            <Hash className="w-2.5 h-2.5" />
            {tokenCount}t
          </span>

          <button
            onClick={() => toggleMute(id)}
            title={isMuted ? 'Unmute Context Node' : 'Mute Context Node'}
            className={`p-1 rounded transition-colors ${
              isMuted
                ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
          </button>
        </div>
      </div>

      <div className="p-3 space-y-2.5">
        <textarea
          className="w-full h-20 bg-slate-950/60 border border-white/5 rounded-md p-2 text-xs text-slate-300 font-sans resize-none focus:outline-none focus:border-amber-500/50 leading-relaxed"
          value={content}
          onChange={(e) => updateNodeData(id, { content: e.target.value })}
          placeholder="Retrieved context chunk or document..."
        />

        {/* Sensitivity Weight Slider */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-500">Weight</span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={weight}
              disabled={isMuted}
              onChange={(e) => updateNodeData(id, { weight: parseFloat(e.target.value) })}
              className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400 disabled:opacity-50"
            />
            <span className="w-8 text-right text-slate-300 font-medium">{weight.toFixed(2)}</span>
          </div>
        </div>

        {/* Influential Token Highlights */}
        {tokenHighlights.length > 0 && !isMuted && (
          <div className="pt-1.5 border-t border-white/5">
            <div className="text-[9px] uppercase tracking-wider text-slate-500 font-mono mb-1">
              Top Influential Tokens:
            </div>
            <div className="flex flex-wrap gap-1">
              {tokenHighlights.map((th, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 border border-amber-500/30 text-amber-200"
                >
                  "{th.token}" <span className="opacity-70 text-[9px]">({th.score.toFixed(2)})</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!bg-amber-400 !border-slate-900"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-amber-400 !border-slate-900"
      />
    </div>
  );
};

// ContextNode slider and mute logic 1

// ContextNode slider and mute logic 2

// ContextNode slider and mute logic 3

// ContextNode slider and mute logic 4

// ContextNode slider and mute logic 5

// ContextNode slider and mute logic 6

// ContextNode slider and mute logic 7

// ContextNode slider and mute logic 8

// ContextNode slider and mute logic 9

// ContextNode slider and mute logic 10

// ContextNode slider and mute logic 11

// Token highlight pill rendering 1

// Token highlight pill rendering 2

// Token highlight pill rendering 3

// Token highlight pill rendering 4

// Token highlight pill rendering 5

// Token highlight pill rendering 6

// Token highlight pill rendering 7
