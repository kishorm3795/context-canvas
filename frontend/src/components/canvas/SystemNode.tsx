import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ShieldCheck, Pin, Hash } from 'lucide-react';
import { useGraphStore } from '../../store/useGraphStore';

export const SystemNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const updateNodeData = useGraphStore((s) => s.updateNodeData);
  const title = (data.title as string) || 'System Persona';
  const content = (data.content as string) || '';
  const tokenCount = Number(data.token_count) || 0;

  return (
    <div
      className={`glass-panel w-80 rounded-xl transition-all duration-200 overflow-hidden ${
        selected ? 'ring-2 ring-emerald-400 shadow-emerald-500/20 shadow-xl' : 'hover:border-emerald-500/40'
      }`}
    >
      <div className="glass-panel-header px-3.5 py-2.5 flex items-center justify-between border-b border-emerald-500/20 bg-emerald-950/20">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold tracking-wide text-slate-200 uppercase font-mono">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Pin className="w-2.5 h-2.5" /> Pinned
          </span>
          <span className="flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
            <Hash className="w-2.5 h-2.5" />
            {tokenCount}t
          </span>
        </div>
      </div>

      <div className="p-3">
        <textarea
          className="w-full h-20 bg-slate-950/60 border border-white/5 rounded-md p-2 text-xs text-slate-300 font-sans resize-none focus:outline-none focus:border-emerald-500/50 leading-relaxed"
          value={content}
          onChange={(e) => updateNodeData(id, { content: e.target.value })}
          placeholder="System instructions & persona..."
        />
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-emerald-400 !border-slate-900"
      />
    </div>
  );
};

// SystemNode styling & accessibility check 1

// SystemNode styling & accessibility check 2

// SystemNode styling & accessibility check 3

// SystemNode styling & accessibility check 4

// SystemNode styling & accessibility check 5

// SystemNode styling & accessibility check 6
