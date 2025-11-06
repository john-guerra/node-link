import * as d3 from "d3";
import { computeAutoFit } from "../utils/computeAutoFit.js";
import { applyTransform } from "../utils/applyTransform.js";
import smartLabels from "smart-labels";

/**
 * renderCanvas - Canvas renderer for force-directed graph
 *
 * Original source: https://observablehq.com/@john-guerra/force-directed-graph
 * From 89207a2280891f15@1859.js lines 490-651
 *
 * @param {Object} opts - Options object with all configuration
 * @returns {Object} {target: canvas element, ticked: render function}
 */
export function renderCanvas(opts) {
  let context;

  try {
    if (opts._this?.tagName !== "CANVAS") {
      throw new Error("recreating canvas");
    }
    context = opts._this?.getContext("2d");
  } catch (_e) {
    // Create new canvas
    const canvas = document.createElement("canvas");
    canvas.width = opts.width;
    canvas.height = opts.height;
    context = canvas.getContext("2d");
  }

  const line = d3
    .line()
    .curve(opts.linkCurve)
    .x((d) => d.x)
    .y((d) => d.y)
    .context(context);

  const zoom = d3
    .zoom()
    .extent([
      [0, 0],
      [opts.width, opts.height],
    ])
    .scaleExtent(opts.zoomScaleExtent)
    .on("zoom", ({ transform }) => ticked(transform));

  function drawNodesAndLinks(transform = d3.zoomTransform(context.canvas)) {
    if (
      opts.drawLinksWhenAlphaIs === null ||
      opts.simulation.alpha() < opts.drawLinksWhenAlphaIs
    ) {
      context.save();
      // constant opacity
      if (!opts.LO) {
        context.globalAlpha = opts.linkStrokeOpacity;
      }

      for (const [i, link] of opts.links.entries()) {
        context.beginPath();
        drawLink(link, transform);

        // Dynamic opacity
        if (opts.LO) context.globalAlpha = opts.LO[i];
        context.strokeStyle = opts.L ? opts.L[i] : opts.linkStroke;
        context.lineWidth = opts.W ? opts.W[i] : opts.linkStrokeWidth;
        context.stroke();
      }
      context.restore();
    }

    context.save();
    context.globalAlpha = opts.nodeStrokeOpacity;
    for (const [i, node] of opts.nodes.entries()) {
      context.beginPath();
      drawNode(node, i, transform);
      context.fillStyle = opts.G ? opts.color(opts.G[i]) : opts.nodeFill;
      context.strokeStyle = opts.NS ? opts.NS[i] : opts.nodeStroke;
      context.fill();
      context.stroke();
    }
    context.restore();
  }

  function ticked(transform = d3.zoomTransform(context.canvas)) {
    context.save();

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

    context.clearRect(0, 0, opts.width, opts.height);
    drawNodesAndLinks(transform);

    if (opts.nodeLabel) {
      // Draw Labels
      context.save();
      context.fillStyle = opts.nodeLabelFill;
      context.textAlign = opts.nodeLabelTextAlign;
      context.textAnchor = opts.nodeLabelTextAnchor;
      if (opts.T) {
        context.font = opts.nodeLabelFont;
        context.beginPath();

        if (opts.useSmartLabels) {
          smartLabels(opts.nodes, {
            ...opts.smartLabels,
            target: context.canvas,
            label: (_, i) => opts.T[i],
            x: (d) => transform.applyX(opts.x(d.x)),
            y: (d) => transform.applyY(opts.y(d.y)),
            width: opts.width,
            height: opts.height,
            renderer: opts.renderer,
            onHover: () => drawNodesAndLinks(transform),
          });
        } else {
          for (const [i, node] of opts.nodes.entries()) {
            drawLabel(node, i, transform);
          }
        }
        context.stroke();
      }
      context.restore();
    }

    context.restore();
  }

  function drawLink(l, transform) {
    line(
      opts.useEdgeBundling && l.path
        ? l.path.map((d) => applyTransform(d, transform, opts))
        : [
            applyTransform(l.source, transform, opts),
            applyTransform(l.target, transform, opts),
          ]
    );
  }

  function drawNode(d, i, transform) {
    d = applyTransform(d, transform, opts);
    context.moveTo(d.x + opts.R[i], d.y);
    context.arc(d.x, d.y, opts.R[i], 0, 2 * Math.PI);
  }

  function drawLabel(d, i, transform) {
    d = applyTransform(d, transform, opts);
    context.fillText(opts.T[i], d.x, d.y - opts.R[i] - 2);
  }

  return {
    target: d3
      .select(context.canvas)
      .call(
        opts
          .drag(opts.simulation, context.canvas, opts)
          .on("start.render drag.render end.render", () => {
            return ticked(d3.zoomTransform(context.canvas));
          })
      )
      .call(
        opts.useZoom ? zoom : () => {} // do not use zoom
      )
      .node(),
    ticked,
  };
}
