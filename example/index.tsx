import 'react-app-polyfill/ie11';

import useStore from '../src/state/react';

import { createRoot } from 'react-dom/client';

import store from './store';

const App = () => {
  const [state, setState] = useStore(store);

  return <div onClick={() => setState((state) => state + 1)}>{state}</div>;
};
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
