from __future__ import annotations

import time
from typing import Any, Dict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.graph_compiler import DAGCompiler
from app.schemas import (
    CompileRequest,
    CompileResponse,
    GraphSnapshot,
)

app = FastAPI(
    title="Loom / ContextGraph Engine",
    description="Spatial Canvas & Node-Based Prompt/Context Debugger API",
    version="0.1.0",
)

# Enable permissive CORS for local React/Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health_check() -> Dict[str, Any]:
    return {
        "status": "healthy",
        "service": "loom-context-engine",
        "timestamp": time.time(),
        "version": "0.1.0",
    }


@app.get("/api/models")
async def get_available_models() -> Dict[str, Any]:
    return {
        "models": [
            {"id": "llama3.2:1b", "name": "Llama 3.2 (1B)", "context_window": 8192, "default": True},
            {"id": "llama3.2:3b", "name": "Llama 3.2 (3B)", "context_window": 8192, "default": False},
            {"id": "mistral:7b", "name": "Mistral (7B)", "context_window": 32768, "default": False},
            {"id": "qwen2.5:1.5b", "name": "Qwen 2.5 (1.5B)", "context_window": 32768, "default": False},
        ]
    }


@app.get("/api/sample-graph", response_model=GraphSnapshot)
async def get_sample_graph() -> GraphSnapshot:
    """Returns the canonical Loom blueprint seed graph."""
    return GraphSnapshot(
        workspace_id="ws_01",
        snapshot_id="snap_004",
        timestamp="2026-11-21T22:00:00Z",
        nodes=[
            {
                "id": "node_sys_1",
                "type": "system",
                "position": {"x": 80, "y": 80},
                "data": {
                    "title": "Compliance Persona",
                    "content": "You are an automated regulatory compliance audit assistant. Provide concise, legally binding summaries citing specific circulars.",
                    "token_count": 28,
                    "pinned": True,
                },
            },
            {
                "id": "node_ctx_1",
                "type": "context_chunk",
                "position": {"x": 80, "y": 280},
                "data": {
                    "title": "RBI Circular §4.2",
                    "content": "Entities must report cyber security incidents to the CERT-In and RBI within 6 hours of detection.",
                    "token_count": 48,
                    "muted": False,
                    "weight": 0.84,
                    "attribution_score": 0.84,
                    "token_highlights": [
                        {"token": "within 6 hours", "score": 0.92},
                        {"token": "report cyber security incidents", "score": 0.78},
                    ],
                },
            },
            {
                "id": "node_prompt_1",
                "type": "prompt_query",
                "position": {"x": 80, "y": 500},
                "data": {
                    "title": "Incident Reporting Query",
                    "content": "What is the mandatory timeframe for reporting cybersecurity incidents under RBI guidelines?",
                    "token_count": 22,
                },
            },
            {
                "id": "node_llm_1",
                "type": "llm_runner",
                "position": {"x": 560, "y": 280},
                "data": {
                    "model": "llama3.2:1b",
                    "temperature": 0.2,
                    "total_context_tokens": 98,
                    "max_context_limit": 8192,
                    "output": "Under RBI Circular §4.2 guidelines, regulated entities must mandatorily report cybersecurity incidents within 6 hours of detection.",
                    "metrics": {
                        "ttft_ms": 115.0,
                        "tokens_per_sec": 68.4,
                        "total_time_ms": 285.0,
                    },
                },
            },
        ],
        edges=[
            {
                "id": "e_sys_llm",
                "source": "node_sys_1",
                "target": "node_llm_1",
                "weight": 0.5,
                "attribution_score": 0.35,
            },
            {
                "id": "e_ctx_llm",
                "source": "node_ctx_1",
                "target": "node_llm_1",
                "weight": 0.84,
                "attribution_score": 0.84,
            },
            {
                "id": "e_prompt_llm",
                "source": "node_prompt_1",
                "target": "node_llm_1",
                "weight": 0.95,
                "attribution_score": 0.90,
            },
        ],
    )


@app.post("/api/compile", response_model=CompileResponse)
async def compile_canvas_graph(request: CompileRequest) -> CompileResponse:
    """Compiles the canvas DAG into a topologically sorted, token-budgeted prompt."""
    try:
        compiler = DAGCompiler(
            nodes=request.nodes,
            edges=request.edges,
            max_context_limit=request.max_context_limit,
        )
        return compiler.compile()
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Compilation error: {str(exc)}")

# Sample graph seed enhancement 1

# Sample graph seed enhancement 2

# Sample graph seed enhancement 3

# Sample graph seed enhancement 4
