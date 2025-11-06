import * as d3 from "d3";
import { computeAutoFit } from "../utils/computeAutoFit.js";
import { applyTransform } from "../utils/applyTransform.js";
import smartLabels from "smart-labels";

/**
 * renderSVG - SVG renderer for force-directed graph
 *
 * Original source: https://observablehq.com/@john-guerra/force-directed-graph
 * From 89207a2280891f15@1859.js lines 653-821
 *
 * @param {Object} opts - Options object with all configuration
 * @returns {Object} {target: SVG element, ticked: render function}
 */
export function renderSVG(opts) {
  let svg;

  try {
    if (opts._this?.tagName !== "svg") {
      throw new Error("recreating svg");
    }
    svg = d3.select(opts._this);
  } catch {
    svg = d3.create("svg");
  }

  const line = d3
    .line()
    .curve(opts.linkCurve)
    .x((d) => d.x)
    .y((d) => d.y);

  svg
    .attr("width", opts.width)
    .attr("height", opts.height)
    .attr("viewBox", [0, 0, opts.width, opts.height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const linkG = svg
    .selectAll("g#gLinks")
    .data([0])
    .join("g")
    .attr("id", "gLinks");

  const link = linkG
    .attr(
      "stroke",
      typeof opts.linkStroke !== "function" ? opts.linkStroke : null
    )
    .attr("fill", "none")
    .attr("stroke-opacity", (_, i) =>
      opts.LO ? opts.LO[i] : opts.linkStrokeOpacity
    )
    .attr(
      "stroke-width",
      typeof opts.linkStrokeWidth !== "function" ? opts.linkStrokeWidth : null
    )
    .attr("stroke-linecap", opts.linkStrokeLinecap)
    .selectAll("path")
    .data(opts.links)
    .join("path");

  const nodeG = svg
    .selectAll("g#gNodes")
    .data([0])
    .join("g")
    .attr("id", "gNodes");

  const node = nodeG
    .attr("fill", opts.nodeFill)
    .attr("stroke-opacity", opts.nodeStrokeOpacity)
    .attr("stroke-width", opts.nodeStrokeWidth)
    .selectAll("circle.node")
    .data(opts.nodes)
    .join("circle")
    .attr("class", "node")
    .attr("stroke", (_, i) => (opts.NS ? opts.NS[i] : opts.nodeStroke))
    .attr("r", (_, i) => opts.R[i]);

  let label = null;

  if (!opts.useSmartLabels) {
    label = nodeG
      .selectAll("text.label")
      .data(opts.nodes)
      .join("text")
      .attr("fill", opts.nodeLabelFill)
      .attr("stroke", opts.nodeLabelStroke || "none")
      .style("text-anchor", opts.nodeLabelAlign)
      .style("text-anchor", opts.nodeLabelTextAnchor)
      .style("font", opts.nodeLabelFont)
      .attr("class", "label")
      .text((_, i) => opts.T[i]);
  }

  node.call(opts.drag(opts.simulation, svg.node(), opts));

  const zoom = d3
    .zoom()
    .extent([
      [0, 0],
      [opts.width, opts.height],
    ])
    .scaleExtent(opts.zoomScaleExtent)
    .on("zoom", ({ transform }) => ticked(transform));

  svg.call(
    opts.useZoom ? zoom : () => {} // do not use zoom
  );

  if (opts.W) link.attr("stroke-width", ({ index: i }) => opts.W[i]);
  if (opts.L) link.attr("stroke", ({ index: i }) => opts.L[i]);
  if (opts.G) node.attr("fill", ({ index: i }) => opts.color(opts.G[i]));
  if (opts.T) node.append("title").text(({ index: i }) => opts.T[i]);

  function ticked(transform = d3.zoomTransform(svg.node())) {
    computeAutoFit(opts);

    if (opts.useEdgeBundling && opts.bundling) {
      for (let l of opts.links) {
        delete l.path;
      }
      if (
        (!opts.edgeBundling.min_alpha_to_bundle &&
          opts.edgeBundling.min_alpha_to_bundle !== 0) ||
        opts.simulation.alpha() < opts.edgeBundling.min_alpha_to_bundle
      ) {
        opts.bundling.update();
      }
    }

    link
      .attr(
        "display",
        opts.drawLinksWhenAlphaIs === null ||
          opts.simulation.alpha() <= opts.drawLinksWhenAlphaIs
          ? "block"
          : "none"
      )
      .attr("d", (l) => {
        return line(
          opts.useEdgeBundling && l.path
            ? l.path.map((d) => applyTransform(d, transform, opts))
            : [
                applyTransform(l.source, transform, opts),
                applyTransform(l.target, transform, opts),
              ]
        );
      });

    node
      .attr("cx", (d) => applyTransform(d, transform, opts).x)
      .attr("cy", (d) => applyTransform(d, transform, opts).y);

    if (opts.useSmartLabels) {
      smartLabels(opts.nodes, {
        ...opts.smartLabels,
        target: nodeG,
        label: (_, i) => opts.T[i],
        x: (d) => transform.applyX(opts.x(d.x)),
        y: (d) => transform.applyY(opts.y(d.y)),
        width: opts.width,
        height: opts.height,
      });
    } else {
      label
        .attr(
          "x",
          (d) => applyTransform(d, transform, opts).x + opts.nodeLabelDx
        )
        .attr(
          "y",
          (d) => applyTransform(d, transform, opts).y + opts.nodeLabelDy
        );
    }
  }

  return { target: svg.node(), ticked };
}
