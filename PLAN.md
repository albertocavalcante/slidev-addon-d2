# slidev-addon-d2

A Slidev addon that adds native D2 diagram support via fenced code blocks.

## The Gap

Slidev has built-in support for Mermaid and PlantUML diagrams. D2 produces significantly better-looking diagrams (especially architecture diagrams, the bread and butter of tech pitch decks), but has zero Slidev integration today. No addon exists anywhere -- npm, GitHub, or otherwise.

This is the missing piece.

## What It Should Do

````markdown
```d2 {theme: 200, sketch: true}
user -> api: REST
api -> db: SQL
api -> cache: Redis
```
````

That's it. Write D2 in a fenced code block, get a rendered SVG in your slide. Same DX as Mermaid in Slidev.

## How Slidev's Mermaid Integration Works (Reference)

Slidev's built-in Mermaid support follows this pattern:

1. **Markdown-it fence rule** intercepts ` ```mermaid ` code blocks during markdown parsing
2. Transforms them into `<Mermaid :code="..." :options="..." />` Vue component calls
3. The `Mermaid.vue` component renders client-side using the `mermaid` JS library
4. Options (theme, scale, etc.) are parsed from the JSON object after the language identifier

Source: `@slidev/cli` internals + [sli.dev/features/mermaid](https://sli.dev/features/mermaid)

We should follow the exact same pattern for D2.

## Architecture

### Option A: WASM rendering (recommended)

Use the official `@terrastruct/d2` npm package which wraps the D2 Go compiler as WASM.

```
slides.md
  └─ markdown-it fence rule (addon)
       └─ <D2Diagram :code="..." :options="..." />
            └─ @terrastruct/d2 (WASM, client-side)
                 └─ SVG output → v-html
```

**Pros:**
- No CLI dependency -- works anywhere Slidev runs (CI, Codespaces, Stackblitz)
- Live hot-reload in `slidev dev`
- Diagrams stay as text in the slide file (source-controlled)
- Same WASM that powers [play.d2lang.com](https://play.d2lang.com/)

**Cons:**
- WASM bundle size (need to measure -- likely 5-10MB)
- Only supports dagre and ELK layout engines (TALA requires server/binary)
- Initial render latency on first load

### Option B: CLI rendering (build-time)

Shell out to the `d2` CLI binary at build time, similar to how `vitepress-plugin-d2` works.

**Pros:**
- Full feature support (all layout engines including TALA)
- No client-side overhead
- Smaller bundle

**Cons:**
- Requires D2 CLI installed locally
- Slower dev server rebuilds
- Won't work in browser-only environments

### Recommendation

**Go with Option A (WASM).** The zero-dependency story is critical for adoption. Users shouldn't need to install a Go binary to use a Slidev addon. The WASM bundle size is a tradeoff worth making.

Consider Option B as a fallback/configuration option for users who want TALA layout or smaller bundles.

## Implementation Plan

### Phase 1: Core addon (MVP)

1. **Scaffold the addon**
   - `bun init` a new project
   - Set up as a proper Slidev addon (see [Writing Addons](https://sli.dev/guide/write-addon))
   - Package name: `slidev-addon-d2`
   - Keywords: `["slidev-addon", "slidev", "d2", "diagrams"]`

2. **Create `D2Diagram.vue` component**
   - Props: `code` (string), `options` (object: theme, sketch, layout, pad, etc.)
   - Uses `@terrastruct/d2` WASM to compile + render
   - Outputs SVG via `v-html`
   - Handles loading state (show a placeholder while WASM initializes)
   - Caches the D2 instance (singleton, don't re-init WASM per diagram)
   - Dark mode awareness (auto-switch D2 theme based on Slidev's color scheme)

3. **Register markdown-it fence rule**
   - Intercept ` ```d2 ` fenced code blocks
   - Parse options from the JSON object after the language identifier (same syntax as Mermaid)
   - Transform into `<D2Diagram :code="..." :options="..." />`
   - File: `setup/main.ts` or equivalent addon entry point

