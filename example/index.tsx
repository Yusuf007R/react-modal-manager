import 'react-app-polyfill/ie11';

import { createRoot } from 'react-dom/client';
import Example from './example';

const App = () => {
  return <Example />;
};
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
