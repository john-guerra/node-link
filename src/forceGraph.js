import * as d3 from "d3";
import forceInABox from "force-in-a-box";
import forceBoundary from "d3-force-boundary";
import { forceTransport } from "./forces/forceTransport.js";
import { forceExtent } from "./forces/forceExtent.js";
import { edgeBundling } from "./forces/edgeBundling.js";
import { sample } from "./utils/sample.js";
import { drag } from "./utils/drag.js";
import { renderCanvas } from "./renderers/renderCanvas.js";
import { renderSVG } from "./renderers/renderSVG.js";
import { getDefaultOpts } from "./defaults.js";

/**
 * ForceGraph - Core force-directed graph function
 *
 * Original source: https://observablehq.com/@john-guerra/force-directed-graph
 * From 89207a2280891f15@1859.js lines 230-488
 *
 * @param {Object} data - {nodes, links} graph data
 * @param {Object} _opts - User options
 * @returns {HTMLElement} DOM element (SVG or Canvas) with additional properties
 */
export function ForceGraph(
  { nodes, links = [] }, // an iterable of node and link objects
  _opts = {}
) {
  let opts = {
    ...getDefaultOpts(_opts),
    ..._opts,
    edgeBundling: {
      ...getDefaultOpts(_opts).edgeBundling,
      ..._opts.edgeBundling,
    },
    forceInABox: {
      ...getDefaultOpts(_opts).forceInABox,
      ..._opts.forceInABox,
    },
    smartLabels: {
      ...getDefaultOpts(_opts).smartLabels,
      ..._opts.smartLabels,
    },
  };

  if (opts.nodeRadius && typeof opts.nodeRadius !== "function") {
    const numberNodeRadius = opts.nodeRadius;
    opts.nodeRadius = () => numberNodeRadius;
  }
  if (opts.nodeStroke && typeof opts.nodeStroke !== "function") {
    const nodeStroke = opts.nodeStroke;
    opts.nodeStroke = () => nodeStroke;
  }

  // Handle both object references and numeric indices in links
  opts.linkSource =
    opts.linkSource ||
    (({ source }) => {
      // If source is a number, it's an index into the nodes array
      if (typeof source === "number") {
        return opts.nodeId(nodes[source]);
      }
      // If source is an object, get its ID
      return opts.nodeId(source) || source;
    });
  opts.linkTarget =
    opts.linkTarget ||
    (({ target }) => {
      // If target is a number, it's an index into the nodes array
      if (typeof target === "number") {
        return opts.nodeId(nodes[target]);
      }
      // If target is an object, get its ID
      return opts.nodeId(target) || target;
    });

  // Compute values
  const N = d3.map(nodes, opts.nodeId).map(intern);
  const LS = d3.map(links, opts.linkSource).map(intern);
  const LT = d3.map(links, opts.linkTarget).map(intern);
  const T = opts.nodeLabel == null ? null : d3.map(nodes, opts.nodeLabel);
  const R = opts.nodeRadius == null ? null : d3.map(nodes, opts.nodeRadius);
  const G =
    opts.nodeGroup == null ? null : d3.map(nodes, opts.nodeGroup).map(intern);
  const NS =
    opts.nodeStroke == null ? null : d3.map(nodes, opts.nodeStroke).map(intern);
  const W =
    typeof opts.linkStrokeWidth !== "function"
      ? null
      : d3.map(links, opts.linkStrokeWidth);
  const L =
    typeof opts.linkStroke !== "function"
      ? null
      : d3.map(links, opts.linkStroke);
  const LO =
    typeof opts.linkStrokeOpacity !== "function"
      ? null
      : d3.map(links, opts.linkStrokeOpacity);

  opts.x = d3.scaleLinear().domain([0, opts.width]).range([0, opts.width]);
  opts.y = d3.scaleLinear().domain([0, opts.height]).range([0, opts.height]);

  // Copy nodes
  if (opts._this?.nodes) {
    // Make a shallow copy to protect against mutation, while
    // recycling old nodes to preserve position and velocity
    const oldNodes = new Map(opts._this?.nodes.map((d) => [d.id, d]));
    nodes = nodes.map((n, i) =>
      Object.assign(
        oldNodes.get(opts.nodeId(n)) || { ...n, id: N[i], groupBy: G && G[i] }
      )
    );
  } else {
    // Replace the input nodes and links with mutable objects for the simulation
    nodes = d3.map(nodes, (n, i) => ({
      ...n,
      id: N[i],
      groupBy: G && G[i], // we need the groupBy for forceInABox
    }));
  }
  links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));

  // Initialize towards the middle
  for (let n of nodes) {
    const randomFactor = 3; // how far from the center should nodes be initialized
    n.x =
      n.x !== undefined
        ? n.x
        : (Math.random() - 0.5) * (opts.width / randomFactor) + opts.width / 2;
    n.y =
      n.y !== undefined
        ? n.y
        : (Math.random() - 0.5) * (opts.height / randomFactor) +
          opts.height / 2;
  }

  // Compute default domains
  if (G && opts.nodeGroups === undefined) opts.nodeGroups = d3.sort(G);

  // Construct the scales
  const color = opts.color
    ? opts.color
    : opts.nodeGroup == null
    ? null
    : d3.scaleOrdinal(opts.nodeGroups, opts.colors);

  let simulation =
    opts._this?.simulation?.alpha(opts.simulationRestartAlpha)?.restart() ||
    d3.forceSimulation();

  simulation.nodes(nodes);

  if (opts.forces) {
    for (let k in opts.forces) {
      simulation.force(k, opts.forces[k]({ nodes, links }));
    }
  } else {
    // Construct the forces
    const forceNode = d3.forceManyBody();
    const forceLink = d3.forceLink(links).id(({ index: i }) => N[i]);
    if (opts.nodeStrength !== undefined) forceNode.strength(opts.nodeStrength);
    if (opts.linkStrength !== undefined) forceLink.strength(opts.linkStrength);

    if (opts.forceXStrength === undefined) {
      opts.forceXStrength = (opts.height / opts.width) * opts.centeringStrength;
    }
    if (opts.forceYStrength === undefined) {
      opts.forceYStrength = (opts.width / opts.height) * opts.centeringStrength;
    }

    const forceCollide = opts.collide
      ? d3
          .forceCollide((_, i) => R[i] + opts.collidePadding)
          .iterations(opts.collideIterations)
      : null;

    const forceX = d3.forceX(opts.width / 2).strength(opts.forceXStrength);
    const forceY = d3.forceY(opts.height / 2).strength(opts.forceYStrength);

    let groupingForce;
    if (opts.useForceInABox) {
      groupingForce = forceInABox()
        .size([opts.width, opts.height - 100])
        .template(opts.forceInABox.template)
        .groupBy("groupBy")
        .strength(opts.forceInABox.strength)
        .links(links)
        .linkStrengthInterCluster(opts.forceInABox.linkStrengthInterCluster)
        .linkStrengthIntraCluster(opts.forceInABox.linkStrengthIntraCluster)
        .forceLinkDistance(opts.forceInABox.forceLinkDistance)
        .forceLinkStrength(opts.forceInABox.forceLinkStrength)
        .forceCharge(opts.forceInABox.forceCharge)
        .forceNodeSize(opts.forceInABox.forceNodeSize);
    }

    simulation
      .force(
        "link",
        forceLink
          .distance(opts.linkDistance)
          .strength(
            opts.useForceInABox
              ? groupingForce.getLinkStrength
              : opts.linkStrength || 0.1
          )
      )
      .force("charge", forceNode)
      .force("x", opts.useForceInABox ? null : opts.disjoint ? forceX : null)
      .force("y", opts.useForceInABox ? null : opts.disjoint ? forceY : null)
      .force(
        "center",
        opts.useForceInABox
          ? null
          : !opts.disjoint
          ? d3.forceCenter(opts.width / 2, opts.height / 2)
          : null
      )
      .force("collide", forceCollide)
      .force("forceInABox", opts.useForceInABox ? groupingForce : null);
  }

  // Edge bundling
  opts.bundling =
    opts.useEdgeBundling &&
    edgeBundling(
      { nodes, links: sample(links, opts.edgeBundling.max_links) },
      {
        ...opts.edgeBundling,
      }
    );

  simulation.alphaTarget(opts.alphaTarget).restart();

  if (opts.extent) {
    simulation.force(
      "boundary",
      opts.extentForce === "forceBoundary"
        ? forceBoundary(...opts.extent.flat(2))
            .border(opts.extentBorder)
            .hardBoundary(true)
            .strength(opts.extentStrength)
        : opts.extentForce === "forceExtent"
        ? forceExtent(opts.extent)
        : forceTransport(opts.extent, 5, opts.extentStrength * 10)
    );
  }

  opts = {
    ...opts,
    nodes,
    links,
    N,
    LS,
    LT,
    T,
    G,
    W,
    L,
    LO,
    R,
    NS,
    drag,
    simulation,
    color,
  };

  const { target, ticked } =
    opts.renderer === "canvas" ? renderCanvas(opts) : renderSVG(opts);

  simulation.on("tick", ticked);

  if (opts.invalidation) {
    opts.invalidation.then(() => {
      simulation.stop();
    });
  }

  function intern(value) {
    return value !== null && typeof value === "object"
      ? value.valueOf()
      : value;
  }

  ticked();

  return Object.assign(target, {
    scales: { color },
    simulation,
    nodes,
    links,
  });
}
