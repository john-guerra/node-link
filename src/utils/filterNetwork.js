/**
 * filterNetwork - Utility to filter network by nodes/links with ego-network support
 *
 * Original source: https://observablehq.com/@john-guerra/force-directed-graph
 * From 89207a2280891f15@1859.js lines 893-977
 *
 * @param {Object} network - {nodes, links} network data
 * @param {Object} options - Filtering options
 * @returns {Object} Filtered {nodes, links}
 */
export function filterNetwork(
  network,
  {
    nodeId = (d) => d.id,
    byNodes = null,
    byLinks = null,
    edgelessNodes = false, // Should we allow nodes without edges?
    nodesMap,
    egoDistance = 1,
    filterSource = true,
    filterTarget = true,
  } = {}
) {
  nodesMap = nodesMap
    ? nodesMap
    : new Map(network.nodes.map((d, i, all) => [nodeId(d, i, all), d]));
  let res = {
    nodes: [...network.nodes],
    links: [...network.links],
  };

  function filterNodesFromLinks(res) {
    const ids = [...new Set(res.links.map((l) => [l.source, l.target]).flat())];
    res.nodes = ids.map((id) => nodesMap.get(id)).filter((d) => d); // undefined when the node is not visible anymore

    return res;
  }

  function filterLinksFromNodes(
    { nodes, links },
    { filterSource = true, filterTarget = true } = {}
  ) {
    const ids = new Set(nodes.map(nodeId));

    links = links
      .filter(
        ({ source, target }) =>
          (!filterSource || ids.has(source)) &&
          (!filterTarget || ids.has(target))
      )
      .map((l) => ({ ...l }));

    return { nodes, links };
  }

  // Filter nodes
  if (byNodes) {
    res.nodes = res.nodes.filter(byNodes).map((n) => ({ ...n }));
  }

  res = filterLinksFromNodes(res, { filterSource, filterTarget });

  // Then links
  if (byLinks) {
    res.links = res.links.filter(byLinks).map((l) => ({
      ...l,
    }));
    // Remove edgeless nodes
    if (!edgelessNodes) {
      res = filterNodesFromLinks(res, { filterSource, filterTarget });
    }
  }

  for (
    let currentDistance = 1;
    currentDistance < egoDistance;
    currentDistance += 1
  ) {
    res = filterLinksFromNodes(
      { nodes: res.nodes, links: network.links },
      { filterSource, filterTarget: false }
    );

    res = filterNodesFromLinks(res, { filterSource, filterTarget });
  }

  return res;
}
