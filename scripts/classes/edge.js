class Edge {
  constructor(node1, node2, index1, index2, weight) {
    this.node1 = node1;
    this.node2 = node2;
    this.index1 = index1;
    this.index2 = index2;
    this.weight = weight;
    this.relCenter = this.getRelCenter();
    this.text_offsetY = -height / 30;
  }

  draw() {
    stroke(0);
    strokeWeight(height / 125);
    line(this.node1.x, this.node1.y, this.node2.x, this.node2.y);

    fill(255);
    strokeWeight(3);
    this.relCenter = this.getRelCenter();
    textSize(height / 20);
    text(String(this.weight), this.relCenter['x'], this.relCenter['y'] + this.text_offsetY);
  }

  getRelCenter() {
    let relX_center = (this.node1.x + this.node2.x) / 2;
    let relY_center = (this.node1.y + this.node2.y) / 2;
    return {
      x: relX_center,
      y: relY_center
    }
  }
}
