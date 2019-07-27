import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './main.css';
import AppRouter from './AppRouter';
import * as serviceWorker from './serviceWorker';
require('dotenv').config()

ReactDOM.render(<AppRouter />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// TODO
// Fix buttons DONE
// error handling
// circle placement
// dragging on mobile
// align collumn to middle
// location based error handling
// back buttons on playlist nav bar