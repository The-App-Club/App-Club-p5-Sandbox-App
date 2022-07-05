import * as p5 from 'p5';

const mycode = (p, isDebug = true) => {
  // https://p5js.org/examples/instance-mode-instantiation.html
  // https://codepen.io/jacorre/pen/bgbNXr

  const radius = 25;
  const circles = [
    {x: 50, y: 50, color: ' #000', active: false},
    {x: 150, y: 50, color: '#000', active: false},
    {x: 250, y: 50, color: '#000', active: false},
  ];

  if (isDebug) {
    console.log('circles', circles);
  }

  let shape1;
  let shape2;

  // https://stackoverflow.com/questions/27694616/p5-js-createcanvas-not-defined-error-uncaught-referenceerror
  // https://editor.p5js.org/icm/sketches/BkRHbimhm
  p.setup = () => {
    p.createCanvas(640, 360);
  };

  p.mousePressed = (e) => {
    e.preventDefault();
    if (isDebug) {
      console.log('mousePressed', e);
    }
    // https://p5js.org/reference/#/p5/dist
    for (let index = 0; index < circles.length; index++) {
      const circle = circles[index];

      const distance = p.dist(e.offsetX, e.offsetY, circle.x, circle.y);

      if (distance < radius) {
        circle.active = true;
        circle.color = '#f00';
      } else {
        circle.active = false;
        circle.color = '#000';
      }
    }
  };

  p.mouseDragged = (e) => {
    e.preventDefault();
    if (isDebug) {
      console.log('mouseDragged', e);
    }
    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];
      if (circle.active) {
        circle.x = e.offsetX;
        circle.y = e.offsetY;
        break;
      }
    }
  };

  p.mouseReleased = (e) => {
    e.preventDefault();
    if (isDebug) {
      console.log('mouseReleased', e);
    }
  };

  p.draw = () => {
    p.background(220);

    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];
      p.noStroke();
      p.fill(circle.color);
      p.ellipse(circle.x, circle.y, radius, radius);
    }
  };
};

let isDebug = false;

const myp5 = new p5((p) => {
  mycode(p, isDebug);
});

// myp5.setup();
