import {useRef, useLayoutEffect, useEffect, useCallback} from 'react';
import {css} from '@emotion/css';
import p5 from 'p5';
import {useResizeObserver} from '../hooks/useResizeObserver';
// import {default as clamp} from 'clamp';
import * as turf from '@turf/turf';
import 'create-conical-gradient'; // If you use the npm package.

const maxHight = 500;

// https://gist.github.com/shaunlebron/8832585
// https://gist.github.com/codergautam/a574787d79c9809cc2e22d5187e9d02f
const lerp = (start, end, amt) => (1 - amt) * start + amt * end;
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const repeat = (t, m) => clamp(t - Math.floor(t / m) * m, 0, m);

function lerpTheta(a, b, t) {
  const dt = repeat(b - a, 360);
  return lerp(a, a + (dt > 180 ? dt - 360 : dt), t);
}
const Bebop = () => {
  const wrapperRef = useRef();
  const p5sketchDomRef = useRef(null);
  const dimensions = useResizeObserver({ref: wrapperRef});
  const myp5Ref = useRef(null);
  const cnvRef = useRef(null);

  // function predict() {
  //   const width = clamp(window.innerWidth * 0.6, maxHight, window.innerWidth);
  //   const height = dimensions ? dimensions.height : maxHight;
  //   const p = myp5Ref.current;
  //   // https://stackoverflow.com/a/62306198/15972569
  //   //Auxiliar graphics object
  //   // https://p5js.org/reference/#/p5/createGraphics
  //   let resized = p.createGraphics(width, height);

  //   //Draw and scale the canvas content
  //   resized.image(cnvRef.current, 0, 0, width, height);

  //   //Manipulate the new pixels array
  //   resized.loadPixels();
  //   console.log(resized.pixels);
  //   document.querySelector('canvas').remove();
  //   // Draw the 28x28 just for visual feedback
  //   p.image(resized, 0, 0);
  // }

  const handleResize = useCallback((e) => {
    // https://stackoverflow.com/a/67134818/15972569
    if (myp5Ref.current) {
      const p = myp5Ref.current;
      const width = clamp(window.innerWidth * 0.6, 300, 600);
      const height = dimensions ? dimensions.height : maxHight;
      p.resizeCanvas(width, height);
      // predict();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const p5sketchDom = p5sketchDomRef.current;
    const mycode = (p = new p5()) => {
      class Point {
        constructor({x, y, color, active, text}) {
          this.x = x;
          this.y = y;
          this.color = color;
          this.active = active;
          this.text = text;
        }
      }

      // https://p5js.org/examples/instance-mode-instantiation.html
      // https://github.com/processing/p5.js/wiki/Global-and-instance-mode
      const radius = 50;
      const width = clamp(window.innerWidth * 0.6, 300, 600);
      const centerCircle = new Point({
        x: width / 2,
        y: maxHight / 2,
        color: '#9f92ff',
        active: false,
        text: `m`,
      });
      const circles = [
        new Point({
          x: 50,
          y: maxHight / 2,
          color: ' #54d0ff',
          active: false,
          text: `s`,
        }),
        new Point({
          x: width - 50,
          y: maxHight / 2,
          color: '#ff7689',
          active: false,
          text: `e`,
        }),
      ];
      const height = dimensions ? dimensions.height : maxHight;
      p.setup = () => {
        cnvRef.current = p.createCanvas(width, height);
      };
      const mod = (m, n) => {
        return ((m % n) + n) % n;
      };
      const getDeltaAngle = (current, target) => {
        // https://gist.github.com/yomotsu/165ba9ee0dc991cb6db5
        // https://docs.unity3d.com/ja/current/ScriptReference/Mathf.DeltaAngle.html
        const TAU = 2 * Math.PI;
        const a = mod(current - target, TAU);
        const b = mod(target - current, TAU);
        return a < b ? -a : b;
      };

      function conicGradientFill(b, s, e) {
        const angle1 = p.atan2(s.y - b.y, s.x - b.x);
        const angle2 = p.atan2(e.y - b.y, e.x - b.x);
        const diff = getDeltaAngle(angle1, angle2);
        console.log(`diff, angle1, angle2`, diff, angle1, angle2);
        let sAngle = angle1;
        let eAngle = angle2;
        const ctx = p.drawingContext;
        if (diff < 0) {
          sAngle = angle2;
          eAngle = angle1;
        } else {
          if (angle1 > angle2) {
            sAngle = angle2;
            eAngle = angle1;
          }
        }
        const gradient1 = ctx.createConicalGradient(
          width / 2,
          height / 2,
          sAngle,
          eAngle
        );
        gradient1.addColorStop(1, '#42f3e4');
        ctx.fillStyle = gradient1.pattern;
        p.rect(0, 0, width, height);
        const gradient2 = ctx.createConicalGradient(
          width / 2,
          height / 2,
          sAngle,
          eAngle
        );
        gradient2.addColorStop(0.1, '#42f3e4');
        gradient2.addColorStop(1, '#e7f342');
        ctx.fillStyle = gradient2.pattern;
        p.rect(0, 0, width, height);
      }

      function linearGradientFill(x1, y1, x2, y2, color1, color2) {
        const ctx = p.drawingContext;
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        ctx.fillStyle = gradient;
        p.rect(0, 0, width, height);
      }

      const drawArrow = (bx, by, ex, ey) => {
        p.stroke('black');
        p.fill('black');
        p.strokeWeight(3);
        p.line(bx, by, ex, ey);
        const angle = p.atan2(ey - by, ex - bx);
        p.push();

        p.translate(ex, ey);

        p.rotate(angle);

        p.triangle(0, -5, 10, 0, 0, 5);
        p.pop();
      };

      const dragStart = (e) => {
        for (let index = 0; index < circles.length; index++) {
          const circle = circles[index];
          const distance = p.dist(e.offsetX, e.offsetY, circle.x, circle.y);
          if (distance < radius) {
            circle.active = true;
            // circle.color = '#4fa2cc';
          } else {
            circle.active = false;
            // circle.color = '#eee';
          }
        }
      };
      const drag = (e) => {
        for (let i = 0; i < circles.length; i++) {
          const circle = circles[i];
          if (circle.active) {
            circle.x = e.offsetX;
            circle.y = e.offsetY;
            break;
          }
        }
      };

      const dragEnd = (e) => {};

      const calcAngle = (s, e) => {
        const angle = p.atan2(e.y - s.y, e.x - s.x);
        // console.log(angle, p.degrees(angle));
      };

      const calcLine = (s, e) => {
        const sv = p.createVector(s.x, s.y, 0);
        const ev = p.createVector(e.x, e.y, 0);
        drawArrow(sv.x, sv.y, ev.x, ev.y);
      };

      // https://github.com/processing/p5.js/issues/5667
      p.touchStarted = (e) => {
        e.preventDefault();
        dragStart(e);
      };

      p.touchMoved = (e) => {
        e.preventDefault();
        drag(e);
      };

      p.touchEnded = (e) => {
        e.preventDefault();
      };

      p.mousePressed = (e) => {
        e.preventDefault();
        dragStart(e);
      };

      p.mouseDragged = (e) => {
        e.preventDefault();
        drag(e);
      };

      p.mouseReleased = (e) => {
        e.preventDefault();
        dragEnd(e);
      };

      const drawCircle = ({circle}) => {
        p.noStroke();
        p.fill(circle.color);
        p.ellipse(circle.x, circle.y, radius, radius);
        p.fill(0, 0, 0);
        // p.textSize(32);
        // p.textAlign(p.CENTER, p.CENTER);
        // p.text(circle.text, circle.x, circle.y);
      };

      p.draw = () => {
        p.background('#fff');
        // linearGradientFill(0, 0, width, height, 'green', 'cyan');
        // conicGradientFill(centerCircle, circles[0]);
        conicGradientFill(centerCircle, circles[0], circles[1]);
        for (let i = 0; i < circles.length; i++) {
          const circle = circles[i];
          drawCircle({circle});
        }
        drawCircle({circle: centerCircle});
        calcLine(centerCircle, circles[0]);
        calcLine(centerCircle, circles[1]);
        calcAngle(centerCircle, circles[0]);
        calcAngle(centerCircle, circles[1]);
      };
    };
    myp5Ref.current = new p5((instance) => {
      mycode(instance);
    }, p5sketchDom);
    console.log(myp5Ref.current);
    return () => {};
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={css`
        width: 100%;
      `}
    >
      <div
        ref={p5sketchDomRef}
        className={css`
          width: 100%;
          display: block;
          margin: auto;
          height: auto;
          & > canvas {
            /* https://developer.mozilla.org/ja/docs/Web/CSS/clamp */
            width: clamp(300px, 60vw, 100%);
            height: auto;
          }
        `}
      ></div>
    </div>
  );
};

export {Bebop};
