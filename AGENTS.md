# slidev-addon-d2

A Slidev addon that adds native D2 diagram support via ` ```d2 ` fenced code blocks.

## Key Constraints

- **Bun only.** Never use npm, npx, yarn, or pnpm.
- **WASM-first.** Uses `@terrastruct/d2` npm package for client-side rendering. No CLI dependency required for users.
- **Follow Slidev conventions.** Follows the same pattern as Slidev's built-in Mermaid integration (preCodeblock string transform + Vue component).
- **Zero config.** Works by adding `addons: ['d2']` to frontmatter and writing ` ```d2 ` code blocks.

## Architecture

1. `setup/transformers.ts` registers a `preCodeblock` transform via `defineTransformersSetup` that matches ` ```d2 ` fenced code blocks using regex on MagicString
2. Transforms them into `<D2Diagram code-lz="..." v-bind="{...}" />` — code is LZ-compressed to base64 (same as Mermaid)
3. `components/D2Diagram.vue` lazy-loads `@terrastruct/d2` WASM as a module-level singleton, compiles D2 source, and renders SVG via `v-html`
4. Dark mode auto-switches theme (0 light / 200 dark) using `useDark()` from `@vueuse/core`

## Important Implementation Details

- **Addon naming:** Slidev's resolver prepends `slidev-addon-` to names in frontmatter. Users write `addons: ['d2']`, NOT `addons: ['slidev-addon-d2']`.
- **Module-level singletons:** The D2 WASM instance and SVG cache live in a plain `<script>` block (not `<script setup>`) so they're shared across all component instances.
- **D2 WASM API:** `compile(code, options)` → `render(diagram, renderOptions)`. Always use `noXMLTag: true` for HTML embedding. Errors are JSON-encoded arrays.
- **Local dev testing:** Use the `example/` directory with `bun install && bun run dev`. The example links to the addon via `bun link`.

## Known Gotchas

### WASM concurrency — compile/render calls must be serialized

D2 WASM crashes (tab crash, `[object Object]` output, infinite loading spinners) when multiple `compile()`/`render()` calls run concurrently. Slidev pre-renders adjacent slides, so all `D2Diagram` component instances fire their `watchEffect` simultaneously. Without serialization, the concurrent WASM calls corrupt shared state.

**Fix:** All compile/render operations go through a module-level `enqueue()` function that chains promises sequentially. The `getD2()` singleton also clears `d2Promise` on failure so a broken WASM import can be retried. Never remove the serialization queue.

### SVG overflow — diagrams must be viewBox-scaled to fit slides

D2 renders SVGs with explicit `width`/`height` attributes that often exceed the slide viewport (960×540 default). Without viewBox-based sizing, diagrams overflow the slide boundary and get clipped.

**Fix:** After rendering, the component extracts `viewBox` height from the SVG, sets an explicit `height` attribute (scaled by the `scale` prop, default 1), and removes the `width`/`style` attributes so the SVG scales responsively within CSS `max-height: 100%` constraints. This is the same pattern Slidev's built-in Mermaid integration uses (`@slidev/client/builtin/Mermaid.vue`). Users can fine-tune with `{scale: 0.8}` in the code block options. Never set both explicit `width` and `height` on the SVG — remove `width` and let the browser calculate it from the aspect ratio.

### Local dev server — Slidev needs a TTY

`bunx slidev` (dev mode) exits immediately when run as a background process without a TTY. The server prints its banner then quits because its readline handler detects no terminal. Use `script -q /dev/null bash -c "bun run dev -- --port 3030"` to provide a pseudo-TTY when running headless. This only affects the dev server; `bunx slidev build` works fine without a TTY.

## Read PLAN.md for full context

The PLAN.md file contains the original implementation plan, reference implementations, D2 language reference, and all useful links.
