import * as chatConstants from './chatConstants';
let state = {
  socketId: null,
  localStream: null,
  remoteStream: null,
  screenSharingStream: null,
  allowConnectionsFromStranger: false,
  screenSharingActive: false,
  callState: chatConstants.callState.CALL_AVAILABLE_ONLY_CHAT
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

export const setCallState = callState => {
  state = {
    ...state,
    callState
  };
};
export const getState = () => {
  return state;
};
