import App, { Container } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { Provider } from 'react-redux';
import withReduxStore from '../lib/with-redux-store';
import { requestPermission } from '../lib/notifications';

class MyApp extends App {
  componentDidMount() {
    requestPermission();
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;

    return ([
      <Head key="0">
        <title>Classic Bot</title>
        <link rel="shortcut icon" href="/static/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Classic bot is a Chat client made to log in into the classic Battle.net,
            so you can speak with your friends without the need of Warcraft/Starcraft/Diablo game."
        />
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
