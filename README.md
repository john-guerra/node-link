# netviz

A **network visualization library** providing multiple layout algorithms and rendering modes. Create interactive, publication-quality network visualizations with a simple, reactive API.

Currently includes force-directed graphs with SVG and Canvas rendering, edge bundling, grouping layouts, and more visualization idioms coming soon.

Based on the [Observable notebook](https://observablehq.com/@john-guerra/force-directed-graph) and following the [reactive widgets](https://reactivewidgets.org) pattern.

## Installation

```bash
npm install netviz d3
```

## Quick Start

```javascript
import { ForceGraph } from "netviz";

const data = {
  nodes: [
    { id: "A", group: 1 },
    { id: "B", group: 1 },
    { id: "C", group: 2 }
  ],
  links: [
    { source: "A", target: "B", value: 1 },
    { source: "B", target: "C", value: 2 }
  ]
};

const graph = ForceGraph(data, {
  width: 800,
  height: 600,
  renderer: "svg" // or "canvas"
});

document.body.appendChild(graph);
```

**Alternative:** Use the `NodeLink` alias for semantic clarity:
```javascript
import { NodeLink } from "netviz";
const graph = NodeLink(data, options);
```

## Visualization Idioms

### Force-Directed Graphs (Node-Link Diagrams)
- **Dual Rendering**: Both SVG and Canvas with same API
- **Edge Bundling**: Optional force-based edge bundling
- **Force-in-a-Box**: Grouping layout algorithm
- **Smart Labels**: Voronoi-based label placement with occlusion detection
- **Zoom & Drag**: Interactive controls
- **AutoFit**: Automatic viewport fitting
- **Reactive Widgets**: Compatible with Observable and reactive frameworks
- **Observable Compatible**: Works seamlessly with Observable notebooks

### Coming Soon
Additional network visualization idioms will be added to this library

## Examples

Interactive examples are available in the `examples/` directory, using Les Misérables character co-occurrence data:

- **basic.html** - Simple force-directed graph with SVG/Canvas rendering
- **advanced.html** - Edge bundling, grouping, and advanced features
- **observable-desktop.html** - Observable Desktop / Notebook Kit format
- **observable-framework.md** - Observable Framework format

To run the examples locally:

```bash
npm run serve
# Opens browser at http://localhost:8080/examples
```

Or use any static server:

```bash
npx http-server
# Then navigate to examples/
```

The examples use local data from `examples/data/miserables.json` for faster loading and offline use.

## API

### `ForceGraph(data, options)` / `NodeLink(data, options)`

Creates a force-directed graph visualization. `NodeLink` is an alias for semantic clarity.

**Parameters:**
- `data` - Object with `{nodes, links}`
  - `nodes`: Array of node objects with at least an `id` property
  - `links`: Array of link objects with `source` and `target` properties
- `options` - Configuration object (see Options below)

**Returns:** HTML Element (SVG or Canvas) with additional properties:
- `.value` - Currently selected nodes/edges (TODO)
- `.update(newData, newOptions)` - Update the graph
- `.destroy()` - Cleanup and stop simulation
- `.simulation` - Access to underlying D3 force simulation
- `.nodes` - Array of node objects
- `.links` - Array of link objects

### Key Options

```javascript
{
  // Rendering
  renderer: "canvas",        // "svg" or "canvas"
  width: 800,
  height: 600,

  // Nodes
  nodeId: d => d.id,
  nodeGroup: d => d.group,   // For coloring
  nodeRadius: 5,             // Number or function
  nodeLabel: d => d.id,

  // Links
  linkStrokeWidth: 1.5,      // Number or function
  linkStrokeOpacity: 0.6,

  // Features
  useEdgeBundling: false,
  useForceInABox: false,     // Group nodes by nodeGroup
  useSmartLabels: true,
  useZoom: true,
  autoFit: true,

  // Observable compatibility
  invalidation: promise,     // Auto-cleanup on promise resolution
  _this: previousGraph       // Preserve state
}
```

See `src/defaults.js` for all 100+ available options.

### Observable Usage

```javascript
// In an Observable notebook
{
  const graph = ForceGraph(data, {
    width,
    invalidation  // Auto-cleanup when cell re-runs
  });
  return graph;
}
```

### Programmatic Updates

```javascript
// Update with new data (preserves positions)
graph.update(newData, { renderer: "svg" });

// Cleanup
graph.destroy();
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Run tests
npm test

# Lint and format
npm run test:lint
npm run format

# Serve examples
npm run serve
```

## Attribution

This library bundles code from several sources:

- **Edge Bundling**: Based on [d3.ForceBundle](https://github.com/upphiminn/d3.ForceBundle) (GPL v2)
- **Custom Forces**: From Observable notebook [21d2053b3bc85bce](https://observablehq.com/d/21d2053b3bc85bce)
- **Smart Labels**: Uses [smart-labels](https://www.npmjs.com/package/smart-labels)
- **Force-in-a-Box**: Uses [force-in-a-box](https://www.npmjs.com/package/force-in-a-box)

## License

ISC License - see LICENSE file for details

## Author

[John Alexis Guerra Gómez](https://johnguerra.co)

## Links

- [Observable Notebook](https://observablehq.com/@john-guerra/force-directed-graph)
- [GitHub Repository](https://github.com/john-guerra/node-link)
- [NPM Package](https://www.npmjs.com/package/netviz)
