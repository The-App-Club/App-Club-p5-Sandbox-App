import {createRoot} from 'react-dom/client';
import {useRef, useLayoutEffect, useState} from 'react';
import {css} from '@emotion/css';
import '@fontsource/inter';
import './styles/index.scss';
import {Conic} from './components/Conic';
import p5 from 'p5';
import {Slider} from '@mui/material';

const App = () => {
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    setProgress(e.target.value);
  };

  return (
    <div
      className={css`
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      `}
    >
      <header>
        <h1>Cowboy Bebop Sketch</h1>
        <div
          className={css`
            width: 100%;
            padding: 3rem;
          `}
        >
          <Slider
            defaultValue={0}
            min={0}
            max={360}
            step={1}
            value={progress}
            aria-label="Default"
            valueLabelDisplay="auto"
            onChange={handleChange}
          />
        </div>
      </header>
      <main>
        <div
          className={css`
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            margin: 0 auto;
            max-width: 60rem;
            padding: 1rem;
            @media screen and (max-width: 768px) {
              max-width: 100%;
              padding: 5px;
            }
          `}
        >
          <Conic progress={progress} />
        </div>
      </main>
    </div>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
