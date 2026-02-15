# slidev-addon-d2

D2 diagram support for [Slidev](https://sli.dev/) presentations. Write D2 in fenced code blocks, get rendered SVGs in your slides.

Uses the official [`@terrastruct/d2`](https://www.npmjs.com/package/@terrastruct/d2) WASM package for client-side rendering — no CLI installation required.

**[Documentation](https://albertocavalcante.github.io/slidev-addon-d2/)** | **[Live Demo](https://albertocavalcante.github.io/slidev-addon-d2/demo/)**

## Quick Start

The package is currently published to [GitHub Packages](https://github.com/albertocavalcante/slidev-addon-d2/packages). An npm release is coming soon.

Add a `.npmrc` to your project to configure the `@albertocavalcante` scope:

```ini
@albertocavalcante:registry=https://npm.pkg.github.com
```

Install the package:

```bash
bun add @albertocavalcante/slidev-addon-d2
```

Enable the addon in your slides frontmatter:

```yaml
---
addons:
  - d2
---
```

Write a D2 diagram:

````markdown
```d2
user: User {shape: person}
api: API Server
db: PostgreSQL {shape: cylinder}

user -> api: HTTPS
api -> db: SQL
```
````

Pass options after the language identifier:

````markdown
```d2 {sketch: true, theme: 5, layout: 'elk'}
x -> y -> z
```
````

See the [documentation](https://albertocavalcante.github.io/slidev-addon-d2/) for all options, themes, and configuration details.

## Development

```bash
cd example
bun install
bun run dev
```

## License

MIT
