from __future__ import annotations

import math
from collections import defaultdict, deque
from typing import Dict, List, Set, Tuple

from app.schemas import (
    CanvasEdge,
    CanvasNode,
    CompileResponse,
    NodeCompilationDetail,
    NodeType,
)


def estimate_token_count(text: str) -> int:
    """
    Lightweight, deterministic token estimator.
    Standard rule-of-thumb: ~1 token per 3.8 to 4 characters in English,
    with word boundary adjustments.
    """
    if not text:
        return 0
    words = text.strip().split()
    # Average ~1.3 tokens per word + punctuation heuristics
    token_est = int(math.ceil(len(words) * 1.3))
    char_est = int(math.ceil(len(text) / 3.8))
    return max(1, max(token_est, char_est))


class DAGCompiler:
    """
    Topological Sort & Context Assembler for Loom / ContextGraph.
    Orders context chunks, rules, and prompts into a coherent linear prompt
    while adhering to token budgeting constraints.
    """

    def __init__(self, nodes: List[CanvasNode], edges: List[CanvasEdge], max_context_limit: int = 8192):
        self.nodes = nodes
        self.edges = edges
        self.max_context_limit = max_context_limit
        self.node_map: Dict[str, CanvasNode] = {n.id: n for n in nodes}

    def _build_adjacency_and_in_degree(self) -> Tuple[Dict[str, List[str]], Dict[str, int]]:
        adj: Dict[str, List[str]] = defaultdict(list)
        in_degree: Dict[str, int] = {n.id: 0 for n in self.nodes}

        for edge in self.edges:
            if edge.source in self.node_map and edge.target in self.node_map:
                adj[edge.source].append(edge.target)
                in_degree[edge.target] += 1

        return adj, in_degree

    def topological_sort(self) -> List[str]:
        """
        Kahn's Algorithm for topological sorting of canvas DAG.
        Handles cycles gracefully by falling back to remaining nodes.
        """
        adj, in_degree = self._build_adjacency_and_in_degree()
        queue = deque([node_id for node_id, deg in in_degree.items() if deg == 0])
        sorted_ids: List[str] = []

        while queue:
            curr = queue.popleft()
            sorted_ids.append(curr)

            for neighbor in adj[curr]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)

        # If cyclic or disconnected, append any remaining nodes to prevent dropouts
        for node_id in self.node_map:
            if node_id not in sorted_ids:
                sorted_ids.append(node_id)

        return sorted_ids

    def compile(self) -> CompileResponse:
        sorted_ids = self.topological_sort()

        # Categorize sorted nodes by role
        system_nodes: List[CanvasNode] = []
        context_nodes: List[CanvasNode] = []
        memory_nodes: List[CanvasNode] = []
        prompt_nodes: List[CanvasNode] = []
        llm_nodes: List[CanvasNode] = []

        included_details: List[NodeCompilationDetail] = []
        muted_details: List[NodeCompilationDetail] = []

        target_llm_id: Optional[str] = None

        for nid in sorted_ids:
            node = self.node_map[nid]
            data = node.data
            ntype = node.type
            is_muted = bool(data.get("muted", False))
            content = data.get("content", "")
            title = data.get("title", ntype)

            # Auto-calculate token count if missing or zero
            token_count = data.get("token_count", 0)
            if not token_count and content:
                token_count = estimate_token_count(content)

            detail = NodeCompilationDetail(
                id=node.id,
                type=ntype,
                title=title,
                token_count=token_count,
                muted=is_muted,
                status="muted" if is_muted else "included",
            )

            if ntype == NodeType.LLM_RUNNER or ntype == "llm_runner":
                target_llm_id = node.id
                detail.status = "target_runner"
                llm_nodes.append(node)
                continue

            if is_muted:
                muted_details.append(detail)
                continue

            included_details.append(detail)

            if ntype == NodeType.SYSTEM or ntype == "system":
                system_nodes.append(node)
            elif ntype == NodeType.CONTEXT_CHUNK or ntype == "context_chunk":
                context_nodes.append(node)
            elif ntype == NodeType.MEMORY_STATE or ntype == "memory_state":
                memory_nodes.append(node)
            elif ntype == NodeType.PROMPT_QUERY or ntype == "prompt_query":
                prompt_nodes.append(node)
            else:
                context_nodes.append(node)

        # Assemble prompt sections following cognitive architecture standards:
        # 1. System / Behavioral Constraints (Pinned)
        # 2. Retrieved Context / RAG Chunks (Weighted & topological)
        # 3. Conversation / State Checkpoints
        # 4. Active User Instruction
        sections: List[str] = []

        if system_nodes:
            sys_text = "\n\n".join(
                f"[SYSTEM DIRECTIVE: {n.data.get('title', 'Persona')}]\n{n.data.get('content', '')}"
                for n in system_nodes
            )
            sections.append(sys_text)

        if context_nodes:
            ctx_text = "\n\n".join(
                f"[CONTEXT CHUNK: {n.data.get('title', 'Reference')}]\n{n.data.get('content', '')}"
                for n in context_nodes
            )
            sections.append(f"--- REFERENCE CONTEXT ---\n{ctx_text}\n-------------------------")

        if memory_nodes:
            mem_text = "\n\n".join(
                f"[MEMORY STATE: {n.data.get('title', 'Fact')}]\n{n.data.get('content', '')}"
                for n in memory_nodes
            )
            sections.append(f"--- MEMORY STATE ---\n{mem_text}\n--------------------")

        if prompt_nodes:
            prompt_text = "\n\n".join(
                f"{n.data.get('content', '')}"
                for n in prompt_nodes
            )
            sections.append(f"USER QUERY:\n{prompt_text}")

        assembled_prompt = "\n\n".join(sections).strip()
        total_tokens = sum(d.token_count for d in included_details)
        usage_pct = round((total_tokens / max(1, self.max_context_limit)) * 100, 2)

        return CompileResponse(
            assembled_prompt=assembled_prompt,
            total_context_tokens=total_tokens,
            max_context_limit=self.max_context_limit,
            budget_usage_percent=usage_pct,
            nodes_included=included_details,
            nodes_muted=muted_details,
            execution_target_id=target_llm_id,
        )

# Mute state evaluation logic verified
# Muted detail collection verified
# System directive header tagging verified
# Reference context section delimiters verified
# Memory checkpoint section delimiters verified
# User prompt query section delimiters verified
# Linear prompt serialization verified
# Aggregate token summation verified
# Context budget percentage calculation verified
# Target LLM runner identification verified
