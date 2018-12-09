import React from 'react';
import {
  Container, Col, Row, Alert, ListGroup,
  ListGroupItem,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/about.css';

const About = () => (
  <Container className="about__container">
    <Row>
      <Col>
        <h3 className="about__whoami__title mr-3">What is Classic Bot?</h3>
        <a
          href="https://github.com/JFGHT"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon
            icon={faGithub}
            size="lg"
          />
        </a>
      </Col>
    </Row>
    <Row className="mb-3">
      <Col>
        Classic bot is a Chat client made to log in into the classic Battle.net,
        so you can speak with your friends without the need of Warcraft/Starcraft/Diablo game.
      </Col>
    </Row>

    <Row>
      <Col>
        <h3>How does it work?</h3>
      </Col>
    </Row>
    <Row className="mb-3">
      <Col>
        It is using the Classic Chat API – Alpha v3 made my Blizzard (
        <a
          href="https://us.forums.blizzard.com/en/warcraft3/u/newclassic-11551/summary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Mark Chandler
        </a>
        ). You need an &nbsp;
        <b>
          API Key
        </b>
        &nbsp;in order to connect to the server.
      </Col>
    </Row>

    <Row>
      <Col>
        <h3>How do I get an API Key?</h3>
      </Col>
    </Row>
    <Row className="mb-2">
      <Col>
        Copied directly from the&nbsp;
        <a
          href="https://s3-us-west-1.amazonaws.com/static-assets.classic.blizzard.com/public/Chat+Bot+API+Alpha+v3.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          official document
        </a>
        :
      </Col>
    </Row>
    <Row className="mb-3">
      <Col>
        <Alert color="info">
          Connect to Battle.net using StarCraft Remastered, Diablo 2 or Warcraft 3 and once in your preferred
          channel (Op or Clan) use the command /register-bot to start the registration process. An email is
          required to be registered to the account and after executing the command an email with activation link
          will be sent to the email on file. The user is required to click on the link to get a valid API Key. Executing
          the command a second time will issue a new API Key and invalidate the old key.
        </Alert>
      </Col>
    </Row>

    <Row>
      <Col>
        <h3>Current API (alpha 3) limitations</h3>
      </Col>
    </Row>
    <Row className="mb-3">
      <Col>
        <ListGroup flush>
          <ListGroupItem>Only chieftains can get API Keys</ListGroupItem>
          <ListGroupItem>Nothing outside the channel can be done (not even whispers)</ListGroupItem>
          <ListGroupItem>Friend list is not available</ListGroupItem>
          <ListGroupItem>Clan list is not available</ListGroupItem>
          <ListGroupItem>Battle.net chat commands are not available</ListGroupItem>
        </ListGroup>
      </Col>
    </Row>

    <Row>
      <Col>
        <h3>To do</h3>
      </Col>
    </Row>
    <Row className="mb-3">
      <Col>
        <ListGroup flush>
          <ListGroupItem>Kick users</ListGroupItem>
          <ListGroupItem>Ban users</ListGroupItem>
          <ListGroupItem>Start a whispering conversation</ListGroupItem>
          <ListGroupItem>Play a sound when whispered or mentioned</ListGroupItem>
        </ListGroup>
      </Col>
    </Row>

    <Row>
      <Col>
        <h3>Technologies used</h3>
      </Col>
    </Row>
    <Row className="mb-3">
      <Col>
        ReactJS, NextJS, Redux, Reactstrap (Bootstrap).
      </Col>
    </Row>

    <Row>
      <Col>
        <h3 className="about__whoami__title mr-3">/Whoami</h3>
        <a
          href="https://github.com/JFGHT"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon
            icon={faGithub}
            size="lg"
          />
        </a>
      </Col>
    </Row>
    <Row className="mb-3">
      <Col>
        I'm a Warcraft III player with passion for technologies. You can usually find me at Clan RoC in Europe server!
      </Col>
    </Row>

    <Row className="mb-3">
      <Col>
        <Link prefetch href="/">
          <a>Go back</a>
        </Link>
      </Col>
    </Row>
  </Container>
);

export default About;
