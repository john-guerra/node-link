import * as d3 from "d3";

/**
 * forceTransport - A D3 force that transports nodes to stay within bounds
 * by sorting them and distributing them evenly within the extent.
 *
 * Original source: https://observablehq.com/d/21d2053b3bc85bce
 * Implementation discussion: https://github.com/d3/d3-force/issues/89
 *
 * @param {Array} extent - [[x0, y0], [x1, y1]] bounding box
 * @param {number} margin - Margin from the extent edges (default: 0)
 * @param {number} strength - Force strength multiplier (default: 1)
 * @returns {Function} D3 force function
 */
export function forceTransport(extent, margin, strength) {
  let nodes;

  if (extent === undefined) extent = [[0, 0], [960, 500]];
  if (margin === undefined) margin = 0;
  if (strength === undefined) strength = 1;

  const X = d3
    .scaleLinear()
    .range([extent[0][0] + margin, extent[1][0] - margin]);
  const Y = d3
    .scaleLinear()
    .range([extent[0][1] + margin, extent[1][1] - margin]);

  let indices = [];

  function force(alpha) {
    if (indices.length !== nodes.length) {
      indices = Uint32Array.from(d3.range(nodes.length));
      X.domain([-1, nodes.length]);
      Y.domain([-1, nodes.length]);
    }

    // Sort nodes by x position and distribute them evenly
    indices.sort((i, j) => nodes[i].x - nodes[j].x);
    for (let i = 0; i < nodes.length; ++i) {
      const node = nodes[indices[i]];
      const target = X(i);
      node.vx += (target - node.x) * strength;
    }

    // Sort nodes by y position and distribute them evenly
    indices.sort((i, j) => nodes[i].y - nodes[j].y);
    for (let i = 0; i < nodes.length; ++i) {
      const node = nodes[indices[i]];
      const target = Y(i);
      node.vy += (target - node.y) * strength * alpha;
    }
  }

  force.initialize = function (_) {
    nodes = _;
  };

  force.extent = function (_) {
    return arguments.length ? ((extent = _), force) : extent;
  };

  force.margin = function (_) {
    return arguments.length ? ((margin = +_), force) : margin;
  };

  force.strength = function (_) {
    return arguments.length ? ((strength = +_), force) : strength;
  };

  return force;
}
