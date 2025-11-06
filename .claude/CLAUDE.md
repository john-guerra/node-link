# CLAUDE.md

## Project Overview

This is a Force Directed Reactive Widget exported from Observable (https://observablehq.com/@john-guerra/force-directed-graph@1859). It's a D3.js-based force-directed graph visualization library that supports both SVG and Canvas rendering.

**Current State:** Observable notebook compiled to JavaScript modules using the Observable Runtime.

**Migration Goal:** Extract this into a standalone NPM package `netviz` following the reactivewidgets.org pattern, similar to the navio.dev architecture (https://github.com/john-guerra/navio).

## Running the Project

Start a local web server to view the visualization:

```sh
npx http-server
```

Then open your browser to the displayed URL (typically http://localhost:8080).

## Installing as a Module

To use this as an npm module in another project:

```sh
npm install @observablehq/runtime@5
npm install https://api.observablehq.com/d/89207a2280891f15@1859.tgz?v=3
```

## Architecture

### Observable Module System

This codebase uses the Observable Runtime module system where:
- Each file is a self-contained Observable module (named by hash@version.js)
- `index.js` re-exports the main module `89207a2280891f15@1859.js`
- `runtime.js` contains the Observable Runtime and Library
- `index.html` bootstraps the visualization with the Runtime

### Main Module Structure (`89207a2280891f15@1859.js`)

The entry point module imports several dependencies:
- `7a9e12f9fb3d8e06@517.js` - howto module
- `a33468b95d0b15b0@817.js` - Swatches for color legends
- `21d2053b3bc85bce@1299.js` - forceTransport and forceExtent custom forces
- `67def5cb48f2f6c4@205.js` - Edge bundling implementation
- `02a1577ab40d6f2e@934.js` - Smart labels module

### Core Components

**ForceGraph Function** (`_ForceGraph` in 89207a2280891f15@1859.js:230-488)
The main exported function that creates force-directed graphs. It:
- Accepts `{nodes, links}` as data and an options object
- Supports both SVG and Canvas renderers via `renderSVG` and `renderCanvas`
- Uses D3's force simulation with customizable forces
- Implements state preservation through `_this` parameter (allows redrawing on same graph instance)

**Key Features:**
- **Dual Rendering**: Both SVG (`renderSVG`) and Canvas (`renderCanvas`) with same API
- **Conditional Link Drawing**: `drawLinksWhenAlphaIs` option to defer link rendering until simulation stabilizes (performance optimization for large graphs)
- **Edge Bundling**: Optional force-based edge bundling via `useEdgeBundling` option
- **Boundary Forces**: Three types via `extentForce` option: `forceBoundary`, `forceTransport`, `forceExtent`
- **Zoom & Drag**: Interactive controls via D3 zoom and custom drag behavior
- **AutoFit**: Automatic viewport fitting with optional aspect ratio preservation
- **ForceInABox**: Grouping layout using the force-in-a-box algorithm
- **Smart Labels**: Voronoi-based label placement with occlusion detection

### Important Options in `defaultOpts` (lines 125-223)

The `defaultOpts` object defines all configuration options with defaults. Key options:
- `nodeId`, `nodeGroup`, `nodeRadius`, `nodeLabel` - Node configuration functions
- `linkStroke`, `linkStrokeWidth`, `linkDistance` - Link appearance
- `renderer: "canvas"` or `"svg"` - Rendering mode
- `drawLinksWhenAlphaIs: null` - Performance optimization for large graphs
- `extent: null` - Boundary box `[[x0,y0], [x1,y1]]` for constraining nodes
- `useEdgeBundling: false` - Enable edge bundling (slow on large graphs)
- `useForceInABox: false` - Enable force-in-a-box grouping
- `useZoom: true` - Enable zoom/pan interaction
- `autoFit: true` - Auto-scale viewport to fit all nodes
- `useSmartLabels: true` - Use Voronoi-based smart label placement

### Helper Functions

- `computeAutoFit` (lines 979-1022): Adjusts x/y scales to fit nodes in viewport with optional aspect ratio
- `drag` (lines 830-875): Custom drag behavior that works with zoom transforms
- `applyTransform` (line 823-828): Applies zoom transform to node/link coordinates
- `sample` (lines 885-890): Samples array for edge bundling (limits edges processed)
- `filterNetwork` (lines 893-977): Utility to filter network by nodes/links with ego-network support

### Data Files

- `files/*.json` - Data files referenced by FileAttachment (e.g., miserables.json for demo)
- `files/*.gz` - Compressed data files
- `files/*.gif` - Image assets

## Development Notes

### State Preservation Pattern

The `_this` option allows reusing the same DOM element and preserving node positions when re-rendering:

```javascript
ForceGraph(data, {
  _this: this,  // Pass previous instance
  // ...other options
})
```

This is used for live parameter updates without resetting the simulation.

### Performance Considerations

For large graphs (>1000 nodes):
- Set `drawLinksWhenAlphaIs: 0.9` to defer link rendering until simulation stabilizes
- Use `renderer: "canvas"` instead of SVG
- Limit edge bundling with `edgeBundling.max_links: 1000`
- Consider `useSmartLabels: false` for very large datasets

### Observable Runtime Integration

When using in other Observable notebooks, import like:

```javascript
import {ForceGraph} from "@john-guerra/force-directed-graph"
```

The module exports `ForceGraph`, helper functions, and the chart example.

## Migration Plan to netviz

### Target Architecture

**Package Name:** `netviz`

**API Design (Reactive Widgets Pattern):**
```javascript
// Returns HTML Element with .value property and input events
const graph = forceGraph(data, options);
document.body.appendChild(graph);

// Update with new data
graph.update(newData, newOptions);

// Cleanup
graph.destroy();

// Observable compatibility - auto-handle these options:
forceGraph(data, { invalidation, _this, ...options })
```

**Build System:**
- Rollup bundler
- Output: ESM + UMD (for CDN usage)
- D3 as peer dependency
- Bundle: smart-labels, force-in-a-box, edge-bundling code, custom forces

**Dependencies:**
- **Peer (external):** `d3@7`
- **Bundled:**
  - `smart-labels` (https://www.npmjs.com/package/smart-labels)
  - `force-in-a-box` (https://www.npmjs.com/package/force-in-a-box)
  - Edge bundling code from https://observablehq.com/@john-guerra/force-edge-bundling
  - Custom forces from https://observablehq.com/d/21d2053b3bc85bce (forceTransport, forceExtent)
  - d3-force-boundary (if available on npm)

### Testing Architecture (Following Observable Plot)

Use a **dual testing strategy**:

**1. Unit Tests** (`test/*-test.js`)
- Framework: Mocha
- Coverage: c8
- Assertions: Low-level API behavior, internals, helper methods
- Run in watch mode during development: `npm test -- --watch`
- Located in `test/` directory with `-test.js` naming

**2. Snapshot Tests** (`test/plots/*.js`)
- Actual rendered visualizations
- Representative of real-world usage
- Must be deterministic and reproducible
- Use vega-datasets for test data (e.g., miserables.json)
- Located in `test/plots/` directory

**Test Organization:**
```
test/
├── forceGraph-test.js      # Core API tests
├── renderers-test.js       # Canvas/SVG renderer tests
├── forces-test.js          # Custom forces tests
├── utils-test.js           # Helper utilities tests
└── plots/
    ├── basic-graph.js      # Simple graph rendering
    ├── canvas-render.js    # Canvas mode
    ├── svg-render.js       # SVG mode
    ├── edge-bundling.js    # Edge bundling feature
    └── force-in-a-box.js   # Grouping layout
```

**Test Commands:**
```sh
npm test              # Run all tests
npm run test:coverage # Generate coverage report
npm run test:lint     # Run ESLint
npm run test:format   # Check Prettier formatting
```

**Test Data:**
- Load from vega-datasets: `https://raw.githubusercontent.com/vega/vega-datasets/master/data/miserables.json`
- All tests must be deterministic (no live data, external servers, current time, etc.)

### Project Structure

```
netviz/
├── src/
│   ├── index.js              # Main entry, exports forceGraph
│   ├── forceGraph.js         # Core function
│   ├── renderers/
│   │   ├── renderCanvas.js   # Canvas renderer
│   │   └── renderSVG.js      # SVG renderer
│   ├── forces/
│   │   ├── forceTransport.js # Custom boundary force
│   │   ├── forceExtent.js    # Custom extent force
│   │   └── edgeBundling.js   # Edge bundling implementation
│   ├── utils/
│   │   ├── computeAutoFit.js
│   │   ├── drag.js
│   │   ├── applyTransform.js
│   │   ├── sample.js
│   │   └── filterNetwork.js
│   └── defaults.js           # Default options
├── test/
│   ├── forceGraph-test.js
│   └── plots/
│       └── basic-graph.js
├── examples/
│   └── basic.html
├── package.json
├── rollup.config.js
└── README.md
```

### Observable Notebook Source Files to Extract

**Main Module:** `89207a2280891f15@1859.js`
- Core `ForceGraph` function (lines 230-488)
- `renderCanvas` function (lines 490-651)
- `renderSVG` function (lines 653-821)
- `defaultOpts` configuration (lines 125-223)
- Utility functions: `drag`, `applyTransform`, `computeAutoFit`, `sample`, `filterNetwork`

**Edge Bundling:** `67def5cb48f2f6c4@205.js`
- From https://observablehq.com/@john-guerra/force-edge-bundling
- Extract `edgeBundling` function and dependencies

**Custom Forces:** `21d2053b3bc85bce@1299.js`
- From https://observablehq.com/d/21d2053b3bc85bce
- Extract `forceTransport` and `forceExtent` functions

### Key Migration Tasks

1. Extract Observable notebook code and remove Observable Runtime dependencies
2. Adapt to reactive widgets pattern (return HTML Element with .value and input events)
3. Auto-handle Observable-specific options: `invalidation`, `_this`
4. Set up Rollup for ESM + UMD builds
5. Replace FileAttachment with direct data loading in examples
6. Set up Mocha + c8 testing infrastructure
7. Create unit tests and snapshot tests
8. Create basic HTML demo
9. Test in Observable notebook for backward compatibility

### TODOs for Future

- [ ] Publish `@john-guerra/force-edge-bundling` as separate package
- [ ] Implement selection behavior (value property with selected nodes/edges)
- [ ] Create React example
- [ ] Create Svelte example
