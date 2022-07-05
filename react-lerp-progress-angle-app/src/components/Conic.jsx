import {css} from '@emotion/css';
import {samples, interpolate, formatHex} from 'culori';
import * as d3 from 'd3';
import {transform} from 'framer-motion';

const getDomain = (data, key) => {
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
  colorInterpolator,
}) => {
  const angleInfo = [...samples(colorCount)].reduce(
    (acc, t, idx) => {
      const currentAngle =
        acc.prev + (endRange - startRange - offset) / colorCount;
      acc.list.push({
        color: colorInterpolator(transform([0, 1], [0.1, 0.9])(t)),
        angleFrom: acc.prev,
        angleTo: currentAngle,
      });
      acc.prev = currentAngle;
      return acc;
    },
    {prev: offset, list: []}
  );
  const minAngle = Math.min(...getDomain(angleInfo.list, 'angleFrom'));
  const maxAngle = Math.max(...getDomain(angleInfo.list, 'angleTo'));
  const resultList = [];
  resultList.push(`${jointColor} ${minAngle}deg`);
  for (let i = 0; i < angleInfo.list.length; i++) {
    const item = angleInfo.list[i];
    resultList.push(`${item.color} ${item.angleFrom}deg`);
    resultList.push(`${item.color} ${item.angleTo}deg`);
  }
  resultList.push(`${jointColor} ${maxAngle}deg`);
  return resultList.join(',');
};

const Conic = ({progress}) => {
  const bebopColorInterpolator = (t) => {
    const info = interpolate(['#C2DED1', '#ECE5C7', '#CDC2AE', '#354259'])(t);
    return formatHex(info);
  };
  const bebopConicGradient = makeConicGradient({
    startRange: 0,
    endRange: 320,
    colorCount: 5,
    offset: 20,
    jointColor: bebopColorInterpolator(1),
    colorInterpolator: bebopColorInterpolator
    // jointColor: d3.interpolateRdYlBu(1),
    // colorInterpolator: d3.interpolateRdYlBu,
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
        `}
      ></div>
    </div>
  );
};

export {Conic};
