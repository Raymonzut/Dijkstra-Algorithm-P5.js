/**
 * Will reset all nodes to a default node
 */
function clearRoute() {
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].is_start = false;
    nodes[i].is_end = false;
    nodes[i].weight = Infinity;
  }
}
/**
 * Will show the optimal route from the calculated graph
 */
function showRoute() {

}

/**
 * Will update weights of nodes
 * Will return the index of the lowest node
 */
// TODO: Fix the weight setting to nodes
function getLowestNeighbour(index) {
  // Find neighbours, adds it as [index, edgeWeight]
  let neighbourIndexes = [];
  for (var i = 1; i < edges.length; i++) {
    if (index == edges[i].index1) {
      neighbourIndexes.push([edges[i].index1, edges[i].weight]);
    } else if (index == edges[i].index2) {
      neighbourIndexes.push([edges[i].index2, edges[i].weight]);
    }
  }
  console.log(neighbourIndexes);
  // Update weights
  for (var i = 0; i < neighbourIndexes.length; i++) {
    if (parseInt(nodes[neighbourIndexes[i][0]].weight) > parseInt(nodes[index].weight) + neighbourIndexes[i][1]) {
      nodes[neighbourIndexes[i][0]].weight = (parseInt(nodes[index].weight) + neighbourIndexes[i][1]).toString();
      console.log(nodes[neighbourIndexes[i][0]].weight);
    }
  }

  // get the lowest neighbourIndex
  let lowestIndex = 0
  for (var i = 1; i < neighbourIndexes.length; i++) {
    if (parseInt(nodes[lowestIndex].weight) < parseInt(nodes[i].weight)) {
      lowestIndex = i;
    }
  }
  return lowestIndex;
}

/**
 * Will use Dijkstra's algorithm to calculate the shortest route
 * Will move a 'player' by setting is_current to the lowest weighted node
 */
function calculateRoute() {
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].initPathFinding();
  }
}
