# Constellations

A p5.js animation of slowly drifting stars connected by fading lines.

## Development

```
npm install
npm run dev
```

The sketch lives entirely in `constellations.js`. Key parameters at the top of the file:

| Parameter | Effect |
|---|---|
| `numberOfPoints` | How many stars |
| `maxLength` | Max distance at which stars connect |
| `maxDiameter` / `minDiameter` | Star size range |
| `backgroundColour` | Background fill |

Each `Point` drifts sinusoidally from its start position. The amplitude is `100 / range` where `range` is random in `[-0.5, 1.5]` — values near zero produce large, slow sweeps; values near ±1.5 produce tight, fast ones. `frame` increments by `0.001` per draw call, controlling the animation speed.

## Deploy

Pushes to `main` deploy automatically via GitHub Actions to GitHub Pages.
