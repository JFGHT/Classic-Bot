export default (state = {}, action) => {
  switch (action.type) {
    case 'WEBSOCKET:OPEN': {
      const { isTrusted, timeStamp, type } = action.payload;
      const data = {
        isTrusted,
        timeStamp,
        type,
      };

      return ({ ...state, ...data, date: new Date() });
    } default:
      return state;
  }
};
