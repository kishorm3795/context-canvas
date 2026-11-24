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
