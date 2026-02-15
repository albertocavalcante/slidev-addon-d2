# Options

Pass options as a JSON object after the `d2` language identifier:

````markdown
```d2 {theme: 5, sketch: true, layout: 'elk'}
x -> y -> z
```
````

## Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | `number` | `0` / `200` | D2 theme ID. Auto-switches between light and dark. |
| `darkTheme` | `number` | — | Theme to use in dark mode (overrides auto-switch). |
| `sketch` | `boolean` | `false` | Hand-drawn style. |
| `layout` | `'dagre' \| 'elk'` | `'dagre'` | Layout engine. |
| `pad` | `number` | `100` | Padding around the diagram in pixels. |
| `scale` | `number` | — | CSS scale factor applied to the SVG container. |

## theme

The D2 theme ID to use. Defaults to `0` (Neutral Default) in light mode and `200` (Dark Mauve) in dark mode. When you set `theme` explicitly, it is used in both light and dark mode unless `darkTheme` is also set.

````markdown
```d2 {theme: 5}
a -> b
```
````

See the [Themes](/themes) page for all available theme IDs.

## darkTheme

Theme to use specifically in dark mode. When set alongside `theme`, `theme` applies in light mode and `darkTheme` applies in dark mode.

````markdown
```d2 {theme: 3, darkTheme: 301}
a -> b
```
````

## sketch

Enables hand-drawn rendering style.

````markdown
```d2 {sketch: true}
laptop: Laptop
cloud: Cloud {shape: cloud}
laptop -> cloud: sync
```
````

## layout

The layout engine to use. `dagre` is the default and works well for most diagrams. `elk` handles complex nested diagrams better.

````markdown
```d2 {layout: 'elk'}
cloud: AWS {
  vpc: VPC {
    api: API Server
    db: RDS {shape: cylinder}
  }
}
user: User {shape: person}
user -> cloud.vpc.api
cloud.vpc.api -> cloud.vpc.db
```
````

## pad

Padding in pixels around the diagram. Defaults to `100`.

````markdown
```d2 {pad: 50}
a -> b -> c
```
````

## scale

CSS scale factor applied to the SVG container. Useful for fitting large diagrams or making small ones larger.

````markdown
```d2 {scale: 0.8}
a -> b -> c -> d -> e
```
````
