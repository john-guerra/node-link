import * as d3 from "d3";

/**
 * Default options for forceGraph
 *
 * Original source: https://observablehq.com/@john-guerra/force-directed-graph
 * From 89207a2280891f15@1859.js lines 125-223
 *
 * @param {Object} userOpts - User-provided options to merge
 * @returns {Object} Complete options object with defaults
 */
export function getDefaultOpts(userOpts = {}) {
  const { width = 800, height = 600, invalidation = null } = userOpts;

  return {
    nodeId: (d) => d?.id, // given d in nodes, returns a unique identifier (string)
    nodeGroup: undefined, // given d in nodes, returns an (ordinal) value for color
    nodeGroups: undefined, // an array of ordinal values representing the node groups
    nodeFill: "currentColor", // node stroke fill (if not using a group color encoding)
    nodeStroke: () => "#fff", // node stroke color
    nodeStrokeWidth: 1.5, // node stroke width, in pixels
    nodeStrokeOpacity: 1, // node stroke opacity
    nodeRadius: 3, // node radius, in pixels or a function
    nodeLabel: undefined, // given d in nodes, a title string
    nodeLabelFill: "#333", // node legend color
    nodeLabelStroke: null, // node legend stroke color
    nodeLabelTextAlign: "center", // node legend align used in canvas
    nodeLabelTextAnchor: "middle", // used in svg
    nodeLabelFont: "8pt sans-serif",
    nodeLabelDy: -8, // label dy distance to node center
    nodeLabelDx: 0, // label dx distance to node center
    nodeStrength: undefined, // nodeCharge strength
    linkSource: undefined, // given d in links, returns a node identifier string
    linkTarget: undefined, // given d in links, returns a node identifier string
    linkStroke: "#999", // link stroke color
    linkStrokeOpacity: 0.6, // link stroke opacity
    linkStrokeWidth: 1.5, // given d in links, returns a stroke width in pixels
    linkStrokeLinecap: "round", // link stroke linecap
    linkStrength: undefined,
    linkDistance: 10,
    linkCurve: d3.curveBasis,
    colors: d3.schemeTableau10, // an array of color strings, for the node groups
    color: null, // you can provide your own custom d3.scaleOrdinal color scale
    width, // outer width, in pixels
    height, // outer height, in pixels
    invalidation, // when this promise resolves, stop the simulation
    renderer: "canvas", // either "svg" or "canvas"
    drawLinksWhenAlphaIs: null, // if set to a number [0,1] will only draw links if alpha is below this number
    _this: undefined,
    extent: null, // set to [[0, 0], [width, height]] for a border to avoid nodes leaving the canvas
    extentForce: "forceBoundary", // one of ["forceBoundary", "forceTransport", "forceExtent"]
    extentBorder: 20, // Size of the border
    extentStrength: 0.1, // Strength of the border
    simulationRestartAlpha: 1, // What alpha to set when redrawing
    forceXStrength: undefined, // if not provided will try to fit in the width height
    forceYStrength: undefined, // if not provided will try to fit in the width height
    centeringStrength: 0.01,
    collide: true,
    collidePadding: 1,
    collideIterations: 4,
    forces: null, // You can pass your own forces using an object {"forceName": d3.forceManyBody()}
    disjoint: true, // Set to false if your network is heavily connected
    useEdgeBundling: false, // true to use edge bundling
    edgeBundling: {
      bundling_stiffness: 0.1, // global bundling constant controlling edge stiffness
      step_size: 0.1, // init. distance to move points
      subdivision_rate: 2, // subdivision rate increase
      cycles: 2, // number of cycles to perform
      iterations: 90, // init. number of iterations for cycle
      iterations_rate: 0.6666667, // rate at which iteration number decreases i.e. 2/3
      compatibility_threshold: 0.2, // which pairs of edges should be considered compatible
      max_links: 1000, // If your network is large, edgebundling will only apply to these many links
      min_alpha_to_bundle: 0.6,
    },
    useForceInABox: false, // will group by nodeGroup
    forceInABox: {
      template: "force", // Either treemap or force
      strength: 0.3, // Strength to foci
      linkStrengthInterCluster: 0.001, // linkStrength between nodes of different clusters
      linkStrengthIntraCluster: 0.1, // linkStrength between nodes of the same cluster
      forceLinkDistance: 100, // linkDistance between meta-nodes on the template (Force template only)
      forceLinkStrength: 0.1, // linkStrength between meta-nodes of the template (Force template only)
      forceCharge: -1, // Charge between the meta-nodes (Force template only)
      forceNodeSize: 10, // Used to compute the template force nodes size (Force template only)
    },
    useZoom: true,
    zoomScaleExtent: [0.1, 20],
    minDistanceForDrag: 10,
    autoFit: true, // keep nodes in view using scales
    keepAspectRatio: false,
    useSmartLabels: true,
    smartLabels: {
      stroke: "white", // label stroke color
      threshold: 2000, // Areas over this size would get labels
      font: (_d) => "8pt sans-serif",
      hover: true, // Show label of the hovered point
      onHover: (i) => i, // callback when hovered, will pass the index of the selected element
      hoverFont: (_d) => "bolder 8pt sans-serif",
      labelsInCentroids: false,
      backgroundFill: "#fefefe01", // What to paint the bg rect of the labels
      strokeWidth: 5,
      showVoronoi: false,
      voronoiStroke: "#ccc",
      showAnchors: false,
      anchorsStroke: "orange",
      anchorsFill: "none",
      useOcclusion: true,
      occludedStyle: "opacity: 0.2", // css style rules to be used on occluded labels
    },
    alphaTarget: 0,
    debug: false,
  };
}
