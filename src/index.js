/**
 * netviz - Network Visualization Library
 *
 * A collection of network visualization widgets supporting multiple rendering modes
 * and layout algorithms. Currently includes force-directed graphs with SVG and Canvas
 * rendering, edge bundling, grouping layouts, and reactive widgets integration.
 *
 * Based on: https://observablehq.com/@john-guerra/force-directed-graph
 * Follows reactive widgets pattern from: https://reactivewidgets.org
 */

import { ForceGraph as ForceGraphCore } from "./forceGraph.js";

/**
 * ForceGraph - Force-directed graph visualization widget
 *
 * @param {Object} data - {nodes, links} graph data
 * @param {Object} options - Configuration options
 * @returns {HTMLElement} DOM element with .value property, .update(), .destroy() methods
 *
 * @example
 * const graph = ForceGraph(data, {
 *   width: 800,
 *   height: 600,
 *   renderer: "svg" // or "canvas"
 * });
 * document.body.appendChild(graph);
 *
 * // Update later
 * graph.update(newData);
 *
 * // Cleanup
 * graph.destroy();
 *
 * // Observable compatibility
 * ForceGraph(data, { invalidation, _this });
 */
export function ForceGraph(data, options = {}) {
  // Create the graph using the core ForceGraph function
  const element = ForceGraphCore(data, options);

  // Add reactive widgets properties and methods

  // .value property for selected nodes/edges (TODO: implement selection)
  element.value = null;

  /**
   * update - Update the graph with new data or options
   * @param {Object} newData - New {nodes, links} data
   * @param {Object} newOptions - New options to merge
   */
  element.update = function (newData, newOptions = {}) {
    // Preserve the current element and simulation by passing _this
    const mergedOptions = {
      ...options,
      ...newOptions,
      _this: element,
    };

    // Re-create the graph with preserved state
    const updated = ForceGraphCore(newData, mergedOptions);

    // Update the element's properties
    element.simulation = updated.simulation;
    element.nodes = updated.nodes;
    element.links = updated.links;
    element.scales = updated.scales;

    return element;
  };

  /**
   * destroy - Cleanup and stop the simulation
   */
  element.destroy = function () {
    if (element.simulation) {
      element.simulation.stop();
    }
    // Remove event listeners if any
    // (TODO: add event listeners and clean them up here)
  };

  // Emit input events when user interacts
  // (TODO: implement selection and event emission)

  return element;
}

/**
 * NodeLink - Alias for ForceGraph (node-link diagrams)
 * Provides a semantic name for force-directed node-link visualizations
 */
export const NodeLink = ForceGraph;

// Re-export utility functions for advanced usage
export { ForceGraph as ForceGraphCore } from "./forceGraph.js";
export { forceTransport } from "./forces/forceTransport.js";
export { forceExtent } from "./forces/forceExtent.js";
export { edgeBundling, ForceEdgeBundling } from "./forces/edgeBundling.js";
export { filterNetwork } from "./utils/filterNetwork.js";
