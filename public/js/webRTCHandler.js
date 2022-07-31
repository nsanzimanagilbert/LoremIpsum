import * as wss from './wss';
import * as chatConstants from './chatConstants';
import * as ui from './ui';
import * as store from './store';

let connectedUserDetails;
let peerConnection;
let dataChannel;
let turnServers = [];

export const setTURNServers = servers => {
  turnServers = servers;
};
const defaultConstraints = {
  audio: true,
  video: true
};
// const configuration = {
//   iceServers: [
//     {
//       urls: 'stun:stun.1.google.com:13902'
//     }
//   ]
// };
export const getLocalPreview = () => {
  navigator.mediaDevices
    .getUserMedia(defaultConstraints)
    .then(stream => {
      ui.updateLocalVideo(stream);
      store.setCallState(chatConstants.callState.CALL_AVAILABLE);
      store.setLocalStream(stream);
    })
    .catch(err => {
      console.log(err);
    });
};

const createPeerConnection = () => {
  const configuration = {
    iceServers: [...turnServers, { url: 'stun:stun.1und1.de:3478' }],
    iceTransportPolicy: 'relay'
  };
  peerConnection = new RTCPeerConnection(configuration);

  dataChannel = peerConnection.createDataChannel('chat');

  peerConnection.ondatachannel = event => {
    const dataChannel = event.channel;

    dataChannel.onopen = () => {
      console.log('Peer connection is ready to receive data');
    };

    dataChannel.onmessage = event => {
      console.log('Message came from data channel');
      const message = JSON.parse(event.data);
      ui.appendMessage(message);
    };
  };

  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      //Send our ICE candidate to other peer
      wss.sendDataUsingWebRTCSignaling({
        connectedUserSocketId: connectedUserDetails.socketId,
        type: chatConstants.webRTCSignaling.ICE_CANDIDATE,
        candidate: event.candidate
      });
    }
  };
  peerConnection.onconnectionstatechange = event => {
    if (peerConnection.connectionState === 'connected') {
      console.log('successfully connected with other peer');
    }
  };

  //receiving Tracks
  const remoteStream = new MediaStream();
  store.setRemoteStream(remoteStream);
  ui.updateRemoteVideo(remoteStream);

  peerConnection.ontrack = event => {
    remoteStream.addTrack(event.track);
  };

  //Adding our stream to the connection
  if (
    connectedUserDetails.callType ===
      chatConstants.callType.VIDEO_PERSONAL_CODE ||
    connectedUserDetails.callType === chatConstants.callType.VIDEO_STRANGER
  ) {
    const localStream = store.getState().localStream;
    for (const track of localStream.getTracks()) {
      peerConnection.addTrack(track, localStream);
    }
  }
};

export const sendMessageUsingDataChannel = message => {
  const stringifiedMessage = JSON.stringify(message);
  dataChannel.send(stringifiedMessage);
};
export const sendPreOffer = (callType, calleePersonalCode) => {
  connectedUserDetails = {
    callType,
    socketId: calleePersonalCode
  };
  ///accept calls used with personal code
  if (
    callType === chatConstants.callType.CHAT_PERSONAL_CODE ||
    callType === chatConstants.callType.VIDEO_PERSONAL_CODE
  ) {
    const data = {
      callType,
      calleePersonalCode
    };
    ui.showCallingDialog(callingDialogRejectCallHandler);
    store.setCallState(chatConstants.callState.CALL_UNAVAILABLE);
    wss.sendPreOffer(data);
  }

  ////Accept stranger calls...
  if (
    callType === chatConstants.callType.CHAT_STRANGER ||
    callType === chatConstants.callType.VIDEO_STRANGER
  ) {
    const data = {
      callType,
      calleePersonalCode
    };
    store.setCallState(chatConstants.callState.CALL_UNAVAILABLE);
    wss.sendPreOffer(data);
  }
};

export const handlePreOffer = data => {
  const { callType, callerSocketId } = data;
  if (!checkCallPossibility()) {
    return sendPreOffer(
      chatConstants.preOfferAnswer.CALL_UNAVAILABLE,
      callerSocketId
    );
  }
  connectedUserDetails = {
    socketId: callerSocketId,
    callType
  };

  store.setCallState(chatConstants.callState.CALL_UNAVAILABLE);

  if (
    callType === chatConstants.callType.CHAT_PERSONAL_CODE ||
    callType === chatConstants.callType.VIDEO_PERSONAL_CODE
  ) {
    ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler);
  }

  if (
    callType === chatConstants.callType.CHAT_STRANGER ||
    callType === chatConstants.callType.VIDEO_STRANGER
  ) {
    createPeerConnection();
    sendPreOfferAnswer(chatConstants.preOfferAnswer.CALL_ACCEPTED);
    ui.showCallElements(connectedUserDetails.callType);
  }
};

const acceptCallHandler = () => {
  createPeerConnection();
  sendPreOfferAnswer(chatConstants.preOfferAnswer.CALL_ACCEPTED);
  ui.showCallElements(connectedUserDetails.callType);
};

const rejectCallHandler = () => {
  setIncomingCallsAvailable();
  sendPreOfferAnswer();
  sendPreOfferAnswer(chatConstants.preOfferAnswer.CALL_REJECTED);
};
const callingDialogRejectCallHandler = () => {
  const data = {
    connectedUserSocketId: connectedUserDetails.socketId
  };
  closePeerConnectionAndResetState();
  wss.sendUserHangedUp(data);
};

