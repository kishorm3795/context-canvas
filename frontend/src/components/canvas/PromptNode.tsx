import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Terminal, Hash } from 'lucide-react';
import { useGraphStore } from '../../store/useGraphStore';

export const PromptNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const updateNodeData = useGraphStore((s) => s.updateNodeData);
  const title = (data.title as string) || 'User Prompt';
  const content = (data.content as string) || '';
  const tokenCount = Number(data.token_count) || 0;

  return (
    <div
      className={`glass-panel w-80 rounded-xl transition-all duration-200 overflow-hidden ${
        selected ? 'ring-2 ring-cyan-400 shadow-cyan-500/20 shadow-xl' : 'hover:border-cyan-500/40'
      }`}
    >
      <div className="glass-panel-header px-3.5 py-2.5 flex items-center justify-between border-b border-cyan-500/20 bg-cyan-950/20">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-cyan-500/20 text-cyan-400">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold tracking-wide text-slate-200 uppercase font-mono">
            {title}
          </span>
        </div>
        <span className="flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
          <Hash className="w-2.5 h-2.5" />
          {tokenCount}t
        </span>
      </div>

      <div className="p-3">
        <textarea
          className="w-full h-20 bg-slate-950/60 border border-white/5 rounded-md p-2 text-xs text-slate-300 font-sans resize-none focus:outline-none focus:border-cyan-500/50 leading-relaxed"
          value={content}
          onChange={(e) => updateNodeData(id, { content: e.target.value })}
          placeholder="Active prompt instruction..."
        />
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-cyan-400 !border-slate-900"
      />
    </div>
  );
};

// PromptNode instruction binding 1

// PromptNode instruction binding 2

// PromptNode instruction binding 3
