let nodes = [];
let edges = [];
let selectedNodes = [];
let nodeRadius;
let selected_node_index;
let selected_edge_index;
let selectedNodesIndexes = [];
let isGrabbing = false;
let settings = {
  modes: [],
  states: []
};


/**
 * Loads the different modes that are specified in the html under the options div
 */
function setModes() {
  let options = document.getElementsByClassName('option');
  for (var i = 0; i < options.length; i++) {
    let input = options[i].getElementsByTagName("input")[0];
    settings["modes"].push(input.id);
  }
}

/**
 * Checks which options are checked
 */
function checkModes() {
  let options = document.getElementsByClassName('option');
  for (var i = 0; i < options.length; i++) {
    let input = options[i].getElementsByTagName("input")[0]
    settings["states"][i] = input.checked;
  }
}

function setup() {
  createCanvas(750, 750);
  nodeRadius = height / 12;

  // Adds a begin graph, with 2 nodes and a edge to connect them

  setModes();

  textAlign(CENTER, CENTER);
}

function draw() {
  background(133);

  // Draw all elements that can be drawn
  for (var i = 0; i < edges.length; i++) {
    // Prompt a weight for weights that don't make sense
    if (isNaN(edges[i][0].weight)) {
      edges[i][0].weight = prompt(`What is the weight? previous weight: ${edges[i][0].weight}`);
    }
    edges[i][0].draw()
  }
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].draw()
  }

}

/**
 * Sets selected_node_index to the node where the mouse is on
 * selected_node_index will be null when the mouse is not on a node
 */
function checkOnNode() {
  let mousePos = [mouseX, mouseY];
  let broke_out = false;
  for (var i = 0; i < nodes.length; i++) {
    if (((nodes[i].x - nodeRadius) < mousePos[0] && mousePos[0] < (nodes[i].x + nodeRadius)) && ((nodes[i].y - nodeRadius) < mousePos[1] && mousePos[1] < (nodes[i].y + nodeRadius))) {
      selected_node_index = i;
      broke_out = true;
      break;
    }
  }
  if (!broke_out) {
    selected_node_index = null;
  }
}

/**
 * Will grab the node where the mouse is on, this node will be replaced with the update node:
 * It will have a new x and y position
 * The edges [] will be updated with the new node
 */
function replaceNode() {
  checkOnNode();
  let mousePos = [mouseX, mouseY];

  // TODO: Fix the edge not moving with bug
  if (selected_node_index != null) {
    // Replace the node
    nodes[selected_node_index] = new Node(mousePos[0], mousePos[1], nodeRadius);

    let movingNode = nodes[selected_node_index];

    for (var i = 0; i < edges.length; i++) {
      // No loops (yet)
      // An edge in the edge array: [edge(node1, node2, weight), index1, index2]
      if (edges[i][1] != edges[i][2]) {
        if (edges[i][1] == selected_node_index) {
          edges[i] = [new Edge(movingNode, edges[i][0].node2, edges[i][0].weight), selected_node_index, edges[i][2]];
        } else if (edges[i][2] == selected_node_index) {
          edges[i] = [new Edge(edges[i][0].node1, movingNode, edges[i][0].weight), edges[i][1], selected_node_index];
        }

      }
    }
  }
  selected_node_index = null;
}
/**
 * Will reset all nodes to a default node
 */
function clearRoute() {
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].is_start = false;
    nodes[i].is_end = false;
  }
}
/**
 * Will use Dijkstra's algorithm to calculate the shortest route
 */
function calculateRoute() {

}

function mousePressed() {
  checkModes();
  isGrabbing = !isGrabbing;
  checkOnNode();

  // Checks if add node is selected
  if (settings["states"][settings["modes"].indexOf("addNodeTool")]) {
    let mousePos = [mouseX, mouseY];
    if ((0 < mousePos[0] && mousePos[0] < width) && (0 < mousePos[1] && mousePos[1] < height)) {
      nodes.push(new Node(mousePos[0], mousePos[1], nodeRadius));
    }
  }

  if (settings["states"][settings["modes"].indexOf("addEdgeTool")]) {
    let node1, node2;

    // No selected edges
    if (selectedNodes.length == 0 && selected_node_index != undefined) {
      node1 = nodes[selected_node_index];
      selectedNodes.push(node1);
      selectedNodesIndexes.push(nodes.indexOf(selectedNodes[0]));

    } else if (selectedNodes.length == 1 && selected_node_index != undefined) {
      node2 = nodes[selected_node_index];
      selectedNodes.push(node2);
      selectedNodesIndexes.push(nodes.indexOf(selectedNodes[1]));
      // Now, we have 2 selectedNodes
      edges.push([new Edge(nodes[selectedNodesIndexes[0]], nodes[selectedNodesIndexes[1]], prompt("What is the weight?")), selectedNodesIndexes[0], selectedNodesIndexes[1]]);
      selectedNodesIndexes = [];
      selectedNodes = [];
    }
  }
  if (settings["states"][settings["modes"].indexOf("routeTool")]) {
    if (selectedNodes.length == 0 && selected_node_index != undefined) {
      clearRoute();
      nodes[selected_node_index].setAsStart();
      selectedNodes.push({});

    } else if (selectedNodes.length == 1 && selected_node_index != undefined) {
      nodes[selected_node_index].setAsEnd();
      calculateRoute();
    }
  }
}

function mouseMoved() {
  // Checks if grabbing and checks if the grab node button is on
  if (isGrabbing && settings["states"][settings["modes"].indexOf("grabTool")]) {
    replaceNode();
  }

}