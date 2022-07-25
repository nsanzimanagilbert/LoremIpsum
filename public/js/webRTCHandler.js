import * as wss from './wss';
import * as chatConstants from './chatConstants';
import * as ui from './ui';
import * as store from './store';

let connectedUserDetails;
let peerConnection;
let dataChannel;

const defaultConstraints = {
  audio: true,
  video: true
};
const configuration = {
  iceServers: [
    {
      urls: 'stun:stun.1.google.com:13902'
    }
  ]
};
export const getLocalPreview = () => {
  navigator.mediaDevices
    .getUserMedia(defaultConstraints)
    .then(stream => {
      console.log('Video working...');

      ui.updateLocalVideo(stream);
      store.setLocalStream(stream);
    })
    .catch(err => {
      console.log(err);
    });
};

const createPeerConnection = () => {
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

  //Adding our strea,to the connection
  if (
    connectedUserDetails.callType === chatConstants.callType.VIDEO_PERSONAL_CODE
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

  if (
    callType === chatConstants.callType.CHAT_PERSONAL_CODE ||
    callType === chatConstants.callType.VIDEO_PERSONAL_CODE
  ) {
    const data = {
      callType,
      calleePersonalCode
    };
    ui.showCallingDialog(callingDialogRejectCallHandler);
    wss.sendPreOffer(data);
  }
};

export const handlePreOffer = data => {
  const { callType, callerSocketId } = data;
  connectedUserDetails = {
    socketId: callerSocketId,
    callType
  };

  if (
    callType === chatConstants.callType.CHAT_PERSONAL_CODE ||
    callType === chatConstants.callType.VIDEO_PERSONAL_CODE
  ) {
    ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler);
  }
};

const acceptCallHandler = () => {
  createPeerConnection();
  sendPreOfferAnswer(chatConstants.preOfferAnswer.CALL_ACCEPTED);
  ui.showCallElements(connectedUserDetails.callType);
};

const rejectCallHandler = () => {
  sendPreOfferAnswer(chatConstants.preOfferAnswer.CALL_REJECTED);
};
const callingDialogRejectCallHandler = () => {
  console.log('Rejecting call...');
};

const sendPreOfferAnswer = preOfferAnswer => {
  const data = {
    callerSocketId: connectedUserDetails.socketId,
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
  }
  if (preOfferAnswer === chatConstants.preOfferAnswer.CALL_UNAVAILABLE) {
    //Show that callee is not found
    ui.showInfoDialog(preOfferAnswer);
  }
  if (preOfferAnswer === chatConstants.preOfferAnswer.CALL_REJECTED) {
    //Show that callee is not found
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
