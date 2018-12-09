import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers';
import { middleware } from './websocket.middleware';

const middlewares = [middleware, thunkMiddleware];
const defaultState = { messages: [] };
const reducer = combineReducers({ ...reducers });

export const initializeStore = (initialState = defaultState) => (
  createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlewares)))
);
