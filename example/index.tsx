import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import store from './store';

const App = () => {
  return <div>helloWorld</div>;
};

ReactDOM.render(<App />, document.getElementById('root'));
