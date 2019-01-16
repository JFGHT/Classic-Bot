import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MessageList, Input } from 'react-chat-elements';
import { Container } from 'reactstrap';
import { isPermissionGranted, newNotification } from '../lib/notifications';
import { sendMessage as sendMessageAction } from '../store/actions';
import Header from './header';
import SpecificView from './specificView';
import '../css/chat.css';

class Chat extends React.Component {
  // Format a message for the MessageList component
  static formatMessage(user, message, props) {
    const foundBot = !user && props.botChat.find(
      bCMessage => bCMessage.request_id === message.request_id,
    );

    return {
      title: user ? user.toon_name : (!foundBot ? '*Player left channel*' : ''),
      titleColor: user ? user.color : (!foundBot ? '#dcdcdc' : ''),
      request_id: message.request_id,
      date: message.date,
      type: 'text',
      position: user || (!user && !foundBot) ? 'left' : 'right',
      text: user || (!user && !foundBot)
        ? message.payload.message
        : foundBot.payload.message,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      chatMessage: '',
      chatMessages: [],
      oldPropsChat: [],
      oldSelectedChat: '',
      showSpecificView: false,
    };
  }

  // ToDo: Fix logic bugs here
  static getDerivedStateFromProps(props, state) {
    let newState = { };

    if (props.selectedChat === state.oldSelectedChat
        && props.chat.length > state.oldPropsChat.length && (state.oldPropsChat.length === 0
          || state.oldPropsChat[0].request_id === props.chat[0].request_id)) {
      // Updating same chat
      newState = {
        ...newState,
        oldPropsChat: [...props.chat],
        chatMessages: [...state.chatMessages],
      };

      const message = props.chat[props.chat.length - 1];
      const user = props.users.get(!message.bot ? message.payload.user_id : undefined);
      const formattedMessage = Chat.formatMessage(user, message, props);

      newState.chatMessages.push(formattedMessage);
    } else if (props.selectedChat !== state.oldSelectedChat) {
      // Adding new chat
      newState = {
        ...newState,
        oldPropsChat: [...props.chat],
        oldSelectedChat: props.selectedChat,
      };

      newState.chatMessages = props.chat.map(
        message => Chat.formatMessage(props.users.get(message.payload.user_id), message, props),
      );
    }

    return Object.keys(newState).length > 0 ? newState : null;
  }

  componentDidUpdate(prevProps) {
    const { chat, selectedChat } = this.props;
    const { chatMessages } = this.state;
    const message = chatMessages[chatMessages.length - 1];

    /**
     * New notification when:
     * - It's a whisper and theres no focus on the tab.
     * - It's a whisper but we are not in the correct chat.
     * - It's a mention (the message in channel has '@botname')
     */
    // ToDo: Fix the 3rd case. It's not message.title (message owner), it's the actual bot's name.
    if (selectedChat && selectedChat !== prevProps.selectedChat && isPermissionGranted()
      && chat.length > prevProps.chat && ((selectedChat !== 'channel' && !document.hasFocus())
        || (document.hasFocus() && selectedChat !== message.title)
        || (selectedChat === 'channel' && !document.hasFocus() && message.text.indexOf(`@${message.title}`) !== -1))
    ) {
      newNotification('Whisper', `${message.title}: ${message.text}`);
    }
  }

  changeValue(event, name) {
    this.setState({ [name]: event.target.value });
  }

  sendInput(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      this.sendMessage(e);
    }
  }

  sendMessage(event) {
    event.preventDefault();

    const { sendMessage, selectedChat, users } = this.props;
    const { chatMessage } = this.state;

    if (chatMessage) {
      sendMessage(
        { eventType: selectedChat === 'channel' ? 'sendMessage' : 'sendWhisper' },
        [
          chatMessage,
          selectedChat === 'channel'
            ? undefined
            : [...users].find(([user_id, user]) => user.toon_name === selectedChat)[0]],
      );

      this.inputElement.clear();
    }
  }

  changeChatView() {
    const { showSpecificView } = this.state;
    this.setState({ showSpecificView: !showSpecificView });
  }

  render() {
    const { chatMessages, showSpecificView } = this.state;
    const { selectedChat, channel, changeView, users } = this.props;

    return (!showSpecificView
      ? [
        <Container key="0" className="chat__header">
          <Header
            title={selectedChat === 'channel' ? channel : selectedChat}
            subTitle={selectedChat === 'channel' ? users.size.toString() : ''}
            onBack={() => { changeView(); }}
            selectedChat={selectedChat}
            onTitleClick={() => { this.changeChatView(); }}
          />
        </Container>,
        <Container key="1" className="chat__content">
          <MessageList
            className="message-list chat__message__list"
            toBottomHeight="100%"
            dataSource={chatMessages}
            lockable
          />
        </Container>,
        <Container key="2" className="chat__footer">
          <form onSubmit={(event) => this.sendMessage(event)} className="chat__form">
            <Input
              placeholder="Message"
              ref={(inputElement) => { this.inputElement = inputElement; }}
              // multiline
              autofocus
              rightButtons={
                <input className="chat__send__button" type="submit" value="" />
              }
              onChange={(event) => this.changeValue(event, 'chatMessage')}
              onKeyDown={(e) => this.sendInput(e)}
              className="chat__input"
            />
          </form>
        </Container>,
      ]
      : (
        <SpecificView
          title={selectedChat === 'channel' ? channel : selectedChat}
          subTitle={selectedChat === 'channel' ? users.size.toString() : ''}
          onBack={() => { this.changeChatView(); }}
          selectedChat={selectedChat}
          users={users}
        />
      )
    );
  }
}

const mapDispatchToProps = dispatch => ({
  sendMessage: (standardData, payload) => dispatch(sendMessageAction(standardData, payload)),
});

Chat.propTypes = {
  chat: PropTypes.array.isRequired,
  botChat: PropTypes.array.isRequired,
  users: PropTypes.instanceOf(Map).isRequired,
  selectedChat: PropTypes.string.isRequired,
  sendMessage: PropTypes.func.isRequired,
  channel: PropTypes.string.isRequired,
  changeView: PropTypes.func.isRequired,
};

export default connect(undefined, mapDispatchToProps)(Chat);
