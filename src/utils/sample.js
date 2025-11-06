/**
 * sample - Samples an array to limit the number of elements
 * Used for edge bundling to limit the number of links processed
 *
 * Original source: https://observablehq.com/@john-guerra/force-directed-graph
 * From 89207a2280891f15@1859.js lines 885-890
 *
 * @param {Array} array - Array to sample
 * @param {number} n - Maximum number of elements to return
 * @returns {Array} Sampled array
 */
export function sample(array, n) {
  if (n >= array.length) return array;

  return array.filter((d, i) => i % Math.floor(array.length / n) === 0);
}
