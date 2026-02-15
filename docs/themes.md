# Themes

D2 includes a variety of built-in themes. Use the `theme` option to set one.

## Light themes

| ID | Name |
|----|------|
| 0 | Neutral Default |
| 1 | Neutral Grey |
| 3 | Flagship Terrastruct |
| 4 | Cool Classics |
| 5 | Mixed Berry Blue |
| 6 | Grape Soda |
| 7 | Aubergine |
| 8 | Colorblind Clear |
| 100 | Vanilla Nitro Cola |
| 101 | Orange Creamsicle |
| 102 | Shirley Temple |
| 103 | Earth Tones |
| 104 | Everglade Green |
| 105 | Buttered Toast |

## Dark themes

| ID | Name |
|----|------|
| 200 | Dark Mauve |
| 201 | Dark Flagship Terrastruct |
| 202 | Terminal |
| 300 | Terminal |
| 301 | Terminal Grayscale |
| 302 | Origami |

## Auto-switching

By default, diagrams use theme `0` in light mode and theme `200` in dark mode. This switches automatically when the user toggles Slidev's dark mode.

To customize:

````markdown
```d2 {theme: 5, darkTheme: 302}
a -> b
```
````

- `theme` — used in light mode (and both modes if `darkTheme` is not set)
- `darkTheme` — used only in dark mode

## Preview

Browse all themes with visual examples at the [D2 Theme Gallery](https://d2lang.com/tour/themes/).
