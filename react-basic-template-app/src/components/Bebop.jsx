import {useRef, useLayoutEffect, useEffect, useCallback} from 'react';
import {css} from '@emotion/css';
import p5 from 'p5';
import {useResizeObserver} from '../hooks/useResizeObserver';
import {default as clamp} from 'clamp';

const Bebop = () => {
  const wrapperRef = useRef();
  const p5sketchDomRef = useRef(null);
  const dimensions = useResizeObserver({ref: wrapperRef});
  const myp5Ref = useRef(null);

  const handleResize = useCallback((e) => {
    // https://stackoverflow.com/a/67134818/15972569
    if (myp5Ref.current) {
      const width = clamp(window.innerWidth * 0.3, 300, window.innerWidth);
      const height = dimensions ? dimensions.height : 300;
      // console.log(width, height);
      myp5Ref.current.resizeCanvas(width, height);
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
      // https://p5js.org/examples/instance-mode-instantiation.html
      // https://github.com/processing/p5.js/wiki/Global-and-instance-mode
      const radius = 25;
      const circles = [
        {x: 50, y: 50, color: ' #eee', active: false},
        {x: 150, y: 50, color: '#eee', active: false},
        {x: 250, y: 50, color: '#eee', active: false},
      ];
      const width = clamp(window.innerWidth * 0.3, 300, window.innerWidth);
      const height = dimensions ? dimensions.height : 300;
      p.setup = () => {
        p.createCanvas(width, height);
      };

      const dragStart = (e) => {
        for (let index = 0; index < circles.length; index++) {
          const circle = circles[index];
          const distance = p.dist(e.offsetX, e.offsetY, circle.x, circle.y);
          if (distance < radius) {
            circle.active = true;
            circle.color = '#4fa2cc';
          } else {
            circle.active = false;
            circle.color = '#eee';
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

      p.draw = () => {
        p.background('#222');
        for (let i = 0; i < circles.length; i++) {
          const circle = circles[i];
          p.noStroke();
          p.fill(circle.color);
          p.ellipse(circle.x, circle.y, radius, radius);
        }
      };
    };
    myp5Ref.current = new p5((instance) => {
      mycode(instance);
    }, p5sketchDom);
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
            width: clamp(300px, 30vw, 100vw);
            height: auto;
          }
        `}
      ></div>
    </div>
  );
};

export {Bebop};
