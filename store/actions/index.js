import * as classicApi from 'classic-bnet-javascript-api';

/**
 * An example action creator to request a WebSocket connection.
 */
export const connectWebSocket = (url = 'wss://connect-bot.classic.blizzard.com/v1/rpc/chat', apiKey) => ({
  type: 'WEBSOCKET:CONNECT',
  payload: { url, apiKey },
});

export const sendMessage = ({ eventType, request_id }, payload = []) => (dispatch, getState) => {
  const { messages } = getState();

  let id;
  if (request_id) {
    id = request_id;
  } else {
    id = messages.length > 0 ? messages[messages.length - 1].request_id + 1 : 0;
  }

  dispatch({
    type: 'WEBSOCKET:SEND',
    payload: classicApi[eventType](
      id,
      // ToDo: refactor bnet api library in order to accept object as parameter
      ...payload,
    ),
  });
};

export const logIn = apiKey => (dispatch, getState) => {
  const { events } = getState();
  const id = events.length > 0 ? events[events.length - 1].request_id : 0;

  const authPayload = classicApi.authenticate(
    id,
    apiKey,
  );

  dispatch({
    type: 'WEBSOCKET:SEND',
    payload: authPayload,
  });
};

export const logOut = () => ({
  type: 'WEBSOCKET:SEND',
  payload: classicApi.disconnect(),
});

export const disconnectWebSocket = () => ({ type: 'WEBSOCKET:DISCONNECT' });
