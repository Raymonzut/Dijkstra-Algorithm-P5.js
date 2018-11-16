class Node {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.edge = r / 50;
    this.color = 255;
    this.is_start = false;
    this.is_end = false;

  }

  draw() {
    stroke(0);
    strokeWeight(10);
    ellipse(this.x, this.y, this.r, this.r);

    stroke(255);
    strokeWeight(this.edge);
    fill(this.color);
    ellipse(this.x, this.y, this.r, this.r);
  }

  setAsStart(is_start) {
    this.is_start = is_start;
    this.color = color(32, 221, 68);
  }

  setAsEnd(is_end) {
    this.is_end = is_end;
    this.color = color(214, 65, 56);
  }

}