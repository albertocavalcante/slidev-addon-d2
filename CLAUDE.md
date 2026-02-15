# slidev-addon-d2

A Slidev addon that adds native D2 diagram support via ` ```d2 ` fenced code blocks.

## Key Constraints

- **Bun only.** Never use npm, npx, yarn, or pnpm.
- **WASM-first.** Use `@terrastruct/d2` npm package for client-side rendering. No CLI dependency required for users.
- **Follow Slidev conventions.** Study how Slidev's built-in Mermaid integration works (markdown-it fence rule → Vue component) and follow the same pattern exactly.
- **Zero config.** Must work by just adding `addons: [slidev-addon-d2]` to frontmatter and writing ` ```d2 ` code blocks.

## Architecture

1. Addon registers a markdown-it fence rule for `d2` code blocks
2. Transforms them into `<D2Diagram :code="..." :options="..." />` Vue component calls
3. The D2Diagram component uses `@terrastruct/d2` WASM to compile and render SVGs client-side

## Read PLAN.md for full context

The PLAN.md file contains the complete implementation plan, reference implementations, D2 language reference, and all useful links.
