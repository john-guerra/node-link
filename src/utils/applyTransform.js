/**
 * applyTransform - Applies zoom transform to node/link coordinates
 *
 * Original source: https://observablehq.com/@john-guerra/force-directed-graph
 * From 89207a2280891f15@1859.js lines 823-828
 *
 * @param {Object} d - Node or point with x, y coordinates
 * @param {Object} transform - D3 zoom transform
 * @param {Object} opts - Options object with x, y scales
 * @returns {Object} Transformed point with x, y
 */
export function applyTransform(d, transform, opts) {
  const [x, y] = transform.apply([opts.x(d.x), opts.y(d.y)]);
  return { ...d, x, y };
}
