import * as d3 from "d3";

/**
 * computeAutoFit - Adjusts x/y scales to fit nodes in viewport
 * with optional aspect ratio preservation
 *
 * Original source: https://observablehq.com/@john-guerra/force-directed-graph
 * From 89207a2280891f15@1859.js lines 979-1022
 *
 * @param {Object} opts - Options object with nodes, x, y scales, width, height, autoFit, keepAspectRatio
 */
export function computeAutoFit(opts) {
  if (opts.autoFit) {
    const yExtent = d3.extent(opts.nodes, (d) => d.y);
    const xExtent = d3.extent(opts.nodes, (d) => d.x);

    opts.x.domain(d3.extent(opts.nodes, (d) => d.x));
    opts.y.domain(d3.extent(opts.nodes, (d) => d.y));

    if (opts.keepAspectRatio) {
      const ratio = opts.width / opts.height;
      const newRatio = (xExtent[1] - xExtent[0]) / (yExtent[1] - yExtent[0]);

      if (newRatio < ratio) {
        // Adjust x axis to fit
        const d =
          (opts.width / opts.height) * (yExtent[1] - yExtent[0]) -
          (xExtent[1] - xExtent[0]);

        opts.x.domain([xExtent[0] - d / 2, xExtent[1] + d / 2]);
        opts.y.domain(yExtent);
      } else {
        // Adjust y axis to fit
        const d =
          (opts.height / opts.width) * (xExtent[1] - xExtent[0]) -
          (yExtent[1] - yExtent[0]);

        opts.y.domain([yExtent[0] - d / 2, yExtent[1] + d / 2]);
        opts.x.domain(xExtent);
      }
    }
  }
}
