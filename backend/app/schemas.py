from __future__ import annotations
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class NodeType(str, Enum):
    SYSTEM = 'system'
    CONTEXT_CHUNK = 'context_chunk'
    PROMPT_QUERY = 'prompt_query'
    LLM_RUNNER = 'llm_runner'
    MEMORY_STATE = 'memory_state'
    DIFF_FORK = 'diff_fork'

class Position(BaseModel):
    x: float
    y: float

class TokenHighlight(BaseModel):
    token: str
    score: float = Field(ge=0.0, le=1.0)

class SystemNodeData(BaseModel):
    title: str = 'System Persona'
    content: str
    token_count: int = 0
    pinned: bool = True

class ContextChunkData(BaseModel):
    title: str
    content: str
    token_count: int = 0
    muted: bool = False
    weight: float = Field(default=1.0, ge=0.0, le=1.0)
    attribution_score: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    token_highlights: List[TokenHighlight] = Field(default_factory=list)

class MemoryStateData(BaseModel):
    title: str = 'Memory Checkpoint'
    content: str
    token_count: int = 0
    muted: bool = False

class PromptQueryData(BaseModel):
    title: str = 'User Instruction'
    content: str
    token_count: int = 0

class LLMMetrics(BaseModel):
    ttft_ms: Optional[float] = None
    tokens_per_sec: Optional[float] = None
    total_time_ms: Optional[float] = None

class LLMRunnerData(BaseModel):
    model: str = 'llama3.2:1b'
    temperature: float = Field(default=0.2, ge=0.0, le=2.0)
    top_p: float = Field(default=0.9, ge=0.0, le=1.0)
    total_context_tokens: int = 0
    max_context_limit: int = 8192
    output: Optional[str] = None
    metrics: LLMMetrics = Field(default_factory=LLMMetrics)

class DiffForkData(BaseModel):
    title: str = 'Branch Diff'
    branch_a_output: str = ''
    branch_b_output: str = ''
    semantic_similarity: Optional[float] = None

class CanvasNode(BaseModel):
    id: str
    type: str
    position: Position
    data: Dict[str, Any]

class CanvasEdge(BaseModel):
    id: str
    source: str
    target: str
    weight: Optional[float] = Field(default=1.0, ge=0.0, le=1.0)
    attribution_score: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    animated: Optional[bool] = None
