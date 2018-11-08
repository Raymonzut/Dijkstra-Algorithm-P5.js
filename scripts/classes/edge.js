class Edge {
  constructor(node1, node2) {
    this.node1 = node1;
    this.node2 = node2;
  }

  draw() {
    stroke(0);
    strokeWeight(height / 125);
    line(this.node1.x, this.node1.y, this.node2.x, this.node2.y);
  }
}