# Parameter Examples & Documentation

Interactive examples and documentation for all netviz parameters.

## 🎮 Interactive Playground

**[Launch Playground →](index.html)**

Explore all 110+ configuration options with live previews and copy-paste ready code.

## 📚 Documentation

### By Category

1. **[Rendering](index.html#rendering)** - Canvas/SVG, size, performance
2. **[Nodes](nodes.html)** - Appearance, sizing, labels (13 parameters)
3. **[Links](index.html#links)** - Stroke, opacity, distance (8 parameters)
4. **[Forces](index.html#forces)** - Simulation physics (11 parameters)
5. **[Interaction](index.html#interaction)** - Zoom, pan, drag (3 parameters)
6. **[Layout](index.html#layout)** - Auto-fit, aspect ratio (3 parameters)
7. **[Edge Bundling](index.html#advanced)** - Bundle edges for clarity (10 parameters)
8. **[Force-in-a-Box](index.html#advanced)** - Group nodes spatially (8 parameters)
9. **[Smart Labels](index.html#advanced)** - Intelligent label placement (14 parameters)
10. **[Boundaries](index.html#boundaries)** - Constrain nodes (4 parameters)
11. **[Colors](index.html#colors)** - Color schemes (3 parameters)
12. **[Advanced](index.html#advanced)** - Observable integration, debugging (5 parameters)

### Complete Reference

**[API Reference →](../../docs/API_REFERENCE.md)**

Comprehensive table of all parameters with types, defaults, and examples.

## 🎯 Quick Examples

### Basic Graph

```javascript
import { ForceGraph } from "netviz";

const graph = ForceGraph(data, {
  width: 800,
  height: 600,
  nodeRadius: 5,
  nodeGroup: d => d.category
});

document.body.appendChild(graph);
```

### High Performance (Large Graphs)

```javascript
ForceGraph(data, {
  renderer: "canvas",
  drawLinksWhenAlphaIs: 0.5,
  useSmartLabels: false,
  collideIterations: 2
});
```

### Publication Quality

```javascript
ForceGraph(data, {
  renderer: "svg",
  nodeRadius: 8,
  nodeStrokeWidth: 2,
  useSmartLabels: true,
  useEdgeBundling: true
});
```

### Community Visualization

```javascript
ForceGraph(data, {
  nodeGroup: d => d.community,
  useForceInABox: true,
  forceInABox: {
    template: "treemap",
    strength: 0.15
  }
});
```

## 📖 Parameter Categories

### Most Commonly Used (80% of use cases)

- `width`, `height` - Canvas size
- `renderer` - "svg" or "canvas"
- `nodeRadius` - Node size
- `nodeGroup` - Color by category
- `nodeLabel` - Show labels
- `linkStrokeWidth` - Link thickness
- `useZoom` - Enable interaction

### Performance Tuning

- `drawLinksWhenAlphaIs` - Defer link rendering
- `collideIterations` - Collision detection speed
- `useSmartLabels` - Label computation cost
- `useEdgeBundling` - Edge bundling (expensive)

### Visual Polish

- `nodeStrokeWidth` - Node borders
- `linkStrokeOpacity` - Link transparency
- `useSmartLabels` - Intelligent labels
- `autoFit` - Keep nodes in view
- `colors` - Color palette

### Advanced Features

- `useEdgeBundling` - Bundle edges
- `useForceInABox` - Spatial grouping
- `extent` - Boundary constraints
- `forces` - Custom physics

## 🚀 Getting Started

1. **[Try the Playground](index.html)** - Interactive experimentation
2. **[Read the API Reference](../../docs/API_REFERENCE.md)** - Complete parameter list
3. **[View Examples](../index.html)** - Real-world usage patterns
4. **[Check TypeScript Types](../../index.d.ts)** - Type definitions

## 💡 Tips

- Start with defaults, adjust incrementally
- Use `renderer: "canvas"` for >1000 nodes
- Enable `drawLinksWhenAlphaIs` for large graphs
- `useSmartLabels` works best with medium-sized graphs
- `useEdgeBundling` is slow but beautiful
- `useForceInABox` requires `nodeGroup` to be set

## 🔗 Links

- [Main Documentation](../../README.md)
- [GitHub Repository](https://github.com/john-guerra/node-link)
- [NPM Package](https://www.npmjs.com/package/netviz)
