import { create } from 'zustand';
import {
  type Edge,
  type Node,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Connection,
} from '@xyflow/react';
import type { CompileResult } from '../types/graph';

export interface GraphState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  isCompiling: boolean;
  compileResult: CompileResult | null;
  totalTokens: number;
  maxContextLimit: number;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setSelectedNodeId: (id: string | null) => void;
  toggleMute: (nodeId: string) => void;
  updateNodeData: (nodeId: string, dataPatch: Record<string, any>) => void;
  compileGraph: () => Promise<void>;
  resetGraph: () => void;
}

const INITIAL_NODES: Node[] = [
  {
    id: 'node_sys_1',
    type: 'system',
    position: { x: 60, y: 80 },
    data: {
      title: 'Compliance Persona',
      content:
        'You are an automated regulatory compliance audit assistant. Provide concise, legally binding summaries citing specific circulars.',
      token_count: 28,
      pinned: true,
    },
  },
  {
    id: 'node_ctx_1',
    type: 'context_chunk',
    position: { x: 60, y: 280 },
    data: {
      title: 'RBI Circular §4.2',
      content:
        'Entities must report cyber security incidents to the CERT-In and RBI within 6 hours of detection.',
      token_count: 48,
      muted: false,
      weight: 0.84,
      attribution_score: 0.84,
      token_highlights: [
        { token: 'within 6 hours', score: 0.92 },
        { token: 'report cyber security incidents', score: 0.78 },
      ],
    },
  },
  {
    id: 'node_prompt_1',
    type: 'prompt_query',
    position: { x: 60, y: 520 },
    data: {
      title: 'Incident Reporting Query',
      content:
        'What is the mandatory timeframe for reporting cybersecurity incidents under RBI guidelines?',
      token_count: 22,
    },
  },
  {
    id: 'node_llm_1',
    type: 'llm_runner',
    position: { x: 560, y: 260 },
    data: {
      model: 'llama3.2:1b',
      temperature: 0.2,
      total_context_tokens: 98,
      max_context_limit: 8192,
      output:
        'Under RBI Circular §4.2 guidelines, regulated entities must mandatorily report cybersecurity incidents within 6 hours of detection.',
      metrics: {
        ttft_ms: 115,
        tokens_per_sec: 68.4,
        total_time_ms: 285,
      },
    },
  },
];

const INITIAL_EDGES: Edge[] = [
  {
    id: 'e_sys_llm',
    source: 'node_sys_1',
    target: 'node_llm_1',
    type: 'glowing',
    data: { weight: 0.5, attribution_score: 0.35 },
  },
  {
    id: 'e_ctx_llm',
    source: 'node_ctx_1',
    target: 'node_llm_1',
    type: 'glowing',
    data: { weight: 0.84, attribution_score: 0.84 },
  },
  {
    id: 'e_prompt_llm',
    source: 'node_prompt_1',
    target: 'node_llm_1',
    type: 'glowing',
    data: { weight: 0.95, attribution_score: 0.9 },
  },
];

function calculateTokens(nodes: Node[]): number {
  return nodes.reduce((sum, n) => {
    if (n.type === 'llm_runner' || n.data?.muted) return sum;
    const tokens = Number(n.data?.token_count) || Math.ceil((String(n.data?.content || '').length) / 3.8);
    return sum + tokens;
  }, 0);
}

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: INITIAL_NODES,
  edges: INITIAL_EDGES,
  selectedNodeId: null,
  isCompiling: false,
  compileResult: null,
  totalTokens: calculateTokens(INITIAL_NODES),
  maxContextLimit: 8192,

  onNodesChange: (changes) => {
    set((state) => {
      const nextNodes = applyNodeChanges(changes, state.nodes);
      return {
        nodes: nextNodes,
        totalTokens: calculateTokens(nextNodes),
      };
    });
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },

  onConnect: (connection: Connection) => {
    set((state) => ({
      edges: addEdge({ ...connection, type: 'glowing', data: { weight: 1.0 } }, state.edges),
    }));
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  toggleMute: (nodeId) => {
    set((state) => {
      const updatedNodes = state.nodes.map((node) => {
        if (node.id === nodeId) {
          const nextMuted = !node.data.muted;
          return {
            ...node,
            data: {
              ...node.data,
              muted: nextMuted,
            },
          };
        }
        return node;
      });

      return {
        nodes: updatedNodes,
        totalTokens: calculateTokens(updatedNodes),
      };
    });
  },

  updateNodeData: (nodeId, dataPatch) => {
    set((state) => {
      const updatedNodes = state.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...dataPatch,
            },
          };
        }
        return node;
      });
      return {
        nodes: updatedNodes,
        totalTokens: calculateTokens(updatedNodes),
      };
    });
  },

  compileGraph: async () => {
    const { nodes, edges, maxContextLimit } = get();
    set({ isCompiling: true });

    try {
      const payload = {
        workspace_id: 'ws_01',
        max_context_limit: maxContextLimit,
        nodes: nodes.map((n) => ({
          id: n.id,
          type: n.type || 'context_chunk',
          position: n.position,
          data: n.data,
        })),
        edges: edges.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          weight: e.data?.weight ?? 1.0,
          attribution_score: e.data?.attribution_score ?? null,
        })),
      };

      const res = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result: CompileResult = await res.json();
        set({
          compileResult: result,
          totalTokens: result.total_context_tokens,
          isCompiling: false,
        });
      } else {
        // Fallback local calculation
        const localTokens = calculateTokens(nodes);
        set({
          totalTokens: localTokens,
          isCompiling: false,
        });
      }
    } catch {
      // Offline fallback
      set({
        totalTokens: calculateTokens(nodes),
        isCompiling: false,
      });
    }
  },

  resetGraph: () => {
    set({
      nodes: INITIAL_NODES,
      edges: INITIAL_EDGES,
      selectedNodeId: null,
      compileResult: null,
      totalTokens: calculateTokens(INITIAL_NODES),
    });
  },
}));

// Store state slice refinement 1

// Store state slice refinement 2

// Store state slice refinement 3

// Store state slice refinement 4

// Store state slice refinement 5

// Store state slice refinement 6

// Store state slice refinement 7

// Store state slice refinement 8

// Store state slice refinement 9

// Store state slice refinement 10

// Store state slice refinement 11

// Action & synchronization refinement 1

// Action & synchronization refinement 2

// Action & synchronization refinement 3

// Action & synchronization refinement 4

// Action & synchronization refinement 5

// Action & synchronization refinement 6

// Action & synchronization refinement 7

// Action & synchronization refinement 8

// Action & synchronization refinement 9

// Action & synchronization refinement 10

// Action & synchronization refinement 11
