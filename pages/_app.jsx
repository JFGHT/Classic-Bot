import App, { Container } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { Provider } from 'react-redux';
import withReduxStore from '../lib/with-redux-store';

class MyApp extends App {
  render() {
    const { Component, pageProps, reduxStore } = this.props;

    return ([
      <Head key="0">
        <title>Classic Bot</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>,
      <Container key="1" style={{ height: '100%' }}>
        <Provider store={reduxStore}>
          <Component {...pageProps} />
        </Provider>
      </Container>,
    ]);
  }
}

export default withReduxStore(MyApp);
