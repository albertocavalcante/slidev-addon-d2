# slidev-addon-d2

D2 diagram support for [Slidev](https://sli.dev/) presentations. Write D2 in fenced code blocks, get rendered SVGs in your slides.

Uses the official [`@terrastruct/d2`](https://www.npmjs.com/package/@terrastruct/d2) WASM package for client-side rendering — no CLI installation required.

## Install

```bash
bun add slidev-addon-d2
```

Add to your slides frontmatter:

```yaml
---
addons:
  - d2
---
```

## Usage

````markdown
```d2
user: User {shape: person}
api: API Server
db: PostgreSQL {shape: cylinder}

user -> api: HTTPS
api -> db: SQL
```
````

### Options

Pass options as a JSON object after the language identifier:

````markdown
```d2 {sketch: true, theme: 5, layout: 'elk'}
x -> y -> z
```
````

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | `number` | `0` (light) / `200` (dark) | D2 theme ID. Auto-switches with Slidev dark mode. |
| `darkTheme` | `number` | — | Theme to use in dark mode (overrides auto-switch). |
| `sketch` | `boolean` | `false` | Hand-drawn style. |
| `layout` | `'dagre' \| 'elk'` | `'dagre'` | Layout engine. ELK is better for complex diagrams. |
| `pad` | `number` | `100` | Padding around the diagram in pixels. |
| `scale` | `number` | — | CSS scale factor applied to the SVG container. |

### Dark mode

By default, diagrams automatically switch between theme `0` (light) and `200` (Dark Mauve) when Slidev's dark mode is toggled. Override this with explicit `theme` or `darkTheme` options.

### D2 themes

Some commonly used theme IDs:

| ID | Name |
|----|------|
| 0 | Neutral Default |
| 1 | Neutral Grey |
| 3 | Flagship Terrastruct |
| 5 | Mixed Berry Blue |
| 8 | Colorblind Clear |
| 100 | Vanilla Nitro Cola |
| 200 | Dark Mauve |
| 300 | Terminal |
| 302 | Origami |

Full list: [d2lang.com/tour/themes](https://d2lang.com/tour/themes/)

## Development

```bash
cd example
bun install
bun run dev
```

## License

MIT
