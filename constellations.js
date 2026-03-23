import p5 from "p5";

const CONTAINER_ID = "jsSketchContainer";

const backgroundColour = "#171a26";
const numberOfPoints = 120;
const maxDiameter = 10;
const minDiameter = 4;
const strokeWeight = 2;
const maxLength = 100;

const sketch = function (p) {
  let container;
  let points = [];
  let frame = 0;

  p.setup = function () {
    const el = document.getElementById(CONTAINER_ID);
    container = { width: el.clientWidth, height: el.clientHeight };
    const canvas = p.createCanvas(container.width, container.height);
    canvas.parent(CONTAINER_ID);
    p.background(backgroundColour);

    for (let i = 0; i < numberOfPoints; i++) {
      points.push(new Point());
    }
  };

  p.windowResized = function () {
    const el = document.getElementById(CONTAINER_ID);
    container = { width: el.clientWidth, height: el.clientHeight };
    p.resizeCanvas(container.width, container.height);
    p.background(backgroundColour);
  };

  p.draw = function () {
    frame += 0.001;
    p.background(backgroundColour);

    points.forEach(function (point, index) {
      point.update();
      for (let i = index + 1; i < points.length; i++) {
        const other = points[i];
        if (point.position && other.position) {
          const d = point.position.dist(other.position);
          if (d < maxLength) {
            drawLine(point, other, d);
          }
        }
      }
      point.display();
    });
  };

  function drawLine(pointA, pointB, distance) {
    p.strokeWeight(strokeWeight);
    p.stroke(250, 250, 250, maxLength - distance);
    p.line(
      pointA.position.x,
      pointA.position.y,
      pointB.position.x,
      pointB.position.y,
    );
  }

  class Point {
    constructor() {
      this.diameter = Math.random() * (maxDiameter - minDiameter) + minDiameter;
      this.startX = Math.random() * container.width;
      this.startY = Math.random() * container.height;
      this.range = 2 * Math.random() - 0.5;
      this.position = null;
    }

    update() {
      const deltaX = (100 / this.range) * Math.sin(frame);
      const deltaY = (100 / this.range) * Math.cos(frame);
      this.position = p.createVector(
        this.startX + deltaX,
        this.startY + deltaY,
      );
    }

    display() {
      p.noStroke();
      p.fill(200);
      p.ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
    }
  }
};

new p5(sketch, CONTAINER_ID);
