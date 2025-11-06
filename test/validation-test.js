import { describe, it, before } from "mocha";
import assert from "assert";
import { JSDOM } from "jsdom";
import * as d3 from "d3";

// Import from built dist to avoid ESM/CommonJS issues with dependencies
import { ForceGraph } from "../dist/netviz.mjs";

// Setup DOM environment for tests
let dom;
before(() => {
  dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
  global.window = dom.window;
  global.document = dom.window.document;
  global.HTMLElement = dom.window.HTMLElement;
  global.SVGElement = dom.window.SVGElement;
  // Mock d3 for the dist build
  global.d3 = d3;
});

// Helper to create test options with SVG renderer
const testOpts = (overrides = {}) => ({
  width: 100,
  height: 100,
  renderer: "svg",
  ...overrides,
});

describe("ForceGraph Validation", () => {
  describe("Data validation", () => {
    it("should throw error when nodes is missing", () => {
      assert.throws(
        () => ForceGraph({}),
        /Missing required 'nodes' array/,
        "Should throw error for missing nodes"
      );
    });

    it("should throw error when nodes is not an array", () => {
      assert.throws(
        () => ForceGraph({ nodes: "not an array" }),
        /'nodes' must be an array/,
        "Should throw error for non-array nodes"
      );
    });

    it("should throw error when nodes is a number", () => {
      assert.throws(
        () => ForceGraph({ nodes: 123 }),
        /'nodes' must be an array/,
        "Should throw error when nodes is a number"
      );
    });

    it("should throw error when nodes is an object", () => {
      assert.throws(
        () => ForceGraph({ nodes: { id: "A" } }),
        /'nodes' must be an array/,
        "Should throw error when nodes is an object"
      );
    });

    it("should warn when nodes array is empty", () => {
      let warningCalled = false;
      const originalWarn = console.warn;
      console.warn = (msg) => {
        if (msg.includes("Empty 'nodes' array")) {
          warningCalled = true;
        }
      };

      const graph = ForceGraph({ nodes: [], links: [] }, testOpts());
      graph.destroy();

      console.warn = originalWarn;
      assert.strictEqual(
        warningCalled,
        true,
        "Should warn about empty nodes array"
      );
    });

    it("should throw error when links is not an array", () => {
      assert.throws(
        () =>
          ForceGraph({
            nodes: [{ id: "A" }],
            links: "not an array",
          }),
        /'links' must be an array/,
        "Should throw error for non-array links"
      );
    });
  });

  describe("Node ID validation", () => {
    it("should throw error when node is missing id property", () => {
      assert.throws(
        () =>
          ForceGraph({
            nodes: [{ name: "A" }, { name: "B" }],
            links: [],
          }),
        /node\(s\) are missing an 'id' property/,
        "Should throw error for missing node IDs"
      );
    });

    it("should throw error when some nodes are missing id", () => {
      assert.throws(
        () =>
          ForceGraph({
            nodes: [{ id: "A" }, { name: "B" }, { id: "C" }],
            links: [],
          }),
        /1 node\(s\) are missing an 'id' property/,
        "Should throw error for partially missing node IDs"
      );
    });

    it("should throw error when node id is null", () => {
      assert.throws(
        () =>
          ForceGraph({
            nodes: [{ id: null }],
            links: [],
          }),
        /node\(s\) are missing an 'id' property/,
        "Should throw error for null node ID"
      );
    });

    it("should throw error when node id is undefined", () => {
      assert.throws(
        () =>
          ForceGraph({
            nodes: [{ id: undefined }],
            links: [],
          }),
        /node\(s\) are missing an 'id' property/,
        "Should throw error for undefined node ID"
      );
    });

    it("should accept numeric node IDs", () => {
      const graph = ForceGraph(
        {
          nodes: [{ id: 0 }, { id: 1 }],
          links: [{ source: 0, target: 1 }],
        },
        testOpts()
      );
      assert.ok(graph, "Should create graph with numeric IDs");
      graph.destroy();
    });

    it("should accept string node IDs", () => {
      const graph = ForceGraph(
        {
          nodes: [{ id: "A" }, { id: "B" }],
          links: [{ source: "A", target: "B" }],
        },
        testOpts()
      );
      assert.ok(graph, "Should create graph with string IDs");
      graph.destroy();
    });
  });

  describe("Valid data scenarios", () => {
    it("should create graph with minimal valid data", () => {
      const graph = ForceGraph({ nodes: [{ id: "A" }], links: [] }, testOpts());
      assert.ok(graph, "Should create graph with single node");
      assert.ok(graph.destroy, "Should have destroy method");
      graph.destroy();
    });

    it("should create graph with nodes and links", () => {
      const graph = ForceGraph(
        {
          nodes: [{ id: "A" }, { id: "B" }, { id: "C" }],
          links: [
            { source: "A", target: "B" },
            { source: "B", target: "C" },
          ],
        },
        testOpts()
      );
      assert.ok(graph, "Should create graph");
      assert.ok(graph.simulation, "Should have simulation");
      assert.ok(graph.nodes, "Should have nodes");
      assert.ok(graph.links, "Should have links");
      graph.destroy();
    });

    it("should accept links when not provided (defaults to empty array)", () => {
      const graph = ForceGraph(
        { nodes: [{ id: "A" }, { id: "B" }] },
        testOpts()
      );
      assert.ok(graph, "Should create graph without links parameter");
      graph.destroy();
    });

    it("should support numeric link indices", () => {
      const graph = ForceGraph(
        {
          nodes: [{ id: "A" }, { id: "B" }],
          links: [{ source: 0, target: 1 }],
        },
        testOpts()
      );
      assert.ok(graph, "Should create graph with numeric link indices");
      graph.destroy();
    });

    it("should support object link references", () => {
      const nodeA = { id: "A" };
      const nodeB = { id: "B" };
      const graph = ForceGraph(
        {
          nodes: [nodeA, nodeB],
          links: [{ source: nodeA, target: nodeB }],
        },
        testOpts()
      );
      assert.ok(graph, "Should create graph with object link references");
      graph.destroy();
    });

    it("should support custom nodeId accessor", () => {
      const graph = ForceGraph(
        {
          nodes: [{ name: "A" }, { name: "B" }],
          links: [{ source: "A", target: "B" }],
        },
        testOpts({ nodeId: (d) => d.name })
      );
      assert.ok(graph, "Should create graph with custom nodeId accessor");
      graph.destroy();
    });
  });

  describe("ForceGraph element interface", () => {
    it("should return an HTML element", () => {
      const graph = ForceGraph({ nodes: [{ id: "A" }], links: [] }, testOpts());
      // SVG elements are also considered HTML elements in the DOM hierarchy
      assert.ok(
        graph instanceof global.HTMLElement ||
          graph instanceof global.SVGElement,
        "Should return HTML element (SVG or other)"
      );
      graph.destroy();
    });

    it("should have required methods", () => {
      const graph = ForceGraph({ nodes: [{ id: "A" }], links: [] }, testOpts());
      assert.strictEqual(
        typeof graph.update,
        "function",
        "Should have update method"
      );
      assert.strictEqual(
        typeof graph.destroy,
        "function",
        "Should have destroy method"
      );
      assert.ok(graph.simulation, "Should have simulation property");
      graph.destroy();
    });

    it("should have value property", () => {
      const graph = ForceGraph({ nodes: [{ id: "A" }], links: [] }, testOpts());
      assert.ok("value" in graph, "Should have value property");
      graph.destroy();
    });
  });
});
