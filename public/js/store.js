let state = {
  socketId: null,
  localStream: null,
  remoteStream: null,
  screenSharingStream: null,
  allowConnectionsFromStranger: false,
  screenSharingActive: false
};

export const setSocketId = socketId => {
  state = {
    ...state,
    socketId
  };
};

export const setLocalStream = stream => {
  state = {
    ...state,
    localStream: stream
  };
};

export const setAllowConnectionsFromStrangers = allowConnections => {
  state = {
    ...state,
    allowConnectionsFromStranger: allowConnections
  };
};

export const setScreenSharingActive = screenSharingActive => {
  state = {
    ...state,
    screenSharingActive
  };
};

export const setScreenSharingStream = stream => {
  state = {
    ...state,
    screenSharingstream: stream
  };
};

export const setRemoteStream = stream => {
  state = {
    ...state,
    remoteStream: stream
  };
};

export const getState = () => {
  return state;
};
