/**
 * forceExtent - A D3 force that clamps nodes to stay within bounds
 *
 * Original source: https://observablehq.com/d/21d2053b3bc85bce
 * Implementation discussion: https://github.com/d3/d3-force/issues/89
 *
 * @param {Array} extent - [[x0, y0], [x1, y1]] bounding box
 * @returns {Function} D3 force function
 */
export function forceExtent(extent) {
  let nodes;

  if (extent === undefined) extent = [[0, 0], [960, 500]];

  function clamp(x, min, max) {
    return Math.max(min, Math.min(max, x));
  }

  function force() {
    for (let i = 0; i < nodes.length; ++i) {
      const node = nodes[i];
      const r = node.radius || 0;
      node.x = clamp(node.x, extent[0][0] - r, extent[1][0] + r);
      node.y = clamp(node.y, extent[0][1] - r, extent[1][1] + r);
    }
  }

  force.initialize = function (_) {
    nodes = _;
  };

  force.extent = function (_) {
    return arguments.length ? ((extent = _), force) : extent;
  };

  return force;
}
