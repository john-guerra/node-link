# netviz Migration Plan

This is the detailed task breakdown for migrating the Observable notebook to a standalone npm package.

## Phase 1: Project Setup

### 1.1 Initialize Project Structure
- [ ] Create new directory `node-link/`
- [ ] Initialize git repository
- [ ] Create `.gitignore` (node_modules, dist, coverage, etc.)
- [ ] Create directory structure:
  - [ ] `src/`
  - [ ] `src/renderers/`
  - [ ] `src/forces/`
  - [ ] `src/utils/`
  - [ ] `test/`
  - [ ] `test/plots/`
  - [ ] `examples/`
  - [ ] `dist/` (ignored by git)

### 1.2 Configure package.json
- [ ] Create `package.json` with basic info
  - [ ] Name: `netviz`
  - [ ] Version: `0.1.0`
  - [ ] Author: John Alexis Guerra Gómez
  - [ ] License: ISC (matching Observable export)
  - [ ] Main: `dist/netviz.js`
  - [ ] Module: `dist/netviz.mjs`
  - [ ] Repository and homepage URLs
- [ ] Add peer dependencies:
  - [ ] `d3@7`
- [ ] Add dependencies:
  - [ ] `smart-labels`
  - [ ] `force-in-a-box`
  - [ ] `d3-force-boundary` (check if exists)
- [ ] Add devDependencies:
  - [ ] `rollup` and plugins
  - [ ] `@rollup/plugin-node-resolve`
  - [ ] `@rollup/plugin-commonjs`
  - [ ] `@rollup/plugin-terser`
  - [ ] `mocha`
  - [ ] `c8`
  - [ ] `eslint`
  - [ ] `prettier`
  - [ ] `jsdom` (for testing)
- [ ] Add npm scripts:
  - [ ] `build`: Rollup build
  - [ ] `test`: Run all tests
  - [ ] `test:coverage`: c8 coverage
  - [ ] `test:lint`: ESLint
  - [ ] `test:format`: Prettier check
  - [ ] `dev`: Watch mode for development

### 1.3 Configure Build System
- [ ] Create `rollup.config.js`
  - [ ] Configure ESM output
  - [ ] Configure UMD output (for CDN)
  - [ ] Mark D3 as external (peer dependency)
  - [ ] Configure minification
  - [ ] Configure source maps
- [ ] Create `.eslintrc.json`
- [ ] Create `.prettierrc`
- [ ] Test build works: `npm run build`

---

## Phase 2: Extract Code from Observable Notebooks

### 2.1 Extract Custom Forces
- [ ] Download `21d2053b3bc85bce@1299.js` from Observable
- [ ] Extract `forceTransport` function
  - [ ] Remove Observable-specific code
  - [ ] Convert to ES6 module
  - [ ] Save to `src/forces/forceTransport.js`
- [ ] Extract `forceExtent` function
  - [ ] Remove Observable-specific code
  - [ ] Convert to ES6 module
  - [ ] Save to `src/forces/forceExtent.js`
- [ ] Test imports work

### 2.2 Extract Edge Bundling
- [ ] Download `67def5cb48f2f6c4@205.js` from Observable
- [ ] Extract edge bundling implementation
  - [ ] Remove Observable-specific code (md, Inputs, etc.)
  - [ ] Remove demo/example code
  - [ ] Keep only core `edgeBundling` and `ForceEdgeBundling` functions
  - [ ] Convert to ES6 module
  - [ ] Save to `src/forces/edgeBundling.js`
- [ ] Test imports work

### 2.3 Extract Utility Functions
- [ ] Extract from `89207a2280891f15@1859.js`:
  - [ ] `computeAutoFit` → `src/utils/computeAutoFit.js`
  - [ ] `drag` → `src/utils/drag.js`
  - [ ] `applyTransform` → `src/utils/applyTransform.js`
  - [ ] `sample` → `src/utils/sample.js`
  - [ ] `filterNetwork` → `src/utils/filterNetwork.js`
  - [ ] `intern` (if needed as utility)
- [ ] Add D3 imports where needed
- [ ] Test each utility function independently

### 2.4 Extract Renderers
- [ ] Extract `renderCanvas` function
  - [ ] Copy from lines 490-651 of `89207a2280891f15@1859.js`
  - [ ] Remove Observable dependencies (DOM.context2d)
  - [ ] Import required utilities
  - [ ] Save to `src/renderers/renderCanvas.js`
- [ ] Extract `renderSVG` function
  - [ ] Copy from lines 653-821 of `89207a2280891f15@1859.js`
  - [ ] Remove Observable dependencies
  - [ ] Import required utilities
  - [ ] Save to `src/renderers/renderSVG.js`
- [ ] Test renderer imports

### 2.5 Extract Default Options
- [ ] Extract `defaultOpts` (lines 125-223)
  - [ ] Remove Observable dependencies (width, invalidation)
  - [ ] Make it a function that accepts user options
  - [ ] Save to `src/defaults.js`
