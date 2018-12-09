/**
 * An example reducer to handle WebSocket messages.
 * NB: There is no error handling!
 */
export default (state = [], action) => {
  switch (action.type) {
    case 'WEBSOCKET:SEND':
    case 'WEBSOCKET:LOGIN':
    case 'WEBSOCKET:LOGOUT':
      // Assuming that your data is a DOMString in JSON format
      return [...state, { ...JSON.parse(action.payload), date: new Date() }];
    default:
      return state;
  }
};
