import React from 'react';
import { connect } from 'react-redux';
import {
  Container, Row, Col, Input, FormGroup,
  Button, Alert,
} from 'reactstrap';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { connectWebSocket as connectWebSocketAction } from '../store/actions';
import '../css/home.css';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = { apiKey: '', alertOn: false };
  }

  componentDidMount() {
    // Loading the key after mounting due to SSR
    const apiKey = localStorage.getItem('apiKey');
    if (apiKey) {
      this.setState({ apiKey });
    }

    // Input autofocus
    this.apiKeyInput.focus();
  }

  changeValue(event, name) {
    this.setState({ [name]: event.target.value });
  }

  connectToBattleNet() {
    const { connectWebSocket } = this.props;
    const { apiKey } = this.state;

    connectWebSocket(apiKey);
    localStorage.setItem('apiKey', apiKey);
  }

  render() {
    const { alertOn, apiKey } = this.state;

    return ([
      <Container className="index__content" key="0">
        <Row>
          <Col>
            <div className="index__title__center__wrapper">
              <img src="/static/reforged.png" alt="Warcraft III Reforged" />
            </div>
          </Col>
        </Row>

        <Row className="index__title__row">
          <Col>
            <div className="index__title__center__wrapper">
              <div className="index__title__wrapper">
                <h1 className="index__title__title">
                  Classic Bot
                </h1>
                <small className="index__title__subtitle">
                  v1.0.0
                </small>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="index__title__center__wrapper">
              <FormGroup>
                <Input
                  type="password"
                  name="apiKey"
                  id="apiKey"
                  value={apiKey}
                  onChange={(event) => { this.changeValue(event, 'apiKey'); }}
                  placeholder="Enter your API key..."
                  autoFocus
                  ref={input => { this.apiKeyInput = input; }}
                />
              </FormGroup>
            </div>
          </Col>
        </Row>

        { alertOn && (
          <Row>
            <Col>
              <div className="index__title__center__wrapper">
                <Alert color="danger" className="index__alert">
                  This is a danger alert — check it out!
                </Alert>
              </div>
            </Col>
          </Row>
        )}

        <Row className="index__button__row">
          <Col>
            <div className="index__title__center__wrapper">
              <Button color="primary" onClick={() => { this.connectToBattleNet(); }}>Connect</Button>
            </div>
          </Col>
        </Row>

        <Row className="index__faq__row">
          <Col>
            <div className="index__title__center__wrapper">
              <Link prefetch href="/about">
                <a>What is Classic Bot?</a>
              </Link>
            </div>
          </Col>
        </Row>

        {/* Sticky footer: https://css-tricks.com/couple-takes-sticky-footer/ */}
        <div className="push" />
      </Container>,

      <footer className="index__footer" key="1">
        <small>
          Warcraft® III: Reforged™ |
          ©2018 Blizzard Entertainment, Inc.. All rights reserved.
          This is not an official product.
        </small>
      </footer>,
    ]);
  }
}

const mapDispatchToProps = dispatch => ({
  connectWebSocket: (apiKey) => dispatch(connectWebSocketAction(undefined, apiKey)),
});

Home.propTypes = {
  connectWebSocket: PropTypes.func.isRequired,
};

export default connect(undefined, mapDispatchToProps)(Home);
