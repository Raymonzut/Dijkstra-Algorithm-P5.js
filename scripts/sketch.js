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
 * Loads the nodes and edges data from the localStorage and reconstructs the model
 */
function loadGraph() {
  // Check if there is a Models object
  if (localStorage["Models"]) {
    let models = JSON.parse(localStorage.getItem("Models"));
    let modelNames = [];
    // Iterates over the keys in models, it is a forEach model : models
    Object.keys(models).forEach(function(key, index) {
      modelNames.push(key);
    });
    // Check the amount of models, must be bigger than 0
    if (modelNames.length > 0) {
      // Empty the current model
      nodes = [];
      edges = [];

      let modelToLoad = "";
      // While the prompt is invalid:
      while (modelNames.indexOf(modelToLoad) == -1) {
        modelToLoad = prompt(`Select a model: ${modelNames.join(", ")}`);
      }
      let selectedModel = models[modelToLoad];

      // Reconstruct the nodes from the data
      for (var i = 0; i < selectedModel["nodes"].length; i++) {
        nodes.push(new Node(selectedModel["nodes"][i].x, selectedModel["nodes"][i].y, selectedModel["nodes"][i].r));
      }
      // Reconstruct the edges from the data
      for (var i = 0; i < selectedModel["edges"].length; i++) {
        let currentEdge = selectedModel["edges"][i];
        let node1 = new Node(currentEdge.node1.x, currentEdge.node1.y, currentEdge.node1.r);
        let node2 = new Node(currentEdge.node2.x, currentEdge.node2.y, currentEdge.node2.r);
        let weight = currentEdge.weight;
        edges.push(new Edge(node1, node2, currentEdge.index1, currentEdge.index2, weight));
      }

    } else {
      alert("Can not find any models stored in the models folder");
    }
  } else {
    alert("No models saved");
  }
}
/**
 * Saves the nodes and edges data to the localStorage
 */
function saveGraph() {
  // If models does not exist, make it
  if (!localStorage["Models"]) {
    localStorage.setItem("Models", JSON.stringify({}));
  }

  let fileName = prompt("Enter a name for your graph:");
  let model = {
    nodes: nodes,
    edges: edges
  }
  let currentModelStorage = JSON.parse(localStorage["Models"]);
  currentModelStorage[fileName] = model;

  // Adds the model to the localStorage
  localStorage.setItem("Models", JSON.stringify(currentModelStorage));
}


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

  setModes();

  textAlign(CENTER, CENTER);
}

function draw() {
  background(133);

  // Draw all elements that can be drawn
  for (var i = 0; i < edges.length; i++) {
    // Prompt a weight for weights that don't make sense
    if (isNaN(edges[i].weight)) {
      edges[i].weight = prompt(`What is the weight? previous weight: ${edges[i].weight}`);
    }
    edges[i].draw()
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

function resetAll() {
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].reset();
  }
  for (var i = 0; i < edges.length; i++) {
    edges[i].reset();
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

  if (selected_node_index != null) {
    // Replace the node
    nodes[selected_node_index] = new Node(mousePos[0], mousePos[1], nodeRadius);

    let movingNode = nodes[selected_node_index];

    for (var i = 0; i < edges.length; i++) {
      // No loops (yet)
      if (edges[i].index1 != edges[i].index2) {
        if (edges[i].index1 == selected_node_index) {
          edges[i] = new Edge(movingNode, edges[i].node2, selected_node_index, edges[i].index2, edges[i].weight);
        } else if (edges[i].index2 == selected_node_index) {
          edges[i] = new Edge(edges[i].node1, movingNode, edges[i].index1, selected_node_index, edges[i].weight);
        }

      }
    }
  }
  selected_node_index = null;
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
      edges.push(new Edge(nodes[selectedNodesIndexes[0]], nodes[selectedNodesIndexes[1]], selectedNodesIndexes[0], selectedNodesIndexes[1], prompt("What is the weight?")));
      selectedNodesIndexes = [];
      selectedNodes = [];
    }
  }
  if (settings["states"][settings["modes"].indexOf("routeTool")]) {
    if (selectedNodes.length == 0 && selected_node_index != undefined) {
      clearRoute();
      nodes[selected_node_index].setAsStart(true);
      selectedNodes.push({});

    } else if (selectedNodes.length == 1 && selected_node_index != undefined) {
      nodes[selected_node_index].setAsEnd(true);
      calculateRoute();
    }
  }
}

function mouseMoved() {
  // Checks if grabbing and checks if the grab node button is on
  if (isGrabbing && settings["states"][settings["modes"].indexOf("grabTool")]) {
    resetAll();
    replaceNode();
  }
}
