import {useRef, useLayoutEffect, useEffect, useCallback} from 'react';
import {css} from '@emotion/css';

// https://gist.github.com/shaunlebron/8832585
// https://gist.github.com/codergautam/a574787d79c9809cc2e22d5187e9d02f
const lerp = (start, end, amt) => (1 - amt) * start + amt * end;
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const repeat = (t, m) => clamp(t - Math.floor(t / m) * m, 0, m);

function lerpTheta(a, b, t) {
  const dt = repeat(b - a, 360);
  return lerp(a, a + (dt > 180 ? dt - 360 : dt), t);
}
const Bebop = ({rotation}) => {
  // console.log(`rotation`, rotation);
  return (
    <div
      className={css`
        width: 200px;
        height: 200px;
      `}
    >
      <div
        className={css`
          --rotation: ${rotation}deg;
          display: inline-block;
          width: 100%;
          height: 100%;
          @media (prefers-reduced-motion: no-preference) {
            -webkit-transform: rotate(var(--rotation));
            transform: rotate(var(--rotation));
          }
          ::before {
            content: '';
            display: block;
            padding-top: 100%;
          }
          background: conic-gradient(
            rgb(242, 174, 28) 20deg,
            rgb(255, 255, 255) 20deg,
            rgb(255, 255, 255) 73.1591deg,
            rgb(76, 112, 49) 73.1591deg,
            rgb(76, 112, 49) 135.891deg,
            rgb(255, 240, 203) 135.891deg,
            rgb(255, 240, 203) 200deg,
            rgb(175, 122, 31) 200deg,
            rgb(175, 122, 31) 253.159deg,
            rgb(244, 150, 25) 253.159deg,
            rgb(244, 150, 25) 315.891deg,
            rgb(242, 174, 28) 315.891deg
          );
        `}
      ></div>
    </div>
  );
};

export {Bebop};
