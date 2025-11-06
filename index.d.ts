// Type definitions for netviz
// Project: https://github.com/john-guerra/node-link
// Definitions by: Claude Code <https://claude.ai>

import * as d3 from "d3";

/**
 * Node data structure
 */
export interface Node {
  id: string | number;
  [key: string]: any;
}

/**
 * Link data structure
 * Links can reference nodes by ID (string/number), by object reference, or by array index
 */
export interface Link {
  source: string | number | Node;
  target: string | number | Node;
  [key: string]: any;
}

/**
 * Graph data structure
 */
export interface GraphData {
  nodes: Node[];
  links: Link[];
}

/**
 * Edge bundling configuration options
 */
export interface EdgeBundlingOptions {
  /** Global bundling constant controlling edge stiffness */
  bundling_stiffness?: number;
  /** Initial distance to move points */
  step_size?: number;
  /** Subdivision rate increase */
  subdivision_rate?: number;
  /** Number of cycles to perform */
  cycles?: number;
  /** Initial number of iterations for cycle */
  iterations?: number;
  /** Rate at which iteration number decreases (e.g., 2/3) */
  iterations_rate?: number;
  /** Which pairs of edges should be considered compatible */
  compatibility_threshold?: number;
  /** If your network is large, edge bundling will only apply to these many links */
  max_links?: number;
  /** Minimum alpha value to start bundling */
  min_alpha_to_bundle?: number;
}

/**
 * Force-in-a-Box configuration options
 */
export interface ForceInABoxOptions {
  /** Layout template: "treemap" or "force" */
  template?: "treemap" | "force";
  /** Strength to foci */
  strength?: number;
  /** Link strength between nodes of different clusters */
  linkStrengthInterCluster?: number;
  /** Link strength between nodes of the same cluster */
  linkStrengthIntraCluster?: number;
  /** Link distance between meta-nodes on the template (Force template only) */
  forceLinkDistance?: number;
  /** Link strength between meta-nodes of the template (Force template only) */
  forceLinkStrength?: number;
  /** Charge between the meta-nodes (Force template only) */
  forceCharge?: number;
  /** Used to compute the template force nodes size (Force template only) */
  forceNodeSize?: number;
}

/**
 * Smart labels configuration options
 */
export interface SmartLabelsOptions {
  /** Label stroke color */
  stroke?: string;
  /** Areas over this size would get labels */
  threshold?: number;
  /** Font specification */
  font?: string | ((d: any) => string);
  /** Show label of the hovered point */
  hover?: boolean;
  /** Callback when hovered, will pass the index of the selected element */
  onHover?: (index: number) => any;
  /** Font for hovered labels */
  hoverFont?: string | ((d: any) => string);
  /** Show labels in centroids */
  labelsInCentroids?: boolean;
  /** Background fill for label rectangles */
  backgroundFill?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Show Voronoi diagram */
  showVoronoi?: boolean;
  /** Voronoi diagram stroke color */
  voronoiStroke?: string;
  /** Show anchors */
  showAnchors?: boolean;
  /** Anchors stroke color */
  anchorsStroke?: string;
  /** Anchors fill color */
  anchorsFill?: string;
  /** Use occlusion detection */
  useOcclusion?: boolean;
  /** CSS style rules to be used on occluded labels */
  occludedStyle?: string;
}

/**
 * Configuration options for ForceGraph
 */
export interface ForceGraphOptions {
  // Dimensions
  /** Outer width in pixels */
  width?: number;
  /** Outer height in pixels */
  height?: number;

  // Rendering
  /** Rendering mode: "svg" or "canvas" */
  renderer?: "svg" | "canvas";
  /** Only draw links when simulation alpha is below this value (performance optimization) */
  drawLinksWhenAlphaIs?: number | null;

  // Node styling
  /** Function to extract unique node identifier */
  nodeId?: (node: Node) => string | number;
  /** Function to extract node group for coloring */
  nodeGroup?: (node: Node) => string | number;
  /** Array of ordinal values representing node groups */
  nodeGroups?: (string | number)[];
  /** Node fill color (if not using group color encoding) */
  nodeFill?: string;
  /** Node stroke color */
  nodeStroke?: string | ((node: Node) => string);
  /** Node stroke width in pixels */
  nodeStrokeWidth?: number;
  /** Node stroke opacity */
  nodeStrokeOpacity?: number;
  /** Node radius in pixels or function */
  nodeRadius?: number | ((node: Node) => number);
  /** Node label text */
  nodeLabel?: (node: Node) => string;
  /** Node label fill color */
  nodeLabelFill?: string;
  /** Node label stroke color */
  nodeLabelStroke?: string | null;
  /** Node label text alignment (canvas) */
  nodeLabelTextAlign?: string;
  /** Node label text anchor (SVG) */
  nodeLabelTextAnchor?: string;
  /** Node label font specification */
  nodeLabelFont?: string;
  /** Label vertical distance from node center */
  nodeLabelDy?: number;
  /** Label horizontal distance from node center */
  nodeLabelDx?: number;
  /** Node charge strength */
  nodeStrength?: number;

  // Link styling
  /** Function to extract link source node identifier */
  linkSource?: (link: Link) => string | number | Node;
  /** Function to extract link target node identifier */
  linkTarget?: (link: Link) => string | number | Node;
  /** Link stroke color */
  linkStroke?: string;
  /** Link stroke opacity */
  linkStrokeOpacity?: number;
  /** Link stroke width in pixels or function */
  linkStrokeWidth?: number | ((link: Link) => number);
  /** Link stroke linecap style */
  linkStrokeLinecap?: string;
  /** Link force strength */
  linkStrength?: number | ((link: Link) => number);
  /** Link distance */
  linkDistance?: number | ((link: Link) => number);
  /** D3 curve function for links */
  linkCurve?: d3.CurveFactory;

