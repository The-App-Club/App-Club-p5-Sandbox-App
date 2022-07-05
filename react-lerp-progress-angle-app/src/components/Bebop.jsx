import {default as nr} from 'normalize-range';
import {useRef, useLayoutEffect, useEffect, useCallback} from 'react';
import {css} from '@emotion/css';
import * as BABYLON from 'babylonjs';
import {samples} from 'culori';
import * as d3 from 'd3';
import {transform} from 'framer-motion';

const angle = nr.curry(-180, 180, true, true);

// https://gist.github.com/shaunlebron/8832585
// https://gist.github.com/codergautam/a574787d79c9809cc2e22d5187e9d02f
const lerpAngle = (a, b) => {
  return (t) => {
    return BABYLON.Scalar.LerpAngle(a, b, t);
  };
};

const getDomain = (data, key) => {
  // https://github.com/uber/react-vis/blob/premodern/showcase/misc/voronoi-line-chart.js#L41-L50
  const {min, max} = data.reduce(
    (acc, row) => {
      return {
        min: Math.min(acc.min, row[key]),
        max: Math.max(acc.max, row[key]),
      };
    },
    {min: Infinity, max: -Infinity}
  );
  return [min, max];
};

const makeConicGradient = ({
  startRange,
  endRange,
  colorCount,
  offset,
  jointColor,
}) => {
  const angleList = [...samples(colorCount)].reduce(
    (acc, t, idx) => {
      const currentAngle =
        acc.prev + (endRange - startRange - offset) / colorCount;
      acc.list.push({
        color: d3.interpolateBlues(transform([0, 1], [0.1, 0.9])(t)),
        angleFrom: acc.prev,
        angleTo: currentAngle,
      });
      acc.prev = currentAngle;
      return acc;
    },
    {prev: offset, list: []}
  );
  const minAngle = Math.min(...getDomain(angleList.list, 'angleFrom'));
  const maxAngle = Math.max(...getDomain(angleList.list, 'angleTo'));
  const resultList = [];
  resultList.push(`${jointColor} ${minAngle}deg`);
  angleList.list.map((item, index) => {
    resultList.push(`${item.color} ${item.angleFrom}deg`);
    resultList.push(`${item.color} ${item.angleTo}deg`);
  });
  resultList.push(`${jointColor} ${maxAngle}deg`);
  return resultList.join(',');
};

// const list = samples(6).map((t, index) => {
//   return {
//     t,
//     color: d3.interpolateBlues(t),
//     angleList: []
//   };
// });

// console.log(list)

// const list = samples(6).map((t,index) => {
//   return {
//     t,
//     color: d3.interpolateBlues(t),
//     angle: lerpAngle(0,160)(t),
//   };
// });

// console.log(d3.pairs(list));

let data = {
  a: -180,
  b: -30,
};

// data = {
//   a: 30,
//   b: 180,
// };

// data = {
//   a: -50,
//   b: 220,
// };

// console.log(
//   `progress`,
//   progress,
//   data.a,
//   data.b,
//   angle.wrap(data.a),
//   angle.wrap(data.b),
//   lerpAngle(angle.wrap(data.a), angle.wrap(data.b))(progress)
// );
// const lerpedAngle = lerpAngle(
//   angle.wrap(data.a),
//   angle.wrap(data.b)
// )(progress);

const Bebop = ({progress}) => {
  const bebopConicGradient = makeConicGradient({
    startRange: 0,
    endRange: 320,
    colorCount: 5,
    offset: 20,
    jointColor: d3.interpolateBlues(1),
    colorInterpolator: d3.interpolateBlues,
  });
  return (
    <div
      className={css`
        width: 200px;
        height: 200px;
      `}
    >
      <div
        className={css`
          --rotation: ${progress}deg;
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
          background: conic-gradient(${bebopConicGradient});
          /* background: conic-gradient(
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
          ); */
        `}
      ></div>
    </div>
  );
};

export {Bebop};
