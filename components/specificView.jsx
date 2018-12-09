import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import { ChatItem } from 'react-chat-elements';
import Header from './header';

const SpecificView = ({ title, subTitle, onBack, selectedChat, users }) => ([
  <Container key="0" className="chat__header">
    <Header
      title={title}
      subTitle={subTitle}
      onBack={() => { onBack(); }}
      selectedChat={selectedChat}
    />
  </Container>,
  <Container key="1" className="chat__content">
    {[...users].map(([key, user]) => (
      <ChatItem
        key={key}
        avatar="/static/reforged.png"
        alt={user.toon_name}
        title={user.toon_name}
        date={user.date}
        onClick={(a) => { console.log(a); }}
      />
    ))}
  </Container>,
]);

SpecificView.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  onBack: PropTypes.func,
  selectedChat: PropTypes.string.isRequired,
  users: PropTypes.instanceOf(Map).isRequired,
};

SpecificView.defaultProps = {
  subTitle: '',
  onBack: () => {},
};

export default SpecificView;