- [ ] Document all options with JSDoc comments

### 2.6 Extract Core ForceGraph Function
- [ ] Extract `ForceGraph` function (lines 230-488)
  - [ ] Copy to `src/forceGraph.js`
  - [ ] Import all dependencies
  - [ ] Remove Observable-specific code
  - [ ] Keep state preservation logic (_this)
  - [ ] Keep invalidation handling
- [ ] Test basic functionality

---

## Phase 3: Implement Reactive Widgets Pattern

### 3.1 Create Wrapper Function
- [ ] Create `src/index.js` as main entry point
- [ ] Implement `forceGraph(data, options)` wrapper:
  - [ ] Extract `{nodes, links}` from data parameter
  - [ ] Call internal ForceGraph function
  - [ ] Return wrapped HTML Element

### 3.2 Add Element Properties and Methods
- [ ] Add `.value` property to returned element
  - [ ] Initialize as empty/null
  - [ ] Update when user interacts (TODO for later)
- [ ] Add `.update(newData, newOptions)` method
  - [ ] Preserve simulation state
  - [ ] Update nodes/links
  - [ ] Restart simulation
- [ ] Add `.destroy()` method
  - [ ] Stop simulation
  - [ ] Remove event listeners
  - [ ] Clean up DOM

### 3.3 Handle Observable Compatibility
- [ ] Auto-handle `invalidation` option:
  - [ ] If present, call `.destroy()` when promise resolves
- [ ] Auto-handle `_this` option:
  - [ ] Reuse existing element if provided
  - [ ] Preserve node positions
  - [ ] Restart simulation with preserved state

### 3.4 Implement Event System
- [ ] Emit `input` events on user interaction
  - [ ] Set up listeners (TODO: define what triggers events)
  - [ ] Update `.value` property before emitting
  - [ ] Dispatch custom `input` event

---

## Phase 4: Testing Infrastructure

### 4.1 Set Up Testing Environment
- [ ] Create `test/helpers/` directory
- [ ] Create `test/helpers/jsdom.js` for DOM environment
- [ ] Create `test/helpers/loadData.js` to fetch test data
- [ ] Download miserables.json from vega-datasets
  - [ ] Save to `test/data/miserables.json`
- [ ] Create `.mocharc.json` configuration

### 4.2 Write Unit Tests
- [ ] `test/utils-test.js`:
  - [ ] Test `computeAutoFit`
  - [ ] Test `drag` behavior
  - [ ] Test `applyTransform`
  - [ ] Test `sample`
  - [ ] Test `filterNetwork`
- [ ] `test/forces-test.js`:
  - [ ] Test `forceTransport` initialization
  - [ ] Test `forceExtent` initialization
  - [ ] Test edge bundling setup
- [ ] `test/defaults-test.js`:
  - [ ] Test default options merging
  - [ ] Test option validation
- [ ] `test/forceGraph-test.js`:
  - [ ] Test basic initialization
  - [ ] Test with minimal data
  - [ ] Test `.update()` method
  - [ ] Test `.destroy()` method
  - [ ] Test Observable compatibility (_this, invalidation)
  - [ ] Test both SVG and Canvas modes

### 4.3 Write Snapshot/Visual Tests
- [ ] `test/plots/basic-graph.js`:
  - [ ] Render simple graph with miserables data
  - [ ] Verify SVG/Canvas element created
  - [ ] Verify nodes and links rendered
- [ ] `test/plots/canvas-render.js`:
  - [ ] Test Canvas rendering mode
  - [ ] Verify canvas element
- [ ] `test/plots/svg-render.js`:
  - [ ] Test SVG rendering mode
  - [ ] Verify SVG structure
- [ ] `test/plots/edge-bundling.js`:
  - [ ] Test with edge bundling enabled
  - [ ] Verify bundled paths
- [ ] `test/plots/force-in-a-box.js`:
  - [ ] Test grouping layout
  - [ ] Verify grouped positions
- [ ] `test/plots/zoom-drag.js`:
  - [ ] Test zoom behavior
  - [ ] Test drag behavior

### 4.4 Set Up Coverage and Quality
- [ ] Configure c8 for coverage reports
- [ ] Set coverage thresholds
- [ ] Run all tests: `npm test`
- [ ] Generate coverage: `npm run test:coverage`
- [ ] Fix any failing tests

---

## Phase 5: Examples and Documentation

### 5.1 Create Basic HTML Demo
- [ ] Create `examples/basic.html`
  - [ ] Load D3 from CDN
  - [ ] Load node-link from local build
  - [ ] Fetch miserables.json from vega-datasets
  - [ ] Initialize graph with basic options
  - [ ] Add to DOM
- [ ] Test demo works locally
- [ ] Add controls for testing options:
  - [ ] Toggle SVG/Canvas
  - [ ] Toggle edge bundling
  - [ ] Toggle ForceInABox

