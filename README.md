# Loom (ContextGraph) — Spatial Canvas & Node-Based Prompt/Context Debugger

> Local-first, dark-mode developer workbench that feels like Figma meets an LLM interpretability engine.

## 1. System Architecture Overview

```
[Spatial React Canvas] <---> [FastAPI DAG & Attribution Engine] <---> [Local Ollama]
```

## Tech Stack
- Frontend: React 19 + TypeScript + Vite + @xyflow/react + Tailwind CSS
- State: Zustand
- Backend: FastAPI + Pydantic v2 + aiosqlite
