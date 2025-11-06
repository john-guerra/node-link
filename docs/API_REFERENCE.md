# netviz API Reference

Complete reference for all 110+ configuration parameters in netviz.

**Interactive Examples:** [Parameter Playground](../examples/parameters/index.html)

---

## Table of Contents

- [Rendering](#rendering)
- [Nodes](#nodes)
- [Links](#links)
- [Forces & Simulation](#forces--simulation)
- [Layout](#layout)
- [Interaction](#interaction)
- [Edge Bundling](#edge-bundling)
- [Force-in-a-Box](#force-in-a-box)
- [Smart Labels](#smart-labels)
- [Boundaries](#boundaries)
- [Colors](#colors)
- [Advanced](#advanced)

---

## Rendering

Parameters controlling the rendering mode and canvas size.

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `renderer` | `"svg"` \| `"canvas"` | `"canvas"` | Rendering mode. SVG provides better quality and accessibility, Canvas is faster for large graphs. | [Try it](../examples/parameters/index.html) |
| `width` | `number` | `800` | Width of the visualization in pixels | `width: 1200` |
| `height` | `number` | `600` | Height of the visualization in pixels | `height: 800` |
| `drawLinksWhenAlphaIs` | `number` \| `null` | `null` | If set, only draws links when simulation alpha drops below this value. Improves performance for large graphs during initial layout. | `drawLinksWhenAlphaIs: 0.5` |

**Related:** See [Canvas vs SVG comparison](../examples/parameters/rendering.html)

---

## Nodes

Parameters for node appearance, sizing, and labeling.

### Node Identity & Grouping

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `nodeId` | `function` | `(d) => d?.id` | Function returning unique identifier for each node | `nodeId: d => d.name` |
| `nodeGroup` | `function` \| `undefined` | `undefined` | Function returning group/category for coloring nodes | `nodeGroup: d => d.category` |
| `nodeGroups` | `array` \| `undefined` | `undefined` | Array of ordinal values for node groups (auto-computed if not provided) | `nodeGroups: ["A", "B", "C"]` |

[**Interactive Example →**](../examples/parameters/nodes.html#nodeGroup)

### Node Appearance

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `nodeRadius` | `number` \| `function` | `3` | Node radius in pixels. Can be fixed or dynamic based on node properties | `nodeRadius: 5` or `nodeRadius: d => d.degree * 2` |
| `nodeFill` | `string` | `"currentColor"` | Default node fill color (used when not using group coloring) | `nodeFill: "#3498db"` |
| `nodeStroke` | `string` \| `function` | `() => "#fff"` | Node stroke (outline) color | `nodeStroke: "#000"` |
| `nodeStrokeWidth` | `number` | `1.5` | Node stroke width in pixels | `nodeStrokeWidth: 2` |
| `nodeStrokeOpacity` | `number` | `1` | Node stroke opacity (0-1) | `nodeStrokeOpacity: 0.8` |

[**Interactive Example →**](../examples/parameters/nodes.html#nodeRadius)

### Node Labels

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `nodeLabel` | `function` \| `undefined` | `undefined` | Function returning label text for each node | `nodeLabel: d => d.name` |
| `nodeLabelFill` | `string` | `"#333"` | Label text color | `nodeLabelFill: "#000"` |
| `nodeLabelStroke` | `string` \| `null` | `null` | Label text stroke color (outline) | `nodeLabelStroke: "#fff"` |
| `nodeLabelTextAlign` | `string` | `"center"` | Text alignment for Canvas rendering | `nodeLabelTextAlign: "left"` |
| `nodeLabelTextAnchor` | `string` | `"middle"` | Text anchor for SVG rendering | `nodeLabelTextAnchor: "start"` |
| `nodeLabelFont` | `string` | `"8pt sans-serif"` | Font specification for labels | `nodeLabelFont: "12pt Arial"` |
| `nodeLabelDx` | `number` | `0` | Label horizontal offset from node center | `nodeLabelDx: 10` |
| `nodeLabelDy` | `number` | `-8` | Label vertical offset from node center | `nodeLabelDy: -12` |

[**Interactive Example →**](../examples/parameters/nodes.html#nodeLabel)

---

## Links

Parameters for link/edge appearance and behavior.

### Link Identity

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `linkSource` | `function` \| `undefined` | `undefined` | Function returning source node identifier from link | `linkSource: d => d.from` |
| `linkTarget` | `function` \| `undefined` | `undefined` | Function returning target node identifier from link | `linkTarget: d => d.to` |

### Link Appearance

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `linkStroke` | `string` \| `function` | `"#999"` | Link stroke color. Can be fixed or function | `linkStroke: "#ccc"` or `linkStroke: d => colorScale(d.type)` |
| `linkStrokeOpacity` | `number` \| `function` | `0.6` | Link stroke opacity (0-1) | `linkStrokeOpacity: 0.3` |
| `linkStrokeWidth` | `number` \| `function` | `1.5` | Link stroke width in pixels | `linkStrokeWidth: d => d.weight` |
| `linkStrokeLinecap` | `string` | `"round"` | Line cap style (`"butt"`, `"round"`, `"square"`) | `linkStrokeLinecap: "butt"` |
| `linkCurve` | `function` | `d3.curveBasis` | D3 curve function for link paths | `linkCurve: d3.curveLinear` |

### Link Forces

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `linkStrength` | `number` \| `function` \| `undefined` | `undefined` | Strength of link force (0-1). Higher = links pull nodes closer | `linkStrength: 0.5` |
| `linkDistance` | `number` \| `function` | `10` | Target distance between linked nodes | `linkDistance: 50` or `linkDistance: d => d.distance` |

[**Interactive Example →**](../examples/parameters/links.html)

---

## Forces & Simulation

Parameters controlling the physics simulation.

### Force Strengths

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `nodeStrength` | `number` \| `function` \| `undefined` | `undefined` | Many-body (charge) force strength. Negative = repulsion | `nodeStrength: -100` |
| `forceXStrength` | `number` \| `undefined` | `undefined` | X-axis centering force strength (auto-computed if not set) | `forceXStrength: 0.05` |
| `forceYStrength` | `number` \| `undefined` | `undefined` | Y-axis centering force strength (auto-computed if not set) | `forceYStrength: 0.05` |
| `centeringStrength` | `number` | `0.01` | Base strength for centering forces | `centeringStrength: 0.02` |

### Collision Detection

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `collide` | `boolean` | `true` | Enable collision detection to prevent node overlap | `collide: false` |
| `collidePadding` | `number` | `1` | Extra padding around nodes for collision detection | `collidePadding: 2` |
| `collideIterations` | `number` | `4` | Number of collision iterations per tick | `collideIterations: 2` |

### Simulation Control

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `simulationRestartAlpha` | `number` | `1` | Alpha value when restarting simulation on update | `simulationRestartAlpha: 0.5` |
| `alphaTarget` | `number` | `0` | Target alpha for the simulation (0 = stops) | `alphaTarget: 0.1` |
| `forces` | `object` \| `null` | `null` | Custom D3 forces object. Allows full control over simulation | `forces: { "customForce": d3.forceX() }` |
| `disjoint` | `boolean` | `true` | Optimize for disconnected components vs single connected graph | `disjoint: false` |

[**Interactive Example →**](../examples/parameters/forces.html)

---

## Layout

Parameters for overall layout and positioning.

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `autoFit` | `boolean` | `true` | Automatically scale to keep all nodes in viewport | `autoFit: false` |
| `keepAspectRatio` | `boolean` | `false` | Maintain aspect ratio when auto-fitting | `keepAspectRatio: true` |

[**Interactive Example →**](../examples/parameters/layout.html)

---

## Interaction

Parameters for zoom, pan, and drag interactions.

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `useZoom` | `boolean` | `true` | Enable zoom and pan interactions | `useZoom: false` |
| `zoomScaleExtent` | `[number, number]` | `[0.1, 20]` | Min and max zoom levels | `zoomScaleExtent: [0.5, 10]` |
| `minDistanceForDrag` | `number` | `10` | Minimum distance in pixels before drag starts | `minDistanceForDrag: 5` |

[**Interactive Example →**](../examples/parameters/interaction.html)

---

## Edge Bundling

Parameters for force-based edge bundling (reduces visual clutter).

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `useEdgeBundling` | `boolean` | `false` | Enable edge bundling (slow on large graphs) | `useEdgeBundling: true` |

### Edge Bundling Options (`edgeBundling` object)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `bundling_stiffness` | `number` | `0.1` | Global bundling constant controlling edge stiffness |
| `step_size` | `number` | `0.1` | Initial distance to move points |
| `subdivision_rate` | `number` | `2` | Subdivision rate increase |
| `cycles` | `number` | `2` | Number of cycles to perform |
| `iterations` | `number` | `90` | Initial number of iterations for cycle |
| `iterations_rate` | `number` | `0.6666667` | Rate at which iteration number decreases |
| `compatibility_threshold` | `number` | `0.2` | Which pairs of edges should be considered compatible (0-1) |
| `max_links` | `number` | `1000` | Maximum number of links to bundle (performance limit) |
| `min_alpha_to_bundle` | `number` | `0.6` | Minimum simulation alpha to start bundling |

**Usage:**
```javascript
ForceGraph(data, {
  useEdgeBundling: true,
  edgeBundling: {
    compatibility_threshold: 0.3,
    bundling_stiffness: 0.15
  }
})
```

[**Interactive Example →**](../examples/parameters/edge-bundling.html)

---

## Force-in-a-Box

Parameters for Force-in-a-Box grouping layout (groups nodes by category).

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `useForceInABox` | `boolean` | `false` | Enable Force-in-a-Box grouping (requires `nodeGroup`) | `useForceInABox: true` |

### Force-in-a-Box Options (`forceInABox` object)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `template` | `"force"` \| `"treemap"` | `"force"` | Layout template for group positioning |
| `strength` | `number` | `0.3` | Strength to foci (how strongly nodes are pulled to group centers) |
| `linkStrengthInterCluster` | `number` | `0.001` | Link strength between nodes of different clusters |
| `linkStrengthIntraCluster` | `number` | `0.1` | Link strength between nodes of the same cluster |
| `forceLinkDistance` | `number` | `100` | Link distance between meta-nodes (Force template only) |
| `forceLinkStrength` | `number` | `0.1` | Link strength between meta-nodes (Force template only) |
| `forceCharge` | `number` | `-1` | Charge between meta-nodes (Force template only) |
| `forceNodeSize` | `number` | `10` | Meta-node size computation (Force template only) |

**Usage:**
```javascript
ForceGraph(data, {
  nodeGroup: d => d.category,
  useForceInABox: true,
  forceInABox: {
    template: "treemap",
    strength: 0.1
  }
})
```

[**Interactive Example →**](../examples/parameters/force-in-a-box.html)

---

## Smart Labels

Parameters for intelligent Voronoi-based label placement.

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `useSmartLabels` | `boolean` | `true` | Enable smart label placement with occlusion detection | `useSmartLabels: false` |

### Smart Labels Options (`smartLabels` object)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `stroke` | `string` | `"white"` | Label stroke (outline) color |
| `threshold` | `number` | `2000` | Minimum Voronoi cell area for showing label |
| `font` | `string` \| `function` | `"8pt sans-serif"` | Font specification |
| `hover` | `boolean` | `true` | Show label on hover |
| `onHover` | `function` | `(i) => i` | Callback when hovered (receives node index) |
| `hoverFont` | `string` \| `function` | `"bolder 8pt sans-serif"` | Font for hovered labels |
| `labelsInCentroids` | `boolean` | `false` | Position labels at Voronoi cell centroids |
| `backgroundFill` | `string` | `"#fefefe01"` | Background fill for label rectangles |
| `strokeWidth` | `number` | `5` | Stroke width for label text |
| `showVoronoi` | `boolean` | `false` | Show Voronoi diagram (debugging) |
| `voronoiStroke` | `string` | `"#ccc"` | Voronoi cell stroke color |
| `showAnchors` | `boolean` | `false` | Show label anchor points (debugging) |
| `anchorsStroke` | `string` | `"orange"` | Anchor point stroke color |
| `anchorsFill` | `string` | `"none"` | Anchor point fill color |
| `useOcclusion` | `boolean` | `true` | Enable occlusion detection for labels |
| `occludedStyle` | `string` | `"opacity: 0.2"` | CSS style for occluded labels |

**Usage:**
```javascript
ForceGraph(data, {
  nodeLabel: d => d.name,
  useSmartLabels: true,
  smartLabels: {
    threshold: 3000,
    font: "10pt Arial",
    hover: true
  }
})
```

[**Interactive Example →**](../examples/parameters/smart-labels.html)

---

## Boundaries

Parameters for constraining nodes within boundaries.

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `extent` | `[[number, number], [number, number]]` \| `null` | `null` | Boundary box `[[x0, y0], [x1, y1]]` to constrain nodes | `extent: [[0, 0], [800, 600]]` |
| `extentForce` | `"forceBoundary"` \| `"forceTransport"` \| `"forceExtent"` | `"forceBoundary"` | Type of boundary force to use | `extentForce: "forceTransport"` |
| `extentBorder` | `number` | `20` | Size of the border/padding from extent edges | `extentBorder: 50` |
| `extentStrength` | `number` | `0.1` | Strength of the boundary force | `extentStrength: 0.2` |

**Boundary Force Types:**
- `forceBoundary`: Hard boundary (d3-force-boundary)
- `forceTransport`: Smooth transport back to boundary
- `forceExtent`: Clamping force

[**Interactive Example →**](../examples/parameters/boundaries.html)

---

## Colors

Parameters for color schemes and node coloring.

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `colors` | `string[]` | `d3.schemeTableau10` | Array of colors for node groups | `colors: ["#red", "#blue", "#green"]` |
| `color` | `d3.ScaleOrdinal` \| `null` | `null` | Custom D3 ordinal color scale (overrides `colors`) | `color: d3.scaleOrdinal().domain(groups).range(colors)` |

**Available D3 Color Schemes:**
- `d3.schemeTableau10` (default)
- `d3.schemeCategory10`
- `d3.schemeAccent`
- `d3.schemePastel1`
- And many more...

[**Interactive Example →**](../examples/parameters/colors.html)

---

## Advanced

Advanced parameters for Observable integration and debugging.

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `invalidation` | `Promise` \| `null` | `null` | Observable notebook integration: stops simulation when promise resolves | `invalidation: invalidation` |
| `_this` | `HTMLElement` \| `undefined` | `undefined` | Reuse previous graph element (preserves positions on update) | Internal use only |
| `debug` | `boolean` | `false` | Enable debug mode (logs additional information) | `debug: true` |

[**Interactive Example →**](../examples/parameters/advanced.html)

---

## TypeScript Types

Full TypeScript definitions are available in [`index.d.ts`](../index.d.ts). Import them as:

```typescript
import {
  ForceGraph,
  ForceGraphOptions,
  GraphData,
  Node,
  Link
} from "netviz";
```

---

## Examples by Use Case

### Performance Optimization (Large Graphs)

```javascript
ForceGraph(data, {
  renderer: "canvas",           // Canvas is faster
  drawLinksWhenAlphaIs: 0.5,   // Defer link drawing
  useSmartLabels: false,        // Disable labels for speed
  useEdgeBundling: false,       // Edge bundling is slow
  collideIterations: 2          // Reduce collision iterations
})
```

### High Quality Visualization

```javascript
ForceGraph(data, {
  renderer: "svg",              // SVG for quality
  nodeRadius: 8,                // Larger nodes
  nodeStrokeWidth: 2,           // Prominent borders
  linkStrokeOpacity: 0.4,       // Subtle links
  useSmartLabels: true,         // Intelligent labels
  useEdgeBundling: true,        // Cleaner edge display
})
```

### Community Visualization

```javascript
ForceGraph(data, {
  nodeGroup: d => d.community,  // Color by community
  useForceInABox: true,         // Group spatially
  forceInABox: {
    template: "treemap",
    strength: 0.15
  }
})
```

---

## See Also

- [Main Documentation](../README.md)
- [Interactive Playground](../examples/parameters/index.html)
- [TypeScript Definitions](../index.d.ts)
- [Examples Gallery](../examples/)
