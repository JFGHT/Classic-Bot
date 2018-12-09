import React from 'react';
import PropTypes from 'prop-types';
import { ChatList } from 'react-chat-elements';
import { Container } from 'reactstrap';
import Header from './header';
import '../css/main.css';

class Main extends React.Component {
  render() {
    const { chatListData, changeView, onSelectChat } = this.props;

    return ([
      <Container key="0" className="main__container__header">
        <Header title="Classic Bot" onBack={() => { changeView(); }} />
      </Container>,
      <Container key="1" className="main__container__chat__list">
        <ChatList
          className="chat-list"
          dataSource={chatListData}
          onClick={(data) => {
            onSelectChat(data);
            changeView(data);
          }}
        />
      </Container>,
    ]);
  }
}

Main.propTypes = {
  chatListData: PropTypes.array.isRequired,
  changeView: PropTypes.func.isRequired,
  onSelectChat: PropTypes.func.isRequired,
};

export default Main;
