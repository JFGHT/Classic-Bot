/* eslint-env jest */

import { shallow } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import Router from 'next/router';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { middleware } from '../store/websocket.middleware';
import Index from '../pages/index';

// Mocking Router
const mockedRouter = { push: () => {}, prefetch: () => {} };
// Running the Router instance
Router.router = mockedRouter;

const middlewares = [thunk, middleware];
const initialState = {
  messages: [],
  events: [],
};
const initialProps = {
  chat: [],
  userEvents: [],
  botChat: [],
  connection: [],
  whispersArray: [],
};

describe('With Enzyme', () => {
  const mockStore = configureStore(middlewares);
  let store;
  let container;

  beforeEach(() => {
    store = mockStore(initialState);
    container = shallow(<Provider store={store}><Index /></Provider>);
  });

  it('Component is being rendered', () => {
    expect(container.length).toEqual(1);
  });

  it('Props as initialized', () => {
    Object.keys(initialProps).forEach(element => {
      expect(container.prop(element)).toEqual(expect.arrayContaining([]));
    });
  });
});

describe('With Snapshot Testing', () => {
  const mockStore = configureStore(middlewares);
  const store = mockStore(initialState);
  it('App starts with header and redux', () => {
    const component = renderer.create(<Provider store={store}><Index /></Provider>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
