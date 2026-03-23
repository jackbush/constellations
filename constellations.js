import p5 from "p5";

const CONTAINER_ID = "jsSketchContainer";

const backgroundColour = "#020509";
const numberOfPoints = 120;
const maxDiameter = 5;
const minDiameter = 1;
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
    document.body.style.background = backgroundColour;

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
    const alpha = maxLength - distance;
    // Hue drifts slowly through teal → blue → violet (cycle ~20s)
    const hue = 190 + 80 * (0.5 + 0.5 * Math.sin(frame * 5));

    p.colorMode(p.HSB, 360, 100, 100, 100);

    // Wide dim glow
    p.strokeWeight(5);
    p.stroke(hue, 55, 95, (alpha / maxLength) * 18);
    p.line(
      pointA.position.x,
      pointA.position.y,
      pointB.position.x,
      pointB.position.y,
    );

    // Bright core
    p.strokeWeight(1.2);
    p.stroke(hue, 35, 100, (alpha / maxLength) * 55);
    p.line(
      pointA.position.x,
      pointA.position.y,
      pointB.position.x,
      pointB.position.y,
    );

    p.colorMode(p.RGB, 255, 255, 255, 255);
  }

  class Point {
    constructor() {
      // Bias toward smaller stars: quadratic falloff so small stars dominate
      const t = Math.random();
      this.diameter = minDiameter + (maxDiameter - minDiameter) * (t * t);
      this.startX = Math.random() * container.width;
      this.startY = Math.random() * container.height;
      this.range = 2 * Math.random() - 0.5;
      this.position = null;

      // Twinkle: unique phase and speed per star
      this.twinkleOffset = Math.random() * Math.PI * 2;
      this.twinkleSpeed = 0.02 + Math.random() * 0.06;

      // Stellar color: mostly blue-white, some pure white, rare warm tones
      const roll = Math.random();
      if (roll < 0.55) {
        this.r = 200;
        this.g = 220;
        this.b = 255; // Blue-white (type A/B)
      } else if (roll < 0.8) {
        this.r = 255;
        this.g = 255;
        this.b = 255; // White
      } else if (roll < 0.93) {
        this.r = 255;
        this.g = 245;
        this.b = 210; // Warm yellow-white (type G)
      } else {
        this.r = 255;
        this.g = 210;
        this.b = 175; // Rare orange (type K)
      }
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
      // Twinkle: smoothly oscillate brightness and size
      const twinkle =
        0.6 +
        0.4 * Math.sin(p.frameCount * this.twinkleSpeed + this.twinkleOffset);
      const alpha = Math.floor(180 + 75 * twinkle);
      const d = this.diameter * (0.85 + 0.15 * twinkle);

      p.noStroke();

      // Soft glow halo for larger stars
      if (this.diameter > 2.8) {
        p.fill(this.r, this.g, this.b, 18);
        p.ellipse(this.position.x, this.position.y, d * 4, d * 4);
        p.fill(this.r, this.g, this.b, 35);
        p.ellipse(this.position.x, this.position.y, d * 2.2, d * 2.2);
      }

      // Star core
      p.fill(this.r, this.g, this.b, alpha);
      p.ellipse(this.position.x, this.position.y, d, d);
    }
  }
};

new p5(sketch, CONTAINER_ID);
