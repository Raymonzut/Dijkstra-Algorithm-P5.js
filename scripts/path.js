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

function updateNeighbours(index) {
  for (var i = 0; i < edges.length; i++) {
    if (edges[i].connected.includes(index)) {

      let node_index_here = edges[i].getCurrentSideIndex(index);
      let node_index_there = edges[i].getOtherSideIndex(index);

      nodes[node_index_there].color = color(100, 100, 100);

      let current_neighbour_weight = nodes[node_index_there].weight;
      let new_neighbour_weight = nodes[node_index_here].weight + parseInt(edges[i].weight);

      console.log(`${current_neighbour_weight}, ${new_neighbour_weight}`);

      if (current_neighbour_weight > new_neighbour_weight) {
        nodes[node_index_there].weight = new_neighbour_weight;
      }
    }
  }
}


/**
 * Will update weights of nodes
 * Will return the index of the lowest node
 */
// Check if valid, haven't seen mistake (yet)
function getLowestNodeIndex(endIndex) {
  let lowestIndex;
  let changed = false;

  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].canVisit) {
      lowestIndex = i;
    }
  }

  for (var i = 0; i < nodes.length; i++) {
    if ((nodes[lowestIndex].weight >= nodes[i].weight) && nodes[i].canVisit) {
      changed = true;
      lowestIndex = i;
    }
  }

  if (!changed) {
    console.log("No lower index");
    return null;
  } else if (lowestIndex == endIndex) {
    console.log("End reached early");
    return null;
  } else {
    return lowestIndex;
  }

}


/**
 * Will use Dijkstra's algorithm to calculate the shortest route
 * Will move a 'player' by setting currentIndex to the lowest weighted node
 */
function calculateRoute() {
  let currentIndex;
  let endIndex;

  let canExit = false;
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].initPathFinding();
    if (nodes[i].is_start) {
      currentIndex = i;
    }
    if (nodes[i].is_end) {
      endIndex = i;
    }
  }

  // Reconsider ending condition
  // Algoritm not "Walking" properly
  let timer = setInterval(function() {
    if (canExit) {
      clearInterval(timer);
      return;
    }
    updateNeighbours(currentIndex);
    nodes[currentIndex].canVisit = false;
    currentIndex = getLowestNodeIndex(endIndex);
    canExit = (currentIndex == null);
  }, 2000);

  console.log(currentIndex == endIndex);



}
