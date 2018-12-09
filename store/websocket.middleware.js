import { sendMessage, logIn } from './actions';

let websocket;
let apiKey = '';

export const middleware = ({ dispatch }) => next => action => {
  switch (action.type) {
    // User request to connect
    case 'WEBSOCKET:CONNECT':
      // Configure the object
      websocket = new WebSocket(action.payload.url);
      apiKey = action.payload.apiKey;

      // Attach the callbacks
      websocket.onopen = (event) => dispatch({ type: 'WEBSOCKET:OPEN', payload: event });
      websocket.onclose = (event) => dispatch({ type: 'WEBSOCKET:CLOSE', payload: event });
      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        dispatch({ type: 'WEBSOCKET:MESSAGE', payload: event });

        if (data.command === 'Botapiauth.AuthenticateResponse') {
          // Connect to gateway
          dispatch(sendMessage({ eventType: 'connect', request_id: data.request_id + 1 }));
        } else if (data.command === 'Botapichat.DisconnectResponse') {
          dispatch({ type: 'WEBSOCKET:DISCONNECT' });
        }
      };

      break;
    case 'WEBSOCKET:OPEN':
      dispatch(logIn(apiKey));

      break;
    case 'WEBSOCKET:SEND':
      if (websocket) {
        websocket.send(action.payload);
      }

      break;
    // User request to disconnect
    case 'WEBSOCKET:DISCONNECT':
      websocket.close();

      break;
    default:
      break;
  }

  return next(action);
};
