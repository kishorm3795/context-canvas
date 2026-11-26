from __future__ import annotations
import math
from collections import defaultdict, deque
from typing import Dict, List, Set, Tuple
from app.schemas import CanvasEdge, CanvasNode, CompileResponse, NodeCompilationDetail, NodeType

def estimate_token_count(text: str) -> int:
    if not text: return 0
    return max(1, int(math.ceil(len(text) / 3.8)))
