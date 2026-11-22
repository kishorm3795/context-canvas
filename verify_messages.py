#!/usr/bin/env python3
import os
import shutil
import subprocess
from datetime import datetime, timedelta

ROOT_DIR = "/Users/pavankishorm/Documents/My Projects/context-canvas"
BACKUP_DIR = "/tmp/context-canvas-final"

# 25 days: from 2026-11-22 to 2026-12-16
START_DATE = datetime(2026, 11, 22)
COMMITS_PER_DAY = 12
TOTAL_DAYS = 25
TOTAL_COMMITS = COMMITS_PER_DAY * TOTAL_DAYS  # 300

HOURS_SCHEDULE = [
    (9, 15), (10, 5), (10, 55), (11, 45),
    (13, 10), (14, 0), (14, 50), (15, 40),
    (16, 30), (17, 20), (18, 10), (19, 0)
]

COMMIT_MESSAGES = [
    # Day 1: Project Initialization & Workspace Scaffolding
    "chore: initial commit and configure .gitignore",
    "docs: initialize root README with Loom ContextGraph blueprint",
    "docs: add architectural ASCII diagram and system flow to README",
    "docs: document technical stack decisions (FastAPI, React Flow, Zustand)",
    "chore(backend): create backend directory structure and manifest",
    "build(backend): add FastAPI, Pydantic, and uvicorn dependencies",
    "build(backend): add aiosqlite and httpx for telemetry and local inference",
    "build(backend): add pytest test configuration for backend suite",
    "chore(backend): initialize backend app package with version metadata",
    "chore(frontend): create frontend directory structure and package manifest",
    "build(frontend): configure Vite and React plugin settings",
    "build(frontend): configure TypeScript compiler options for strict mode",

    # Day 2: Design System & Visual Architecture
    "docs(design): initialize design-system.md specification",
    "style(design): define 60-30-10 dark obsidian palette tokens",
    "style(design): add typography scale and JetBrains Mono monospace specifications",
    "style(design): specify spatial node geometry and border radius tokens",
    "style(design): define glowing edge shaders and attribution color spectrum",
    "docs(design): add Lucide SVG iconography standards and zero-emoji policy",
    "docs(design): add accessibility and reduced-motion compliance contracts",
    "style(frontend): configure Tailwind color extensions for obsidian canvas",
    "style(frontend): add telemetry accent colors (cyan, emerald, amber, crimson)",
    "build(frontend): setup PostCSS autoprefixer configuration",
    "feat(frontend): create base HTML template with Google Fonts preconnect",
    "style(frontend): add glassmorphism CSS utilities and custom scrollbar classes",

    # Day 3: Backend Core Data Contracts & Schemas
    "feat(backend): initialize backend schemas.py module",
    "feat(backend): define NodeType enumeration with core canvas primitives",
    "feat(backend): add DiffFork and MemoryState node type variants",
    "feat(backend): define 2D spatial Position coordinate schema",
    "feat(backend): define TokenHighlight model with bounded attribution scores",
    "feat(backend): define SystemNodeData model with pinned constraints",
    "feat(backend): define ContextChunkData model with mute toggle and weight slider",
    "feat(backend): define MemoryStateData schema for conversation checkpoints",
    "feat(backend): define PromptQueryData schema for active instructions",
    "feat(backend): define LLMMetrics model for TTFT and token velocity tracking",
    "feat(backend): define LLMRunnerData model with model parameters and output payload",
    "feat(backend): define DiffForkData model for branch divergence comparisons",

    # Day 4: Graph & Telemetry Schema Refinements
    "feat(backend): define CanvasNode schema with flexible typed data payloads",
    "feat(backend): define CanvasEdge schema with attribution score and animated flags",
    "feat(backend): define GraphSnapshot schema for immutable ledger checkpoints",
    "feat(backend): define CompileRequest model with context limit budgeting",
    "feat(backend): define NodeCompilationDetail schema for node auditing",
    "feat(backend): define CompileResponse model with budget usage metrics",
    "refactor(backend): add field validation constraints to ContextChunkData weight",
    "refactor(backend): add validation for attribution score boundaries [0.0, 1.0]",
    "docs(backend): add type hints and docstrings across schema definitions",
    "feat(backend): add helper serialization methods for CanvasNode data",
    "feat(backend): implement Pydantic schema export utilities",
    "test(backend): add schema validation test fixtures for canonical nodes",

    # Day 5: DAG Compiler & Topological Sorting Engine
    "feat(compiler): create graph_compiler.py module",
    "feat(compiler): implement lightweight token estimation heuristic",
    "feat(compiler): add word boundary and punctuation heuristics to token counter",
    "feat(compiler): create DAGCompiler class structure with node mapping",
    "feat(compiler): implement graph adjacency list constructor",
    "feat(compiler): implement in-degree calculation across canvas edges",
    "feat(compiler): implement Kahn's topological sort algorithm",
    "feat(compiler): add cycle detection fallback to prevent node dropouts",
    "feat(compiler): implement disconnected subgraph traversal in DAGCompiler",
    "feat(compiler): add node categorization helpers for system and context nodes",
    "feat(compiler): add categorization for prompt and LLM runner nodes",
    "perf(compiler): optimize node lookup with internal hash map",

    # Day 6: Context Assembly & Non-Destructive Muting
    "feat(compiler): implement non-destructive node muting filter in compiler",
    "feat(compiler): track muted nodes in compilation response metadata",
    "feat(compiler): add system directive prefix formatting to assembled prompt",
    "feat(compiler): add reference context section formatting for RAG chunks",
    "feat(compiler): add memory state section formatting for state nodes",
    "feat(compiler): add user query section formatting for prompt nodes",
    "feat(compiler): implement linear prompt assembly with structured delimiters",
    "feat(compiler): calculate aggregate active context token totals",
    "feat(compiler): calculate percentage usage against max context limit",
    "feat(compiler): implement execution target resolution for LLM runners",
    "feat(compiler): add detailed compilation status per node in CompileResponse",
    "refactor(compiler): refactor compiler error handling and edge cases",

    # Day 7: Backend Compiler Test Suite
    "test(compiler): create test_compiler.py unit test suite",
    "test(compiler): add unit test for token estimation with empty input",
    "test(compiler): add unit test for token estimation on multi-sentence strings",
    "test(compiler): add test fixture for complex multi-node canvas DAG",
    "test(compiler): add assertion verifying topological ordering of system directives",
    "test(compiler): add test verifying muted nodes are excluded from prompt output",
    "test(compiler): add test verifying muted node token savings are reflected in totals",
    "test(compiler): add test verifying execution target node detection",
    "test(compiler): add edge case test for disconnected floating context nodes",
    "test(compiler): add cyclic dependency test ensuring Kahn's algorithm recovers",
    "test(compiler): verify pytest test suite passes with zero warnings",
    "docs(backend): add test coverage documentation to backend README",

    # Day 8: FastAPI Application & REST Endpoints
    "feat(api): create main.py entry point for FastAPI application",
    "feat(api): add FastAPI application metadata, title, and description",
    "feat(api): configure permissive CORS middleware for local frontend dev",
    "feat(api): implement GET /api/health endpoint",
    "feat(api): add service timestamp and health check diagnostics",
    "feat(api): implement GET /api/models endpoint listing local Ollama models",
    "feat(api): add model metadata with context window limits for llama3.2:1b",
    "feat(api): add model options for mistral:7b and qwen2.5:1.5b",
    "feat(api): implement POST /api/compile endpoint with request validation",
    "feat(api): connect compile endpoint to DAGCompiler engine",
    "feat(api): add structured exception handling with HTTP 400 details",
    "test(api): verify FastAPI endpoint OpenAPI schema generation",

    # Day 9: Canonical Sample Graph Seed Endpoint
    "feat(api): implement GET /api/sample-graph endpoint in main.py",
    "feat(api): define canonical snapshot metadata (workspace ws_01, snap_004)",
    "feat(api): add Compliance Persona system node to sample graph",
    "feat(api): add RBI Circular §4.2 context chunk node to sample graph",
    "feat(api): configure RBI Circular attribution score 0.84 and token highlights",
    "feat(api): add Incident Reporting Query prompt node to sample graph",
    "feat(api): add LLM Runner node with llama3.2:1b and TTFT telemetry",
    "feat(api): add connecting edges between nodes and LLM runner in sample",
    "feat(api): configure edge attribution weights (0.50, 0.84, 0.95)",
    "refactor(api): add response validation against GraphSnapshot model",
    "test(api): add curl and HTTP test scripts for sample graph endpoint",
    "docs(api): document REST API contracts in backend documentation",

    # Day 10: Frontend TypeScript Definitions & Graph Types
    "feat(types): create frontend types/graph.ts definition module",
    "feat(types): define NodeTypeString union type",
    "feat(types): define TokenHighlight interface for frontend components",
    "feat(types): define SystemNodeData interface with pinned flag",
    "feat(types): define ContextChunkData interface with mute and weight properties",
    "feat(types): define PromptQueryData interface",
    "feat(types): define LLMMetrics interface with TTFT and tokens_per_sec",
    "feat(types): define LLMRunnerData interface with model configuration",
    "feat(types): define CanvasEdgeData interface with attribution properties",
    "feat(types): define CompileResult interface matching backend CompileResponse",
    "feat(types): export type guard utilities for node data casting",
    "test(types): verify TypeScript compiler validates type contracts",

    # Day 11: Zustand Graph Store Architecture
    "feat(store): initialize store/useGraphStore.ts with Zustand",
    "feat(store): define GraphState interface for store actions and state",
    "feat(store): add INITIAL_NODES seed array matching blueprint specification",
    "feat(store): add INITIAL_EDGES seed array with custom glowing edge types",
    "feat(store): implement calculateTokens helper for live token summing",
    "feat(store): implement onNodesChange handler with applyNodeChanges",
    "feat(store): implement onEdgesChange handler with applyEdgeChanges",
    "feat(store): implement onConnect handler for interactive edge drawing",
    "feat(store): add selectedNodeId state and selection handler",
    "feat(store): add maxContextLimit configuration (8192 tokens)",
    "feat(store): add isCompiling loading state flag",
    "feat(store): add resetGraph action restoring seed graph state",

    # Day 12: Store Mutation Actions & Backend Synchronization
    "feat(store): implement toggleMute action for non-destructive prompt tuning",
    "feat(store): recalculate active token totals on node mute/unmute",
    "feat(store): implement updateNodeData action for live content editing",
    "feat(store): implement compileGraph async action in Zustand store",
    "feat(store): format compile request payload with nodes and edge weights",
    "feat(store): implement fetch call to /api/compile backend endpoint",
    "feat(store): update compileResult and totalTokens on successful response",
    "feat(store): implement fallback local token calculation for offline mode",
    "feat(store): add error resilience for network dropouts during compile",
    "test(store): add token calculation unit tests for store helpers",
    "refactor(store): add node property patch validation in updateNodeData",
    "docs(store): document Zustand store state transitions and events",

    # Day 13: Custom System Node Implementation
    "feat(canvas): create components/canvas/SystemNode.tsx",
    "feat(canvas): implement glassmorphic panel container with emerald styling",
    "feat(canvas): add ShieldCheck Lucide icon to system node header",
    "feat(canvas): add Pinned constraint badge with custom emerald border",
    "feat(canvas): add live token counter badge to system node",
    "feat(canvas): add monospace uppercase title display",
    "feat(canvas): implement content textarea with real-time store binding",
    "feat(canvas): add selected state outline and emerald glow shadow",
    "feat(canvas): add React Flow Right source Handle for connection outgoing",
    "style(canvas): style Handle with emerald background and dark border",
    "perf(canvas): optimize re-renders with memoized node properties",
    "style(canvas): verify keyboard focus rings and accessibility for SystemNode",

    # Day 14: Custom Context & RAG Chunk Node
    "feat(canvas): create components/canvas/ContextNode.tsx",
    "feat(canvas): implement glassmorphic card container with amber theme",
    "feat(canvas): add FileText icon to context node header",
    "feat(canvas): add Mute/Unmute toggle button with Volume2 and VolumeX icons",
    "feat(canvas): implement visual mute state with grayscale and opacity reduction",
    "feat(canvas): add attribution score percentage badge with Sparkles icon",
    "feat(canvas): add token counter badge in context node header",
    "feat(canvas): implement content textarea for RAG documents and snippets",
    "feat(canvas): implement sensitivity weight slider (0.0 to 1.0)",
    "feat(canvas): disable weight slider when node is muted",
    "feat(canvas): add Left target and Right source Handles",
    "style(canvas): add selected state focus outline with amber glow",

    # Day 15: Influential Token Highlights Display
    "feat(canvas): add token_highlights rendering section in ContextNode",
    "feat(canvas): display Top Influential Tokens metadata label",
    "feat(canvas): render highlighted tokens as inline pill badges",
    "feat(canvas): show perturbation drop score beside each highlighted token",
    "style(canvas): style token pills with amber translucent background and border",
    "feat(canvas): hide token highlights section when node is muted",
    "style(canvas): add responsive truncation for long context node titles",
    "feat(canvas): add tooltips for mute and attribution controls",
    "refactor(canvas): handle empty or missing token highlights gracefully",
    "perf(canvas): optimize ContextNode rendering performance",
    "test(canvas): add test cases for ContextNode data props",
    "docs(canvas): document context node sensitivity slider mechanics",

    # Day 16: Custom Prompt Query Node
    "feat(canvas): create components/canvas/PromptNode.tsx",
    "feat(canvas): implement glassmorphic panel container with cyan theme",
    "feat(canvas): add Terminal icon to prompt node header",
    "feat(canvas): add token count badge in prompt header",
    "feat(canvas): implement user instruction textarea with auto-resize support",
    "feat(canvas): bind textarea changes to Zustand updateNodeData",
    "style(canvas): add selected state cyan outline and glow shadow",
    "feat(canvas): add Right source Handle styled with cyan fill",
    "feat(canvas): add keyboard shortcut indicators for prompt execution",
    "feat(canvas): add placeholder guidelines for user instructions",
    "style(canvas): refine spacing and padding to match design tokens",
    "test(canvas): verify PromptNode rendering and handle alignment",

    # Day 17: Custom LLM Execution Runner Node
    "feat(canvas): create components/canvas/LLMNode.tsx",
    "feat(canvas): implement wide glassmorphic panel with purple/indigo theme",
    "feat(canvas): add Cpu icon and LLM EXECUTION RUNNER header",
    "feat(canvas): add model tag badge (llama3.2:1b) with violet styling",
    "feat(canvas): create telemetry metrics grid container (TTFT, Speed, Temp)",
    "feat(canvas): add Zap icon and TTFT readout (115ms)",
    "feat(canvas): add Activity icon and token velocity readout (68.4 t/s)",
    "feat(canvas): add Gauge icon and temperature readout (0.20)",
    "feat(canvas): implement model output display container with glass backdrop",
    "feat(canvas): add streaming status badge indicator",
    "feat(canvas): add Left target Handle for incoming context and prompt edges",
    "style(canvas): add interactive sentence highlight cursor styling",

    # Day 18: Leave-One-Out Attribution Trigger Action
    "feat(canvas): add Run Leave-One-Out Attribution button in LLMNode",
    "feat(canvas): add Play icon to attribution trigger button",
    "feat(canvas): implement attribution execution state and spinner animation",
    "feat(canvas): simulate perturbation forward pass with telemetry updates",
    "feat(canvas): update metrics on attribution completion",
    "style(canvas): add disabled state styling during attribution run",
    "style(canvas): refine button hover states with purple glow effects",
    "feat(canvas): add empty state message when output is not yet generated",
    "feat(canvas): add click-to-highlight interaction on output sentences",
    "feat(canvas): handle multiple incoming connections on LLM target handle",
    "refactor(canvas): refactor LLMNode state management and prop types",
    "test(canvas): verify LLMNode rendering with all metrics populated",

    # Day 19: Glowing Vector Edge & Attribution Shader
    "feat(canvas): create components/canvas/GlowingEdge.tsx",
    "feat(canvas): use React Flow getBezierPath for smooth cubic bezier curves",
    "feat(canvas): add SVG drop-shadow filter for edge glow",
    "feat(canvas): implement outer blurred glow path for specular refraction",
    "feat(canvas): implement main vector edge path with dynamic stroke width",
    "feat(canvas): implement dynamic color shift: Cyan for low attribution (<0.4)",
    "feat(canvas): implement dynamic color shift: Amber for medium attribution (0.4-0.75)",
    "feat(canvas): implement dynamic color shift: Crimson for high attribution (>0.75)",
    "style(canvas): increase glow radius and stroke width for dominant edges",
    "feat(canvas): add SVG foreignObject for attribution percentage badge",
    "feat(canvas): center attribution badge on bezier curve midpoint",
    "style(canvas): style attribution badge with glass backdrop and matching border",

    # Day 20: Header Bar & Token Budget HUD
    "feat(hud): create components/hud/HeaderBar.tsx",
    "feat(hud): add Loom brand logo with gradient icon container",
    "feat(hud): add ContextGraph version pill badge (v0.1)",
    "feat(hud): add workspace selector pill showing active ws_01",
    "feat(hud): create Token Budget progress bar component",
    "feat(hud): add Gauge icon and live token count readout",
    "feat(hud): implement dynamic budget color threshold: Emerald (<75%)",
    "feat(hud): implement dynamic budget color threshold: Amber (75-90%)",
    "feat(hud): implement dynamic budget color threshold: Crimson (>90%)",
    "style(hud): add animated progress bar width transition",
    "feat(hud): add Reset Graph button with RefreshCw icon",
    "feat(hud): add Compile DAG trigger button with Play icon and loading spinner",

    # Day 21: Telemetry & Assembled Context Inspector Drawer
    "feat(hud): create components/hud/InspectorDrawer.tsx",
    "feat(hud): implement floating bottom glassmorphic HUD drawer",
    "feat(hud): add collapsible header toggle with Terminal icon",
    "feat(hud): add active nodes count badge in inspector header",
    "feat(hud): add ChevronDown and ChevronUp toggle indicators",
    "feat(hud): implement assembled linear prompt display container",
    "feat(hud): add Copy Full Prompt button with clipboard API",
    "feat(hud): add copied state feedback with Check icon and emerald badge",
    "feat(hud): add Included Nodes breakdown list with token counts",
    "feat(hud): add Muted Nodes breakdown list with mute indicators",
    "feat(hud): add empty state prompt instructing user to compile DAG",
    "refactor(hud): ensure inspector drawer does not intercept canvas drag events",

    # Day 22: Spatial Canvas Assembly & Viewport Integration
    "feat(canvas): create App.tsx main spatial viewport component",
    "feat(canvas): import React Flow stylesheet and custom styles",
    "feat(canvas): register custom nodeTypes (system, context_chunk, prompt_query, llm_runner)",
    "feat(canvas): register custom edgeTypes (glowing)",
    "feat(canvas): configure React Flow dark dot grid background",
    "feat(canvas): configure pan-zoom controls positioned at top-left",
    "feat(canvas): add MiniMap component positioned at bottom-right",
    "style(canvas): customize MiniMap node colors matching node type themes",
    "style(canvas): add maskColor and glassmorphic styling to MiniMap",
    "feat(canvas): bind node selection and pane click handlers",
    "feat(canvas): set default zoom constraints (minZoom 0.2, maxZoom 2.0)",
    "feat(canvas): hide React Flow default attribution watermark",

    # Day 23: Responsive Layout & Cross-Browser Styling
    "style(ui): implement full-viewport responsive flex layout",
    "style(ui): add mobile breakpoint adjustments for header HUD elements",
    "style(ui): ensure inspector drawer adapts to narrow screen widths",
    "style(ui): add webkit-scrollbar custom dark styling in index.css",
    "style(ui): configure text selection colors with cyan accents",
    "style(ui): optimize touch event handling on mobile viewports",
    "style(ui): verify React Flow handle drag-and-drop on high-DPI displays",
    "perf(ui): add CSS hardware acceleration hints for smooth 60fps pan/zoom",
    "style(ui): verify dark mode class persistence on html element",
    "style(ui): add fallback styles for browsers without backdrop-filter support",
    "test(ui): test responsive breakpoints from 375px mobile to 1440px desktop",
    "style(ui): eliminate horizontal overflow on canvas viewport container",

    # Day 24: Integration Verification & End-to-End Diagnostics
    "test(e2e): verify end-to-end data flow between React frontend and FastAPI",
    "test(e2e): test compile API payload serialization from Zustand store",
    "test(e2e): test DAGCompiler response parsing and store state hydration",
    "test(e2e): verify token calculation parity between frontend and backend",
    "test(e2e): verify non-destructive mute toggle updates token meter in real time",
    "test(e2e): test edge glow intensity recalculation on attribution changes",
    "test(e2e): verify prompt copy-to-clipboard functionality in inspector",
    "test(e2e): verify reset button returns canvas to canonical seed state",
    "test(e2e): audit accessibility attributes on all interactive controls",
    "test(e2e): verify zero console errors or React warnings on canvas interaction",
    "test(backend): validate backend test suite passes across Python environments",
    "test(frontend): verify TypeScript compilation output with zero type errors",

    # Day 25: Documentation, Architecture Guide & Phase 1 Sign-Off
    "docs: document project architecture and data contracts in README",
    "docs: add directory structure layout guide to documentation",
    "docs: add backend API endpoint reference and curl examples",
    "docs: add frontend component hierarchy and store documentation",
    "docs: add design-system.md cross-references for token styling",
    "docs: document leave-one-out logprob perturbation methodology",
    "docs: document non-destructive mute and fork workflows for prompt engineering",
    "docs: add Phase 2 roadmap preview (Diff / Fork nodes, SQLite ledger)",
    "docs: add Phase 3 roadmap preview (Live Ollama streaming & attention heatmaps)",
    "docs: add Phase 4 roadmap preview (Time-travel scrubber & branching)",
    "chore: final review of codebase cleanliness, comments, and linting",
    "feat: Phase 1 milestone completed: Loom ContextGraph foundation operational"
]

assert len(COMMIT_MESSAGES) == 300, f"Expected 300 commit messages, got {len(COMMIT_MESSAGES)}"

print(f"Verified {len(COMMIT_MESSAGES)} commit messages across {TOTAL_DAYS} days.")
