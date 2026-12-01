export type NodeTypeString =
  | 'system'
  | 'context_chunk'
  | 'memory_state'
  | 'prompt_query'
  | 'llm_runner'
  | 'diff_fork';

export interface TokenHighlight {
  token: string;
  score: number;
}

export interface SystemNodeData {
  title: string;
  content: string;
  token_count: number;
  pinned?: boolean;
}

export interface ContextChunkData {
  title: string;
  content: string;
  token_count: number;
  muted: boolean;
  weight: number;
  attribution_score?: number;
  token_highlights?: TokenHighlight[];
}

export interface PromptQueryData {
  title: string;
  content: string;
  token_count: number;
}

export interface LLMMetrics {
  ttft_ms?: number;
  tokens_per_sec?: number;
  total_time_ms?: number;
}

export interface LLMRunnerData {
  model: string;
  temperature: number;
  total_context_tokens: number;
  max_context_limit: number;
  output?: string;
  metrics: LLMMetrics;
}

export interface CanvasEdgeData {
  id: string;
  source: string;
  target: string;
  weight?: number;
  attribution_score?: number;
}

export interface CompileResult {
  assembled_prompt: string;
  total_context_tokens: number;
  max_context_limit: number;
  budget_usage_percent: number;
  nodes_included: Array<{
    id: string;
    type: string;
    title: string;
    token_count: number;
    muted: boolean;
  }>;
  nodes_muted: Array<{
    id: string;
    type: string;
    title: string;
    token_count: number;
    muted: boolean;
  }>;
  execution_target_id?: string;
}

// TypeScript contract refinement 1

// TypeScript contract refinement 2

// TypeScript contract refinement 3

// TypeScript contract refinement 4

// TypeScript contract refinement 5

// TypeScript contract refinement 6

// TypeScript contract refinement 7

// TypeScript contract refinement 8

// TypeScript contract refinement 9
