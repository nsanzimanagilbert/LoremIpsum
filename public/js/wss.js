import * as store from './store';
import * as ui from './ui';
import * as webRTCHandler from './webRTCHandler';
import * as chatConstants from './chatConstants';
import * as strangerUtils from './strangerUtils';

let socketIO = null;
export const registerSocketEvents = socket => {
  socketIO = socket;

  socket.on('connect', () => {
    console.log('successfully connected to wss sever');
    store.setSocketId(socket.id);
    ui.updatePersonalCode(socket.id);
  });
  socket.on('pre-offer', data => {
    webRTCHandler.handlePreOffer(data);
  });

  socket.on('pre-offer-answer', data => {
    webRTCHandler.handlePreOfferAnswer(data);
  });

  socket.on('user-hanged-up', () => {
    webRTCHandler.handleConnectedUserHangedUp();
  });

  socket.on('webRTC-signaling', data => {
    switch (data.type) {
      case chatConstants.webRTCSignaling.OFFER:
        webRTCHandler.handleWebRTCOffer(data);
        break;
      case chatConstants.webRTCSignaling.ANSWER:
        webRTCHandler.handleWebRTCAnswer(data);
        break;
      case chatConstants.webRTCSignaling.ICE_CANDIDATE:
        webRTCHandler.handleWebRTCCandidate(data);
      default:
        return;
    }
  });

  socket.on('stranger-socket-id', data => {
    strangerUtils.connectWithStranger(data);
  });
};

export const sendPreOffer = data => {
  socketIO.emit('pre-offer', data);
};

export const sendPreOfferAnswer = data => {
  socketIO.emit('pre-offer-answer', data);
};

export const sendDataUsingWebRTCSignaling = data => {
  socketIO.emit('webRTC-signaling', data);
};

export const sendUserHangedUp = data => {
  socketIO.emit('user-hanged-up', data);
};

export const changeStrangerConnectionStatus = data => {
  socketIO.emit('stranger-connection-status', data);
};

export const getStrangerSocketId = () => {
  socketIO.emit('get-stranger-socket-id');
};
