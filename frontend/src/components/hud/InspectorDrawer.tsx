import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Terminal, Eye, VolumeX } from 'lucide-react';
import { useGraphStore } from '../../store/useGraphStore';

export const InspectorDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const compileResult = useGraphStore((s) => s.compileResult);
  const nodes = useGraphStore((s) => s.nodes);

  const copyPrompt = () => {
    if (!compileResult?.assembled_prompt) return;
    navigator.clipboard.writeText(compileResult.assembled_prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-3xl">
      <div className="glass-panel rounded-xl overflow-hidden shadow-2xl transition-all duration-300">
        {/* Toggle Bar */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="glass-panel-header px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/60 transition-colors select-none"
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-semibold text-slate-200">
              TELEMETRY & ASSEMBLED CONTEXT INSPECTOR
            </span>
            {compileResult && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {compileResult.nodes_included.length} nodes active
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400">
              {isOpen ? 'Collapse' : 'Expand Inspector'}
            </span>
            {isOpen ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </div>

        {/* Collapsible Content */}
        {isOpen && (
          <div className="p-4 space-y-3 max-h-72 overflow-y-auto bg-slate-950/70 border-t border-white/5">
            {compileResult ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Assembled Linear Prompt:
                  </span>
                  <button
                    onClick={copyPrompt}
                    className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy Full Prompt'}
                  </button>
                </div>

                <pre className="p-3 rounded-lg bg-slate-900 border border-white/5 text-xs font-mono text-cyan-200/90 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                  {compileResult.assembled_prompt}
                </pre>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-emerald-500/20">
                    <div className="text-[10px] font-mono uppercase text-emerald-400 font-semibold mb-1 flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Included Nodes ({compileResult.nodes_included.length})
                    </div>
                    <ul className="text-xs font-mono space-y-1 text-slate-300">
                      {compileResult.nodes_included.map((n) => (
                        <li key={n.id} className="flex justify-between text-[11px]">
                          <span>{n.title}</span>
                          <span className="text-slate-500">{n.token_count}t</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-rose-500/20">
                    <div className="text-[10px] font-mono uppercase text-rose-400 font-semibold mb-1 flex items-center gap-1">
                      <VolumeX className="w-3 h-3" /> Muted Nodes ({compileResult.nodes_muted.length})
                    </div>
                    {compileResult.nodes_muted.length > 0 ? (
                      <ul className="text-xs font-mono space-y-1 text-slate-400">
                        {compileResult.nodes_muted.map((n) => (
                          <li key={n.id} className="flex justify-between text-[11px]">
                            <span>{n.title}</span>
                            <span className="text-rose-500/70">Muted</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono italic">
                        No nodes currently muted.
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-xs font-mono text-slate-500">
                Click <span className="text-cyan-400 font-semibold">"Compile DAG"</span> in the top bar to inspect assembled linear prompt and token allocation.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// InspectorDrawer collapsed and expanded styling 1

// InspectorDrawer collapsed and expanded styling 2

// InspectorDrawer collapsed and expanded styling 3

// InspectorDrawer collapsed and expanded styling 4