### 5.2 Create Advanced Examples
- [ ] Create `examples/observable.html`
  - [ ] Demo Observable compatibility
  - [ ] Show invalidation handling
  - [ ] Show state preservation with _this
- [ ] Create `examples/update.html`
  - [ ] Demo `.update()` method
  - [ ] Dynamic data changes
  - [ ] Smooth transitions

### 5.3 Write Documentation
- [ ] Create comprehensive `README.md`:
  - [ ] Installation instructions
  - [ ] Quick start guide
  - [ ] API reference
  - [ ] All options documented
  - [ ] Usage examples (ESM, UMD, Observable)
  - [ ] Links to examples and demos
- [ ] Add JSDoc comments to all public APIs
- [ ] Create `CONTRIBUTING.md`
- [ ] Create `CHANGELOG.md`

---

## Phase 6: Testing and Refinement

### 6.1 Manual Testing
- [ ] Test in modern browsers:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
- [ ] Test ESM import in bundler project (Vite/Webpack)
- [ ] Test UMD from CDN
- [ ] Test with various datasets:
  - [ ] Small graphs (<50 nodes)
  - [ ] Medium graphs (100-500 nodes)
  - [ ] Large graphs (1000+ nodes)

### 6.2 Observable Integration Test
- [ ] Create test Observable notebook
- [ ] Import from unpkg during testing
- [ ] Verify API compatibility
- [ ] Test invalidation handling
- [ ] Test _this parameter
- [ ] Verify no breaking changes from original

### 6.3 Performance Testing
- [ ] Benchmark rendering times
- [ ] Test memory usage
- [ ] Verify simulation performance
- [ ] Optimize if needed

### 6.4 Code Quality
- [ ] Run ESLint: `npm run test:lint`
- [ ] Fix all lint errors
- [ ] Run Prettier: `npm run test:format`
- [ ] Format all code
- [ ] Review all TODOs in code
- [ ] Add missing error handling

---

## Phase 7: Publishing Preparation

### 7.1 Pre-publish Checklist
- [ ] All tests passing
- [ ] Coverage meets threshold
- [ ] No lint errors
- [ ] Code formatted
- [ ] README complete
- [ ] Examples working
- [ ] Version number set (0.1.0 for first release)
- [ ] Package.json fields complete:
  - [ ] keywords
  - [ ] description
  - [ ] repository
  - [ ] homepage
  - [ ] bugs

### 7.2 Build and Verify
- [ ] Clean build: `rm -rf dist && npm run build`
- [ ] Verify output files exist:
  - [ ] `dist/netviz.js` (ESM)
  - [ ] `dist/netviz.mjs` (ESM with .mjs extension)
  - [ ] `dist/node-link.umd.js` (UMD for CDN)
  - [ ] Source maps
- [ ] Test unpacked package: `npm pack`
- [ ] Inspect tarball contents
- [ ] Test installation from tarball

### 7.3 Publish to npm
- [ ] Create npm account (if needed)
- [ ] Login: `npm login`
- [ ] Dry run: `npm publish --dry-run`
- [ ] Publish: `npm publish --access public`
- [ ] Verify on npmjs.com
- [ ] Test installation: `npm install netviz`

---

## Phase 8: Future TODOs (Post-v1)

### 8.1 Selection Feature
- [ ] Design selection API
- [ ] Implement single node selection
- [ ] Implement multiple node selection
- [ ] Update `.value` property with selection
- [ ] Emit `input` events on selection change
- [ ] Add visual feedback for selection
- [ ] Write tests for selection
- [ ] Document selection API

### 8.2 Framework Examples
- [ ] Create React example:
  - [ ] Component wrapper
  - [ ] Demo app
  - [ ] Documentation
- [ ] Create Svelte example:
  - [ ] Component wrapper
  - [ ] Demo app
  - [ ] Documentation
- [ ] Create Vue example (optional)

### 8.3 Publish Edge Bundling Package
- [ ] Create `@john-guerra/force-edge-bundling` package
- [ ] Extract from current bundled code
- [ ] Set up build system
- [ ] Write tests
- [ ] Publish to npm
- [ ] Update node-link to use as dependency

---

## Progress Summary

- **Total Tasks:** 0 completed / TBD total
- **Phase 1 (Setup):** 0/28
- **Phase 2 (Extract):** 0/21
- **Phase 3 (Reactive Widgets):** 0/11
- **Phase 4 (Testing):** 0/32
- **Phase 5 (Examples & Docs):** 0/14
- **Phase 6 (Testing & Refinement):** 0/17
- **Phase 7 (Publishing):** 0/15
- **Phase 8 (Future):** 0/12

**Current Phase:** Phase 1 - Project Setup
**Next Milestone:** Complete project structure and build configuration

---

## Notes

- This plan is a living document - update as needed
- Mark items complete with [x] as you finish them
- Add notes and blockers inline
- Update progress summary regularly
- Break down tasks further if needed
