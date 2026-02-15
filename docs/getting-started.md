# Getting Started

## Prerequisites

- [Slidev](https://sli.dev/) v52 or later
- [Bun](https://bun.sh/) (recommended) or any Node.js package manager

## Install

```bash
bun add slidev-addon-d2
```

Or with other package managers:

```bash
npm install slidev-addon-d2
pnpm add slidev-addon-d2
```

## Enable the addon

Add `d2` to the `addons` array in your slides frontmatter:

```yaml
---
addons:
  - d2
---
```

::: tip
Slidev automatically prepends `slidev-addon-` to addon names. Write `d2`, not `slidev-addon-d2`.
:::

## Your first diagram

Write D2 code in a fenced code block with the `d2` language identifier:

````markdown
```d2
user: User {shape: person}
api: API Server
db: PostgreSQL {shape: cylinder}

user -> api: HTTPS
api -> db: SQL
```
````

That's it — the diagram renders as an SVG directly in your slide.

## Options

Pass options as a JSON object after the language identifier:

````markdown
```d2 {sketch: true, theme: 5, layout: 'elk'}
x -> y -> z
```
````

See the full [Options reference](/options) for all available options.

## Dark mode

Diagrams automatically switch between theme `0` (Neutral Default, light) and theme `200` (Dark Mauve) when Slidev's dark mode is toggled.

Override this with explicit `theme` or `darkTheme` options:

````markdown
```d2 {theme: 5, darkTheme: 301}
a -> b
```
````

## How it works

1. A `preCodeblock` transformer detects ` ```d2 ` fenced code blocks at build time
2. Each block is replaced with a `<D2Diagram>` Vue component (code is LZ-compressed)
3. The component lazy-loads the `@terrastruct/d2` WASM module and renders SVGs client-side
4. Dark mode is detected via `useDark()` from `@vueuse/core` and the theme is switched automatically
