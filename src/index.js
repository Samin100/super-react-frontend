import React from 'react';
import ReactDOM from 'react-dom';
import '../node_modules/react-grid-layout/css/styles.css'
import '../node_modules/react-resizable/css/styles.css'
import './index.css';
import Main from './Main';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reducers/rootReducer'
import thunk from 'redux-thunk';
import axios from 'axios';
import * as Sentry from '@sentry/browser';


// if this is production we init sentry error tracking
if (process.env.REACT_APP_ENV === 'production') {
  Sentry.init({ dsn: "https://3cc69e0e28454821a8c7514032dae562@sentry.io/2196194" });
}
// creating a store from the root reducer
// also applying the redux-thunk middleware
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

// ensuring axios sends cookies with requests
axios.defaults.withCredentials = true;

// logging the API server's endpoint
// if the API URL exists in the environment, we use it
export const API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : 'http://localhost:8000'
console.log(`Using API URL: ${API_URL}`)

// wrapping the root component in a react-redux Provider and passing it a store
const RootComponent = (
  <Provider store={store}>
    <Main />
  </Provider>
);

ReactDOM.render(RootComponent, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
