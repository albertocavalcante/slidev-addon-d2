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

## Read PLAN.md for full context

The PLAN.md file contains the original implementation plan, reference implementations, D2 language reference, and all useful links.
