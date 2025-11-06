# netviz in Observable Framework

This page demonstrates using the **netviz** library in Observable Framework to create interactive force-directed graph visualizations.

netviz is a network visualization library providing multiple layout algorithms and rendering modes.

```js
// Import netviz and D3
import {ForceGraph, NodeLink} from "npm:netviz";
import * as d3 from "npm:d3";
```

## Load Data

We'll use the Les Misérables character co-occurrence dataset:

```js
const data = await FileAttachment("data/miserables.json").json();
```

## Basic Force-Directed Graph

Create a simple force-directed graph using Canvas rendering:

```js
const basicGraph = ForceGraph(data, {
  width,
  height: 600,
  renderer: "canvas",
  nodeId: d => d.id,
  nodeGroup: d => d.group,
  nodeLabel: d => d.id,
  nodeRadius: 5,
  linkStrokeWidth: l => Math.sqrt(l.value)
});

display(basicGraph);
```

## SVG Rendering with Smart Labels

Switch to SVG rendering and enable smart labels for better readability:

```js
const svgGraph = ForceGraph(data, {
  width,
  height: 600,
  renderer: "svg",
  nodeId: d => d.id,
  nodeGroup: d => d.group,
  nodeLabel: d => d.id,
  nodeRadius: 6,
  linkStrokeWidth: l => Math.sqrt(l.value),
  useSmartLabels: true
});

display(svgGraph);
```

## Advanced Features

Enable edge bundling and Force-in-a-Box for grouped layouts:

```js
const advancedGraph = ForceGraph(data, {
  width,
  height: 600,
  renderer: "svg",
  nodeId: d => d.id,
  nodeGroup: d => d.group,
  nodeLabel: d => d.id,
  nodeRadius: 6,
  linkStrokeWidth: l => Math.sqrt(l.value),
  useEdgeBundling: true,
  useForceInABox: true,
  useSmartLabels: true,
  edgeBundling: {
    compatibility_threshold: 0.3,
    bundling_stiffness: 0.1
  },
  forceInABox: {
    template: "treemap",
    strength: 0.1
  }
});

display(advancedGraph);
```

## Interactive Controls

Add UI controls to toggle features dynamically:

```js
const edgeBundling = view(Inputs.toggle({label: "Edge Bundling", value: false}));
const forceInABox = view(Inputs.toggle({label: "Force-in-a-Box", value: false}));
const smartLabels = view(Inputs.toggle({label: "Smart Labels", value: true}));
```

```js
const interactiveGraph = ForceGraph(data, {
  width,
  height: 600,
  renderer: "svg",
  nodeId: d => d.id,
  nodeGroup: d => d.group,
  nodeLabel: d => d.id,
  nodeRadius: 6,
  linkStrokeWidth: l => Math.sqrt(l.value),
  useEdgeBundling: edgeBundling,
  useForceInABox: forceInABox,
  useSmartLabels: smartLabels
});

display(interactiveGraph);
```

## Alternative: NodeLink Alias

You can also use the `NodeLink` alias for semantic clarity:

```js
const nodeLinkGraph = NodeLink(data, {
  width,
  height: 600,
  renderer: "canvas",
  nodeId: d => d.id,
  nodeGroup: d => d.group,
  nodeRadius: 5
});

display(nodeLinkGraph);
```

## API Options

All configuration options are available in the [netviz documentation](https://github.com/john-guerra/node-link#api).

---

**Learn more:**
- [netviz on npm](https://www.npmjs.com/package/netviz)
- [GitHub Repository](https://github.com/john-guerra/node-link)
- [Observable Notebook](https://observablehq.com/@john-guerra/force-directed-graph)
- [Observable Framework Documentation](https://observablehq.com/framework/)
