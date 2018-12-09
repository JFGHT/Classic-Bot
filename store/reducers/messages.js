/**
 * An example reducer to handle WebSocket messages.
 * NB: There is no error handling!
 */
export default (state = [], action) => {
  switch (action.type) {
    case 'WEBSOCKET:MESSAGE': {
      // Assuming that your data is a DOMString in JSON format
      return [...state, { ...JSON.parse(action.payload.data), date: new Date() }];
    } default:
      return state;
  }
};
