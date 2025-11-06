import * as d3 from "d3";

/**
 * drag - Custom drag behavior that works with zoom transforms
 *
 * Original source: https://observablehq.com/@john-guerra/force-directed-graph
 * From 89207a2280891f15@1859.js lines 830-875
 *
 * @param {Object} simulation - D3 force simulation
 * @param {HTMLElement} node - DOM node (SVG or Canvas element)
 * @param {Object} opts - Options object with x, y scales and minDistanceForDrag
 * @returns {Function} D3 drag behavior
 */
export function drag(simulation, node, opts) {
  function dragsubject(event) {
    const transform = d3.zoomTransform(node);
    let [x, y] = transform.invert([event.x, event.y]);
    x = opts.x.invert(x);
    y = opts.y.invert(y);
    let subject = simulation.find(x, y);

    let d = Math.hypot(x - subject.x, y - subject.y);

    return d < opts.minDistanceForDrag
      ? {
          circle: subject,
          x: transform.applyX(opts.x(subject.x)),
          y: transform.applyY(opts.y(subject.y)),
        }
      : null;
  }

  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.circle.fx = event.subject.circle.x;
    event.subject.circle.fy = event.subject.circle.y;
  }

  function dragged(event) {
    const transform = d3.zoomTransform(node);
    event.subject.circle.fx = opts.x.invert(transform.invertX(event.x));
    event.subject.circle.fy = opts.y.invert(transform.invertY(event.y));
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.circle.fx = null;
    event.subject.circle.fy = null;
  }

  return d3
    .drag()
    .subject(dragsubject)
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}
