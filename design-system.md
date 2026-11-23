# Loom / ContextGraph — Design System & Visual Architecture

> **Aesthetic Art Direction:** Dark Obsidian Glassmorphism with Cyberpunk / Sci-Fi HUD Telemetry  
> **Philosophy:** "Figma meets LLM interpretability engine" — High-density, hardware-accelerated spatial workspace with high-contrast token readouts, physical depth, and glowing vector attributions.

---

## 1. Color Palette (60-30-10 Rule)

### Dominant 60% — Obsidian & Void Surfaces
Deep space obsidian with subtle cool undertones to minimize eye fatigue during extended prompt debugging sessions.
- **Canvas Void:** `#08090D` (`bg-canvas-void`)
- **Panel Surface (Backdrop Glass):** `rgba(13, 16, 23, 0.75)` with `backdrop-filter: blur(16px)`
- **Card / Node Background:** `rgba(20, 24, 35, 0.85)`
- **Node Header Background:** `rgba(26, 32, 48, 0.65)`
- **Muted Node Mask:** `rgba(10, 12, 18, 0.92)` with `grayscale opacity-50`

### Secondary 30% — Structural Borders & Typography
Crisp technical hierarchy with high-readability monochrome tiers.
- **Glass Specular Border:** `rgba(255, 255, 255, 0.08)`
- **Hover/Selected Border:** `rgba(255, 255, 255, 0.22)`
- **Text Primary:** `#F3F4F6` (Cool Gray 100)
- **Text Secondary / Metadata:** `#94A3B8` (Slate 400)
- **Text Muted / Code Keys:** `#64748B` (Slate 500)
- **Grid Dots / Spatial Mesh:** `rgba(255, 255, 255, 0.04)`

### Accent 10% — Telemetry & Attribution Glows
Meaningful, data-driven semantic colors used exclusively for node states, attribution strength, and token budgeting.
- **Cyan (Prompt & Primary Stream):** `#00F0FF` (`text-cyan-400`, `shadow-cyan-500/20`) — Active query & signal flow.
- **Emerald (System & Healthy Budget):** `#00FF9D` (`text-emerald-400`, `shadow-emerald-500/20`) — Rules & valid token budget.
- **Amber (High Attribution & Caution Budget):** `#FFB800` (`text-amber-400`, `shadow-amber-500/20`) — Influential context & >75% token limit.
- **Crimson (Dominant Attribution & Budget Overflow):** `#FF3366` (`text-rose-500`, `shadow-rose-500/30`) — Critical perturbation drop & >95% token limit.
- **Purple / Violet (Diff & Fork Nodes):** `#A855F7` (`text-purple-400`) — Divergence branches.

---

## 2. Typography Scale

- **Display & Interface:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `system-ui`
  - Workspace Title: `14px`, Font Weight 700, Tracking `+0.05em`, Uppercase
  - Node Title: `12px`, Font Weight 600, Tracking `0.02em`
  - Body / Node Textarea: `12px`, Font Weight 400, Line Height `1.6`
  - Badges & Micro-Labels: `10px`, Font Weight 600, Tracking `0.06em`, Uppercase

- **Code & Telemetry Readouts:** `JetBrains Mono`, `Fira Code`, `ui-monospace`, `monospace`
  - Token Counter: `11px`, Font Weight 600, Tabular Numbers
  - Latency & TTFT: `11px`, Font Weight 500
  - JSON & Token Diffs: `11px`, Line Height `1.5`

---

## 3. Spatial & Node Geometry

- **Node Width:** Fixed `320px` to `380px` for optimal reading rhythm on infinite 2D canvas.
- **Border Radius:**
  - Nodes: `12px` (`rounded-xl`)
  - Internal Badges & Buttons: `6px` (`rounded-md`)
  - HUD Floating Panels: `16px` (`rounded-2xl`)
- **Spacing Scale:** Standard 4px grid (`p-3`, `gap-2`, `space-y-2.5`).
- **Elevation & Shadows:**
  - Standard Glass Node: `0 8px 32px 0 rgba(0, 0, 0, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)`
  - Active Selected Node: `0 0 0 1.5px #00F0FF, 0 12px 40px -4px rgba(0, 240, 255, 0.2)`
  - Muted Node: Flat `border 1px solid rgba(255, 255, 255, 0.04)`, no glow

---

## 4. Glowing Edges & Attribution Shader Tokens

- **Default Edge:**
  - Stroke: `#334155` (Slate 700), Stroke Width: `1.5px`
- **Active Compiling Edge:**
  - Stroke: `#00F0FF`, Animated dash offset `stroke-dasharray: 6 4`, SVG Gaussian blur filter
- **Attribution Glow Gradient:**
  - Low Influence (< 0.3): Slate to Teal (`#38BDF8`, glow radius: `3px`)
  - Medium Influence (0.3 - 0.7): Cyan to Amber (`#F59E0B`, glow radius: `6px`)
  - High Influence (> 0.7): Amber to Crimson (`#F43F5E`, glow radius: `10px`, pulse animation)

---

## 5. Iconography Standard

- **Icon Set:** Lucide React SVG icons (Strict zero-emoji policy for professional developer UX).
- Standard Sizes:
  - Node Title Bar: `14px` (`w-3.5 h-3.5`)
  - Action Controls (Mute, Run, Fork): `12px` (`w-3 h-3`)
  - HUD Global Controls: `16px` (`w-4 h-4`)

---

## 6. Accessibility & Reduced Motion

- All animations (`framer-motion`, SVG dash offsets, node pulse) respect `@media (prefers-reduced-motion: reduce)`.
- Minimum text contrast ratio of `4.5:1` against glassmorphic card backdrops.
- Focus rings are styled with high-visibility 2px cyan outlines for keyboard navigation.
