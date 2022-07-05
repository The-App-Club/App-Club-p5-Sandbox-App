import {createRoot} from 'react-dom/client';
import {useRef, useLayoutEffect} from 'react';
import {css} from '@emotion/css';
import '@fontsource/inter';
import './styles/index.scss';
import {Bebop} from './components/Bebop';
import p5 from 'p5';
const App = () => {
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
          <Bebop />
        </div>
      </main>
    </div>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
