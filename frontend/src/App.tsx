import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useGraphStore } from './store/useGraphStore';
import { SystemNode } from './components/canvas/SystemNode';
import { ContextNode } from './components/canvas/ContextNode';
import { PromptNode } from './components/canvas/PromptNode';
import { LLMNode } from './components/canvas/LLMNode';
import { GlowingEdge } from './components/canvas/GlowingEdge';
import { HeaderBar } from './components/hud/HeaderBar';
import { InspectorDrawer } from './components/hud/InspectorDrawer';

export const App: React.FC = () => {
  const nodes = useGraphStore((s) => s.nodes);
  const edges = useGraphStore((s) => s.edges);
  const onNodesChange = useGraphStore((s) => s.onNodesChange);
  const onEdgesChange = useGraphStore((s) => s.onEdgesChange);
  const onConnect = useGraphStore((s) => s.onConnect);
  const setSelectedNodeId = useGraphStore((s) => s.setSelectedNodeId);

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      system: SystemNode,
      context_chunk: ContextNode,
      prompt_query: PromptNode,
      llm_runner: LLMNode,
    }),
    []
  );

  const edgeTypes: EdgeTypes = useMemo(
    () => ({
      glowing: GlowingEdge,
    }),
    []
  );

  return (
    <div className="w-screen h-screen flex flex-col bg-canvas-void overflow-hidden select-none">
      <HeaderBar />

      <main className="flex-1 relative w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={(_, node) => setSelectedNodeId(node.id)}
          onPaneClick={() => setSelectedNodeId(null)}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={2.0}
          defaultEdgeOptions={{ type: 'glowing' }}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            color="#222738"
            gap={24}
            size={1.2}
            variant={BackgroundVariant.Dots}
          />
          <Controls position="top-left" showInteractive={false} />
          <MiniMap
            position="bottom-right"
            nodeColor={(node) => {
              if (node.type === 'system') return '#10B981';
              if (node.type === 'context_chunk') return '#F59E0B';
              if (node.type === 'prompt_query') return '#00F0FF';
              if (node.type === 'llm_runner') return '#A855F7';
              return '#64748B';
            }}
            maskColor="rgba(8, 9, 13, 0.85)"
            className="!bg-slate-950/80 !border-white/10 !rounded-lg overflow-hidden !m-4"
          />
        </ReactFlow>

        <InspectorDrawer />
      </main>
    </div>
  );
};

export default App;

// React Flow viewport registration 1

// React Flow viewport registration 2

// React Flow viewport registration 3

// React Flow viewport registration 4

// React Flow viewport registration 5

// React Flow viewport registration 6

// React Flow viewport registration 7

// React Flow viewport registration 8

// React Flow viewport registration 9

// React Flow viewport registration 10

// React Flow viewport registration 11
