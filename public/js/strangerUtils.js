import * as wss from './wss';
import * as webRTCHandler from './webRTCHandler';
import * as ui from './ui';

let strangerCallType;
export const changeStrangerConnectionStatus = status => {
  const data = { status };
  wss.changeStrangerConnectionStatus(data);
};

export const getStrangerSocketIdAndConnect = callType => {
  strangerCallType = callType;
  wss.getStrangerSocketId();
};

export const connectWithStranger = data => {
  if (data.randomStrangerSocketId) {
    webRTCHandler.sendPreOffer(strangerCallType, data.randomStrangerSocketId);
  } else {
    //No User is available for connection
    ui.showNoStrangerAvailable();
  }
};
