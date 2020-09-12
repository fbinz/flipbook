import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import WorkArea from "./WorkArea";
import {enableAllPlugins} from "immer";
enableAllPlugins();

ReactDOM.render(
  <React.StrictMode>
    <WorkArea />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
