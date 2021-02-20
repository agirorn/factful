import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { getSocket } from './websocket';

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(<App />, document.getElementById('root'));
getSocket().connect();
