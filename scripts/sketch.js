let nodes = [];
let edges = [];
let nodeRadius;
let selected_node_index;
let isGrabbing = false;
let settings = {
  modes: [],
  states: []
};

function setModes() {
  let options = document.getElementsByClassName('option');
  for (var i = 0; i < options.length - 1; i++) {
    let input = options[i].getElementsByTagName("input")[0]
    settings["modes"].push(input.id);
  }
}

function checkModes() {
  let options = document.getElementsByClassName('option');
  for (var i = 0; i < options.length - 1; i++) {
    let input = options[i].getElementsByTagName("input")[0]
    settings["states"][i] = input.checked;
  }
}

function setup() {
  createCanvas(750, 750);
  nodeRadius = height / 12;

  // Add the Nodes
  nodes.push(new Node(100, 100, nodeRadius));
  nodes.push(new Node(600, 200, nodeRadius));
  edges.push([new Edge(nodes[0], nodes[1], 10), 0, 1]);
  setModes();
  checkModes();

  textAlign(CENTER, CENTER);
}

function draw() {
  background(133);
  // Draw all elements that can be drawn
  for (var i = 0; i < edges.length; i++) {
    edges[i][0].draw()
  }
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].draw()
  }
  checkModes();
}

function checkOnNode() {
  let mousePos = [mouseX, mouseY];
  let broke_out = false;
  for (var i = 0; i <= nodes.length - 1; i++) {
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

function replaceNode() {
  if (selected_node_index != null) {
    nodes[selected_node_index] = null;
    nodes[selected_node_index] = new Node(mouseX, mouseY, nodeRadius);
    for (var i = 0; i < edges.length; i++) {
      if (edges[i][1] == selected_node_index) {
        edges[i] = [new Edge(nodes[0], nodes[1], edges[i][0].weight), selected_node_index, edges[i][2]];
      } else if (edges[i][2] == selected_node_index) {
        edges[i] = [new Edge(nodes[0], nodes[1], edges[i][0].weight), edges[i][1], selected_node_index];
      }
    }
  }
  selected_node_index = null;
}

function mousePressed() {
  isGrabbing = !isGrabbing;
  checkOnNode(settings.modes);
}

function mouseMoved() {
  // Checks if grabbing and checks if the grab node button is on
  if (isGrabbing && settings["states"][settings["modes"].indexOf("grabTool")]) {
    checkOnNode();
    replaceNode();
  }

}