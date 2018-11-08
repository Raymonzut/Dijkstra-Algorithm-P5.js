class Node {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.edge = r / 50;
  }

  draw() {
    stroke(0);
    strokeWeight(10);
    ellipse(this.x, this.y, this.r, this.r);

    stroke(255);
    strokeWeight(this.edge);
    fill(255);
    ellipse(this.x, this.y, this.r, this.r);


  }

}