import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';
import Chat from '../components/chat';
import Home from '../components/home';
import Main from '../components/main';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-chat-elements/dist/main.css';

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: new Map(),
      oldPropsUsers: [],
      oldWhispers: [],
      whispers: new Map(),
      selectedChat: 'channel',
      showMain: true,
    };
  }

  static getDerivedStateFromProps(props, state) {
    let newState = { };

    // Handling user joinings / leavings
    if (props.userEvents.length > state.oldPropsUsers.length) {
      const newUser = props.userEvents[props.userEvents.length - 1];

      // Mirroring props to the state (we cannot compare like in legacy Reactjs)
      newState = { oldPropsUsers: props.userEvents, users: new Map(state.users) };

      if (newUser.command === 'Botapichat.UserUpdateEventRequest') {
        let color = randomColor();

        // Checking if color is repeated
        // eslint-disable-next-line no-loop-func
        while ([...state.users].some(([user_id, user]) => user.color === color)) {
          color = randomColor();
        }
        newState.users.set(
          newUser.payload.user_id,
          { ...newUser.payload, color, date: newUser.date },
        );
      } else if (newUser.command === 'Botapichat.UserLeaveEventRequest') {
        // User is leaving, must unset all his data since user_id will not match again
        newState.whispers = new Map(state.whispers);
        const user = newState.users.get(newUser.payload.user_id);
        if (state.selectedChat === user.toon_name) {
          // newState.selectedChat = 'channel';
          newState.showMain = true;
        }
        newState.whispers.delete(user.toon_name);
        newState.users.delete(newUser.payload.user_id);
      }
    }

    // Set new whispers
    if (props.whispersArray.length > state.oldWhispers.length) {
      newState = {
        ...newState,
        oldWhispers: props.whispersArray,
        whispers: new Map(state.whispers),
      };

      const whisper = props.whispersArray[props.whispersArray.length - 1];
      // Whisper can be received or sent
      if (whisper.command !== 'Botapichat.SendWhisperResponse') {
        const user = state.users.get(whisper.payload.user_id);
        const conversation = state.whispers.get(user.toon_name) || [];
        conversation.push(whisper);
        newState.whispers.set(user.toon_name, conversation);
      } else {
        const botWhisper = props.botChat.find(c => c.request_id === whisper.request_id
          && c.command === 'Botapichat.SendWhisperRequest');
        const user = state.users.get(botWhisper.payload.user_id);
        const conversation = state.whispers.get(user.toon_name) || [];
        conversation.push({ ...botWhisper, date: whisper.date, bot: true });
        newState.whispers.set(user.toon_name, conversation);
      }
    }

    return Object.keys(newState).length > 0 ? newState : null;
  }

  onSelectChat(data) {
    this.setState({ selectedChat: data.id || 'channel' });
  }

  changeView() {
    const { showMain } = this.state;
    this.setState({ showMain: !showMain });
  }

  render() {
    const { connection, chat, botChat } = this.props;
    const { users, selectedChat, whispers, showMain } = this.state;
    const connectionData = connection.find(con => con.command === 'Botapichat.ConnectEventRequest') || {};

    // Getting last message from each conversation
    const lastChannelMessage = chat[chat.length - 1];
    const lastChannelMessageUSer = lastChannelMessage && lastChannelMessage.command !== 'Botapichat.SendMessageResponse'
      && lastChannelMessage.command !== 'Botapichat.SendWhisperResponse'
      ? users.get(lastChannelMessage.payload.user_id).toon_name
      : 'You';
    const lastChannelBotChat = lastChannelMessage && (lastChannelMessage.command === 'Botapichat.SendMessageResponse'
      || lastChannelMessage.command === 'Botapichat.SendWhisperResponse')
      && botChat.length > 0 ? botChat[botChat.length - 1].payload.message : '';

    // Setting up the chatlist with channel and whispers
    const chatListData = Object.keys(connectionData).length > 0
      ? [
        {
          avatar: '/static/reforged.png',
          alt: `${connectionData.payload.channel} (${users.size})`,
          title: `${connectionData.payload.channel} (${users.size})`,
          subtitle: chat.length > 0 ? `${lastChannelMessageUSer}: ${lastChannelBotChat || lastChannelMessage.payload.message}` : '',
          date: chat.length > 0 ? lastChannelMessage.date : '',
          unread: 0,
        },
        ...[...whispers].map((whisper) => {
          const sourceUser = users.get(whisper[1][0].payload.user_id);
          return {
            id: sourceUser.toon_name,
            avatar: '/static/reforged.png',
            alt: sourceUser.toon_name,
            title: sourceUser.toon_name,
            subtitle: whisper[1].length > 0 ? whisper[1][whisper[1].length - 1].payload.message : '',
            date: whisper[1].length > 0 ? whisper[1][whisper[1].length - 1].date : '',
            unread: 0,
          };
        }),
      ]
      : [];

    return (
      <div>
        { connection.length === 0 || connection[connection.length - 1].command === 'Botapichat.DisconnectResponse'
          ? <Home />
          : !showMain
            ? (
              <Chat
                chat={selectedChat === 'channel' ? chat : whispers.get(selectedChat)}
                botChat={botChat}
                users={users}
                selectedChat={selectedChat}
                channel={connectionData.payload.channel}
                changeView={() => { this.changeView(); }}
              />
            )
            : (
              <Main
                chatListData={chatListData}
                changeView={() => { this.changeView(); }}
                onSelectChat={(data) => { this.onSelectChat(data); }}
              />
            )
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const props = {
    chat: [],
    userEvents: [],
    botChat: [],
    connection: [],
    whispersArray: [],
  };

  state.messages.forEach(m => {
    switch (m.command) {
      case 'Botapichat.MessageEventRequest': {
        if (m.payload.type === 'Channel' || m.payload.type === 'Emote') {
          props.chat.push(m);
        }

        if (m.payload.type === 'Whisper') {
          props.whispersArray.push(m);
        }

        break;
      }
      case 'Botapichat.UserUpdateEventRequest':
      case 'Botapichat.UserLeaveEventRequest': {
        props.userEvents.push(m);

        break;
      }
      case 'Botapichat.SendWhisperResponse': {
        props.whispersArray.push(m);

        break;
      }
      case 'Botapichat.SendMessageResponse': {
        props.chat.push(m);

        break;
      }
      case 'Botapichat.DisconnectResponse':
      case 'Botapichat.ConnectEventRequest': {
        props.connection.push(m);

        break;
      }
      default: {
        break;
      }
    }
  });

  state.events.forEach(e => {
    switch (e.command) {
      case 'Botapichat.SendWhisperRequest':
      case 'Botapichat.SendMessageRequest': {
        props.botChat.push(e);

        break;
      }
      default:
        break;
    }
  });

  return props;
};

Index.propTypes = {
  chat: PropTypes.array,
  userEvents: PropTypes.array,
  botChat: PropTypes.array,
  connection: PropTypes.array,
};

Index.defaultProps = {
  chat: [],
  userEvents: [],
  botChat: [],
  connection: [],
};

export default connect(mapStateToProps)(Index);