  // Colors
  /** Array of color strings for node groups */
  colors?: string[];
  /** Custom D3 color scale */
  color?: d3.ScaleOrdinal<string, string> | null;

  // Forces and simulation
  /** Custom forces object */
  forces?: Record<string, d3.Force<any, any>> | null;
  /** Boundary extent [[x0, y0], [x1, y1]] */
  extent?: [[number, number], [number, number]] | null;
  /** Boundary force type: "forceBoundary", "forceTransport", or "forceExtent" */
  extentForce?: "forceBoundary" | "forceTransport" | "forceExtent";
  /** Size of the boundary border */
  extentBorder?: number;
  /** Strength of the boundary force */
  extentStrength?: number;
  /** Alpha value when restarting simulation */
  simulationRestartAlpha?: number;
  /** Force X strength */
  forceXStrength?: number;
  /** Force Y strength */
  forceYStrength?: number;
  /** Centering force strength */
  centeringStrength?: number;
  /** Enable collision detection */
  collide?: boolean;
  /** Collision padding */
  collidePadding?: number;
  /** Collision detection iterations */
  collideIterations?: number;
  /** Set to false if network is heavily connected */
  disjoint?: boolean;
  /** Simulation alpha target */
  alphaTarget?: number;

  // Features
  /** Enable edge bundling */
  useEdgeBundling?: boolean;
  /** Edge bundling configuration */
  edgeBundling?: EdgeBundlingOptions;
  /** Enable Force-in-a-Box grouping (groups by nodeGroup) */
  useForceInABox?: boolean;
  /** Force-in-a-Box configuration */
  forceInABox?: ForceInABoxOptions;
  /** Enable zoom and pan */
  useZoom?: boolean;
  /** Zoom scale extent [min, max] */
  zoomScaleExtent?: [number, number];
  /** Minimum distance for drag to activate */
  minDistanceForDrag?: number;
  /** Auto-fit nodes in viewport */
  autoFit?: boolean;
  /** Keep aspect ratio when auto-fitting */
  keepAspectRatio?: boolean;
  /** Enable smart labels with Voronoi placement */
  useSmartLabels?: boolean;
  /** Smart labels configuration */
  smartLabels?: SmartLabelsOptions;

  // Observable compatibility
  /** Promise that resolves to stop the simulation */
  invalidation?: Promise<void> | null;
  /** Previous graph instance for state preservation */
  _this?: ForceGraphElement;

  // Debug
  /** Enable debug mode */
  debug?: boolean;
}

/**
 * HTML Element returned by ForceGraph with additional methods and properties
 */
export interface ForceGraphElement extends HTMLElement {
  /** Currently selected nodes/edges (TODO: not yet implemented) */
  value: any;

  /** Update the graph with new data or options */
  update(data: GraphData, options?: Partial<ForceGraphOptions>): ForceGraphElement;

  /** Cleanup and stop the simulation */
  destroy(): void;

  /** Access to the underlying D3 force simulation */
  simulation: d3.Simulation<Node, Link>;

  /** Array of node objects */
  nodes: Node[];

  /** Array of link objects */
  links: Link[];

  /** D3 scales used for rendering */
  scales: {
    x: d3.ScaleLinear<number, number>;
    y: d3.ScaleLinear<number, number>;
  };
}

/**
 * Create a force-directed graph visualization
 *
 * @param data - Graph data with nodes and links
 * @param options - Configuration options
 * @returns HTML Element (SVG or Canvas) with additional methods
 *
 * @example
 * ```typescript
 * import { ForceGraph } from "netviz";
 *
 * const data = {
 *   nodes: [
 *     { id: "A", group: 1 },
 *     { id: "B", group: 1 },
 *     { id: "C", group: 2 }
 *   ],
 *   links: [
 *     { source: "A", target: "B" },
 *     { source: "B", target: "C" }
 *   ]
 * };
 *
 * const graph = ForceGraph(data, {
 *   width: 800,
 *   height: 600,
 *   renderer: "svg"
 * });
 *
 * document.body.appendChild(graph);
 *
 * // Update later
 * graph.update(newData);
 *
 * // Cleanup
 * graph.destroy();
 * ```
 */
export function ForceGraph(
  data: GraphData,
  options?: ForceGraphOptions
): ForceGraphElement;

/**
 * Alias for ForceGraph - semantic name for node-link diagrams
 */
export const NodeLink: typeof ForceGraph;

/**
 * Core ForceGraph implementation (advanced usage)
 */
export function ForceGraphCore(
  data: GraphData,
  options?: ForceGraphOptions
): ForceGraphElement;

/**
 * Custom force: Transport nodes within bounds
 */
export function forceTransport(
  extent: [[number, number], [number, number]],
  margin?: number,
  strength?: number
): d3.Force<Node, Link>;

/**
 * Custom force: Clamp nodes to boundaries
 */
export function forceExtent(
  extent: [[number, number], [number, number]],
  strength?: number
): d3.Force<Node, Link>;

/**
 * Edge bundling force class
 */
export class ForceEdgeBundling {
  constructor();
  // Add methods as needed
}

/**
 * Edge bundling convenience function
 */
export function edgeBundling(
  graph: any,
  options?: EdgeBundlingOptions
): void;

/**
 * Filter network data by nodes/links with ego-network support
 */
export function filterNetwork(
  data: GraphData,
  filter: {
    nodes?: (node: Node) => boolean;
    links?: (link: Link) => boolean;
    ego?: {
      node: string | number;
      depth?: number;
    };
  }
): GraphData;