const sendPreOfferAnswer = (preOfferAnswer, callerSocketId = null) => {
  const socketId = callerSocketId
    ? callerSocketId
    : connectedUserDetails.socketId;
  const data = {
    callerSocketId: socketId,
    preOfferAnswer
  };
  ui.removeCallDialogs();
  wss.sendPreOfferAnswer(data);
};

export const handlePreOfferAnswer = data => {
  const { preOfferAnswer } = data;
  ui.removeCallDialogs();
  if (preOfferAnswer === chatConstants.preOfferAnswer.CALLEE_NOT_FOUND) {
    //Show that callee is not found
    ui.showInfoDialog(preOfferAnswer);
    setIncomingCallsAvailable();
  }
  if (preOfferAnswer === chatConstants.preOfferAnswer.CALL_UNAVAILABLE) {
    //Show that callee is not found
    setIncomingCallsAvailable();
    ui.showInfoDialog(preOfferAnswer);
  }
  if (preOfferAnswer === chatConstants.preOfferAnswer.CALL_REJECTED) {
    //Show that callee is not found
    setIncomingCallsAvailable();
    ui.showInfoDialog(preOfferAnswer);
  }
  if (preOfferAnswer === chatConstants.preOfferAnswer.CALL_ACCEPTED) {
    //Show that call is accepted. Send WebRTC Offer
    ui.showCallElements(connectedUserDetails.callType);
    createPeerConnection();
    sendWebRTCOffer();
  }
};

const sendWebRTCOffer = async () => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  wss.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: chatConstants.webRTCSignaling.OFFER,
    offer: offer
  });
};
export const handleWebRTCOffer = async data => {
  await peerConnection.setRemoteDescription(data.offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  wss.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: chatConstants.webRTCSignaling.ANSWER,
    answer: answer
  });
};

export const handleWebRTCAnswer = async data => {
  console.log('handling webrtC answer...');
  await peerConnection.setRemoteDescription(data.answer);
};

export const handleWebRTCCandidate = async data => {
  try {
    await peerConnection.addIceCandidate(data.candidate);
  } catch (err) {
    console.log('Error occured when trying to add received ICE candidate', err);
  }
};

let screenSharingStream;

export const switchBetweenCameraAndScreenSharing = async screenSharingActive => {
  if (screenSharingActive) {
    const localStream = store.getState().localStream;
    const senders = peerConnection.getSenders();
    const sender = senders.find(sender => {
      return sender.track.kind === localStream.getVideoTracks()[0].kind;
    });
    if (sender) {
      sender.replaceTrack(localStream.getVideoTracks()[0]);
    }

    //Stop screen sharing stream
    // store
    //   .getState()
    //   .screenSharingStream.getTracks()
    //   .forEach(track => track.stop());

    store.setScreenSharingActive(!screenSharingActive);
    ui.updateLocalVideo(localStream);
  } else {
    console.log('Switching for screen sharing...');
    try {
      screenSharingStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });
      store.setScreenSharingStream(screenSharingStream);
      //Replace track which sender is sending
      const senders = peerConnection.getSenders();
      const sender = senders.find(sender => {
        return (
          sender.track.kind === screenSharingStream.getVideoTracks()[0].kind
        );
      });
      if (sender) {
        sender.replaceTrack(screenSharingStream.getVideoTracks()[0]);
      }
      store.setScreenSharingActive(!screenSharingActive);
      ui.updateLocalVideo(screenSharingStream);
    } catch (err) {
      console.log('eror occured when trying to send screen', err);
    }
  }
};

//HangUp

export const handleHungUp = () => {
  const data = {
    connectedUserSocketId: connectedUserDetails.socketId
  };
  wss.sendUserHangedUp(data);
  closePeerConnectionAndResetState();
};

export const handleConnectedUserHangedUp = () => {
  closePeerConnectionAndResetState();
};

const closePeerConnectionAndResetState = () => {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }

  if (
    connectedUserDetails.callType ===
      chatConstants.callType.VIDEO_PERSONAL_CODE ||
    connectedUserDetails.callType === chatConstants.callType.VIDEO_STRANGER
  ) {
    store.getState().localStream.getVideoTracks()[0].enabled = true;
    store.getState().localStream.getAudioTracks()[0].enabled = true;
  }

  ui.updateUIAfterHangUp(connectedUserDetails.callType);
  setIncomingCallsAvailable();
  connectedUserDetails = null;
};

const checkCallPossibility = callType => {
  const callState = store.getState().callState;
  if (callState === chatConstants.callState.CALL_AVAILABLE) {
    return true;
  }
  if (
    (callType === chatConstants.callType.VIDEO_PERSONAL_CODE ||
      callType === chatConstants.callType.VIDEO_STRANGER) &&
    callState === chatConstants.callState.CALL_AVAILABLE_ONLY_CHAT
  ) {
    return false;
  }
  return false;
};

const setIncomingCallsAvailable = () => {
  const localStream = store.getState().localStream;
  if (localStream) {
    store.setCallState(chatConstants.callState.CALL_AVAILABLE);
  } else {
    store.setCallState(chatConstants.callState.CALL_AVAILABLE_ONLY_CHAT);
  }
};
