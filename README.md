# Loom (ContextGraph) — Spatial Canvas & Node-Based Prompt/Context Debugger

> **Figma meets an LLM interpretability engine.**  
> A local-first, dark-mode developer workbench for visualizing context packing, non-destructive prompt tuning (muting/branching), and leave-one-out attribution.

---

## 1. System Architecture Overview

Loom splits into:
- **Backend (`backend/`):** FastAPI asynchronous context compilation engine, topological DAG sorter, token budgeting calculations, and local inference/telemetry hooks.
- **Frontend (`frontend/`):** Spatial canvas powered by React Flow (`@xyflow/react`), custom glassmorphic telemetry nodes, and dynamic vector glowing edges with attribution shaders.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + Vite)                         │
│  ┌───────────────────────────────┐   ┌───────────────────────────────┐  │
│  │   Spatial Canvas (React Flow  │   │   Inspector & Token Heatmap   │  │
│  │   / Custom WebGL 2D Viewport) │   │   Drawer (Glassmorphic HUD)   │  │
│  └───────────────┬───────────────┘   └───────────────┬───────────────┘  │
│                  └─────────────────┬─────────────────┘                  │
│                            Zustand Graph Store                          │
└────────────────────────────────────┼────────────────────────────────────┘
                                     │ REST + SSE / WebSocket
┌────────────────────────────────────▼────────────────────────────────────┐
│                       BACKEND (FastAPI + Python)                        │
│  ┌───────────────────────────────┐   ┌───────────────────────────────┐  │
│  │   DAG Compiler & Context      │   │   Attribution & Logit Engine  │  │
│  │   Assembler (Token Budgeting) │   │   (Leave-One-Out / Attention) │  │
│  └───────────────┬───────────────┘   └───────────────┬───────────────┘  │
│                  └─────────────────┬─────────────────┘                  │
│                     Inference Adapter (Ollama / Llama)                  │
│                  ┌─────────────────┴─────────────────┐                  │
│                  │   SQLite / JSON Snapshot Ledger   │                  │
│                  └───────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Implemented Foundation (Phase 1 Baseline)

- **Topological DAG Context Compiler:**
  - Implements Kahn's algorithm in `backend/app/graph_compiler.py`
  - Sorts System Persona -> Weighted Context Chunks -> Memory Checkpoints -> Active User Instruction
  - Handles non-destructive node muting (omits muted chunks from prompt while tracking token savings)
  - Real-time token budgeting and threshold warning calculations
- **Spatial React Flow Canvas:**
  - `SystemNode`: Pinned system constraints with token badge
  - `ContextNode`: RAG chunk with mute toggle, weight sensitivity slider, and influential token highlights
  - `PromptNode`: Active user instruction with live token counts
  - `LLMNode`: Model selector, TTFT & tok/s telemetry badges, streaming output viewer, leave-one-out attribution trigger
  - `GlowingEdge`: SVG shader edge shifting from Cyan to Amber/Crimson based on attribution influence
  - `HeaderBar`: Live token budget meter (Emerald -> Amber -> Crimson)
  - `InspectorDrawer`: Collapsible assembled prompt and node breakdown inspector
- **Design System:** Full specification in `design-system.md` adhering to Dark Obsidian Glassmorphism and technical HUD aesthetics.

---

## 3. Getting Started

### Backend
```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to explore the spatial prompt canvas.

<!-- Milestone documentation appendix 1 -->

<!-- Milestone documentation appendix 2 -->

<!-- Milestone documentation appendix 3 -->

<!-- Milestone documentation appendix 4 -->

<!-- Milestone documentation appendix 5 -->