4. **Handle options**
   ```markdown
   ```d2 {theme: 200, sketch: true, layout: 'elk', pad: 20}
   ```
   ```
   - `theme`: D2 theme ID (0=default, 1=neutral, 200=dark, etc.) -- see [D2 themes](https://d2lang.com/tour/themes/)
   - `sketch`: boolean, hand-drawn style
   - `layout`: `'dagre'` | `'elk'`
   - `pad`: padding in pixels
   - `scale`: CSS scale factor (applied to the SVG container)

5. **Global configuration**
   - Allow defaults via `setup/d2.ts`:
     ```typescript
     import { defineMermaidSetup } from '@slidev/types' // reference pattern

     export default defineD2Setup(() => ({
       theme: 200,
       sketch: false,
       layout: 'elk',
     }))
     ```
   - Or via frontmatter:
     ```yaml
     ---
     d2:
       theme: 200
       sketch: false
     ---
     ```

6. **Tests**
   - Unit test the markdown-it transform (code block → component call)
   - Unit test the D2 WASM rendering (code → SVG)
   - Visual regression test with a sample slide deck

7. **Demo slides**
   - `slides.md` in the repo root that showcases all features
   - Architecture diagram, sequence diagram, flow chart, sketch mode, dark mode

### Phase 2: Polish

- **Click animations**: Support `v-click` integration (render diagram progressively?)
- **Error handling**: Show a clear error message in the slide if D2 compilation fails (don't crash the whole deck)
- **Lazy loading**: Only load WASM when a slide with a D2 diagram is reached
- **SSR/build**: Handle server-side rendering for `slidev build` (pre-render SVGs at build time)
- **Theme sync**: Auto-detect Slidev dark/light mode and pick matching D2 theme

### Phase 3: Advanced

- **CLI fallback mode**: Config option to use local `d2` binary instead of WASM (for TALA support)
- **Import from `.d2` files**: ````d2 {src: './diagrams/arch.d2'}` ```
- **Animated diagrams**: D2 supports CSS animations in SVG output -- pass through to slides
- **Icons**: D2 supports embedded icons -- ensure they render correctly in Slidev

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@terrastruct/d2` | ^0.1.33 | D2 WASM compiler + renderer |
| `@slidev/types` | ^52.x | Slidev type definitions for addon API |

## Reference Implementations

These are the most useful codebases to study:

### Slidev's own Mermaid integration
- How Slidev registers a markdown-it fence rule and maps it to a Vue component
- The pattern to follow exactly
- Source: inside `@slidev/cli` package (look at `node_modules/@slidev/cli`)

### vitepress-plugin-d2
- A markdown-it plugin that renders D2 via CLI
- Useful for understanding the markdown-it fence rule registration
- GitHub: [BadgerHobbs/vitepress-plugin-d2](https://github.com/BadgerHobbs/vitepress-plugin-d2)
- Note: this is CLI-based (Option B), not WASM -- but the markdown-it integration pattern is relevant

### @terrastruct/d2 npm package
- Official WASM wrapper for D2
- npm: [@terrastruct/d2](https://www.npmjs.com/package/@terrastruct/d2)
- API:
  ```typescript
  import { D2 } from '@terrastruct/d2'

  const d2 = new D2()
  const result = await d2.compile({
    fs: { 'input.d2': 'user -> api -> db' },
    inputPath: 'input.d2',
    options: { sketch: false }
  })
  const svg = await d2.render(result.diagram, result.renderOptions)
  ```
- Powers [play.d2lang.com](https://play.d2lang.com/) -- proof it works in browsers

### astro-d2
- Astro integration for D2 (remark plugin, not markdown-it)
- npm: [astro-d2](https://www.npmjs.com/package/astro-d2)
- Not directly usable (different plugin system) but good for understanding D2 integration patterns

### Slidev addon examples
- `slidev-addon-excalidraw`: [github.com/haydenull/slidev-addon-excalidraw](https://github.com/haydenull/slidev-addon-excalidraw)
- `slidev-addon-tldraw`: embeds drawing canvas in slides
- `slidev-addon-fancy-arrow`: simple addon showing the registration pattern

## D2 Quick Reference

### Language basics
```d2
# Shapes
server: Web Server
db: PostgreSQL {shape: cylinder}
user: User {shape: person}

# Connections
user -> server: HTTPS
server -> db: SQL
server -> cache: Redis {style.stroke-dash: 5}

# Containers (nested)
cloud: AWS {
  vpc: VPC {
    subnet: Private Subnet {
      api: API Server
      db: RDS
    }
  }
}

# Styling
api.style.fill: "#4A90D9"
api.style.stroke: "#2C5F8A"
```

### Themes
| ID | Name |
|----|------|
| 0 | Default (light) |
| 1 | Neutral |
| 3 | Flagship Terrastruct |
| 4 | Cool Classics |
| 5 | Mixed Berry Blue |
| 6 | Grape Soda |
| 8 | Aubergine |
| 100 | Colorblind Clear |
| 200 | Dark Mauve (dark) |
| 201 | Dark Flagship Terrastruct (dark) |

Full list: [d2lang.com/tour/themes](https://d2lang.com/tour/themes/)

### Layout engines
| Engine | Bundled in WASM? | Notes |
|--------|-----------------|-------|
| dagre | Yes | Default, good for most diagrams |
| ELK | Yes | Better for complex/large diagrams |
| TALA | No (proprietary) | Best quality, requires binary or API |

### D2 ecosystem maturity
- **GitHub**: ~21.7k stars, 530+ forks
- **Version**: v0.7.1 (Aug 2025), releases every 1-2 months
- **Backing**: Terrastruct Inc. (commercial entity)
- **License**: MPL 2.0
- **WASM npm**: `@terrastruct/d2` v0.1.33 (Aug 2025)

## Project Structure

```
slidev-addon-d2/
  components/
    D2Diagram.vue          # Main rendering component
  setup/
    main.ts                # Addon entry: register markdown-it fence rule
  styles/
    d2.css                 # Container styles, loading states
  index.ts                 # Addon exports
  package.json
  tsconfig.json
  slides.md                # Demo deck
  README.md
  LICENSE                  # MIT
```

## package.json skeleton

```json
{
  "name": "slidev-addon-d2",
  "version": "0.1.0",
  "description": "D2 diagram support for Slidev presentations",
  "keywords": ["slidev-addon", "slidev", "d2", "diagrams", "architecture"],
  "license": "MIT",
  "author": "Alberto Cavalcante",
  "repository": {
    "type": "git",
    "url": "https://github.com/albertocavalcante/slidev-addon-d2"
  },
  "type": "module",
  "main": "index.ts",
  "slidev": {
    "components": true,
    "setup": true
  },
  "dependencies": {
    "@terrastruct/d2": "^0.1.33"
  },
  "peerDependencies": {
    "@slidev/cli": ">=52.0.0"
  }
}
```

## Useful Links

- **D2 language**: [d2lang.com](https://d2lang.com/)
- **D2 playground**: [play.d2lang.com](https://play.d2lang.com/)
- **D2 GitHub**: [github.com/terrastruct/d2](https://github.com/terrastruct/d2)
- **D2 themes gallery**: [d2lang.com/tour/themes](https://d2lang.com/tour/themes/)
- **D2 WASM npm**: [npmjs.com/package/@terrastruct/d2](https://www.npmjs.com/package/@terrastruct/d2)
- **D2 icons**: [icons.terrastruct.com](https://icons.terrastruct.com/)
- **Slidev docs**: [sli.dev](https://sli.dev/)
- **Slidev writing addons**: [sli.dev/guide/write-addon](https://sli.dev/guide/write-addon)
- **Slidev addon gallery**: [sli.dev/resources/addon-gallery](https://sli.dev/resources/addon-gallery)
- **Slidev Mermaid docs**: [sli.dev/features/mermaid](https://sli.dev/features/mermaid)
- **vitepress-plugin-d2**: [github.com/BadgerHobbs/vitepress-plugin-d2](https://github.com/BadgerHobbs/vitepress-plugin-d2)
- **Mermaid vs D2 comparison**: [aaronjbecker.com/posts/mermaid-vs-d2-comparing-text-to-diagram-tools](https://aaronjbecker.com/posts/mermaid-vs-d2-comparing-text-to-diagram-tools)
