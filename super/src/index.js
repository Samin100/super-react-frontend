import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './Main';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers/rootReducer'
import thunk from 'redux-thunk';
import axios from 'axios';

// creating a store from the root reducer
// also applying the redux-thunk middleware
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)

// ensuring axios sends cookies with requests
axios.defaults.withCredentials = true;

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
serviceWorker.unregister();
