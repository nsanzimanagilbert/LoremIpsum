import * as chatConstants from './chatConstants';
import * as elements from './elements';
export const updatePersonalCode = personalCode => {
  const personalCodeParagraph = document.getElementById(
    'personalCodeParagraph'
  );
  personalCodeParagraph.value = personalCode;
};

export const updateLocalVideo = stream => {
  const localVideo = document.querySelector('.local_video');
  if (localVideo) {
    localVideo.srcObject = stream;
    localVideo.addEventListener('loadedmetadata', () => {
      localVideo.play();
    });
  }
};

export const updateRemoteVideo = stream => {
  const remoteVideo = document.querySelector('.remote_video');
  if (remoteVideo) {
    remoteVideo.srcObject = stream;
    remoteVideo.addEventListener('loadedmetadata', () => {
      remoteVideo.play();
    });
  }
};

export const showIncomingCallDialog = (
  callType,
  acceptCallHandler,
  rejectCallHandler
) => {
  const callTypeInfo =
    callType === chatConstants.callType.CHAT_PERSONAL_CODE ? 'Chat' : 'Video';

  const incomingCallDialog = elements.getIncomingCallDialog(
    callTypeInfo,
    acceptCallHandler,
    rejectCallHandler
  );
  const dialog = document.getElementById('dialog');
  if (dialog) {
    dialog.querySelectorAll('*').forEach(dialog => dialog.remove());

    dialog.appendChild(incomingCallDialog);
  }
};

export const showCallingDialog = rejectCallHandler => {
  const callingDialog = elements.getCallingDialog(rejectCallHandler);

  const dialog = document.getElementById('callDialogWrapper');
  if (dialog) {
    dialog.querySelectorAll('*').forEach(dialog => dialog.remove());

    dialog.appendChild(callingDialog);
  }
};

export const showInfoDialog = preOfferAnswer => {
  let infoDialog = null;
  if (preOfferAnswer === chatConstants.preOfferAnswer.CALL_REJECTED) {
    infoDialog = elements.getInfoDialog(
      'call rejected',
      'callee rejected your call'
    );
  }
  if (preOfferAnswer === chatConstants.preOfferAnswer.CALLEE_NOT_FOUND) {
    infoDialog = elements.getInfoDialog(
      'callee not found',
      'Please check code Again.'
    );
  }
  if (preOfferAnswer === chatConstants.preOfferAnswer.CALL_UNAVAILABLE) {
    infoDialog = elements.getInfoDialog(
      'Callee is not possible',
      'Callee could be on another call'
    );
  }

  if (infoDialog) {
    const dialog = document.getElementById('callDialogWrapper');
    dialog.appendChild(infoDialog);

    setTimeout(() => {
      removeCallDialogs();
    }, [4000]);
  }
};

export const removeCallDialogs = () => {
  const dialog = document.getElementById('callDialogWrapper');
  if (dialog) {
    dialog.querySelectorAll('*').forEach(dialog => dialog.remove());
  }
};

export const showCallElements = callType => {
  if (callType === chatConstants.callType.CHAT_PERSONAL_CODE) {
    showChatCallElements();
  }
  if (callType === chatConstants.callType.VIDEO_PERSONAL_CODE) {
    showVideoCallElements();
  }
};

const showChatCallElements = () => {
  const finishChatBtnsContainer = document.getElementById(
    'finishChatBtnsContainer'
  );
  if (finishChatBtnsContainer) {
    showElement(finishChatBtnsContainer);
  }

  const newMessageInput = document.getElementById('new_message');
  if (newMessageInput) {
    showElement(newMessageInput);
  }
  disableDashboard();
};

const showVideoCallElements = () => {
  const callBtns = document.getElementById('callBtns');
  if (callBtns) {
    showElement(callBtns);
  }
  const remoteVideo = document.getElementById('remoteVideo');
  if (remoteVideo) {
    showElement(remoteVideo);
  }

  const newMessageInput = document.getElementById('new_message');
  if (newMessageInput) {
    showElement(newMessageInput);
  }
  disableDashboard();
};

//UI call buttons
const micOnImgSrc = './utils/images/mic.png';
const micOffImgSrc = './utils/images/micOff.png';
export const updateMicButton = micActive => {
  const micBtnImage = document.getElementById('mic_button_image');
  if (micBtnImage) {
    micBtnImage.src = micActive ? micOffImgSrc : micOnImgSrc;
  }
};

const cameraOnImgSrc = './utils/images/camera.png';
const cameraOffImgSrc = './utils/images/cameraOff.png';
export const updateCameraButton = cameraActive => {
  const cameraButtonImage = document.getElementById('camera_button_image');
  if (cameraButtonImage) {
    cameraButtonImage.src = cameraActive ? cameraOffImgSrc : cameraOnImgSrc;
  }
};

//UI messages
export const appendMessage = (message, right = false) => {
  const messagesContainer = document.getElementById('messages_box');
  const messageElement = right
    ? elements.getRightMessage(message)
    : elements.getLeftMessage(message);

  messagesContainer.appendChild(messageElement);
};

export const clearMessager = () => {
  const messageContainer = document.getElementById('messages_box');
  messageContainer.querySelectorAll('*').forEach(n => n.remove());
};

///Recording
export const showRecordingPanel = () => {
  const recordingButtons = document.getElementById('video_recording_buttons');
  if (recordingButtons) {
    showCallElements(recordingButtons);
  }

  //hide Start recording button if it is active
  const startRecordingButton = document.getElementById(
    'start_recording_button'
  );
  if (startRecordingButton) {
    hideElement(startRecordingButton);
  }
};

export const resetRecordingButtons = () => {
  const startRecordingButton = document.getElementById(
    'start_recording_button'
  );
  if (startRecordingButton) {
    showElement(startRecordingButton);
  }
  const recordingButtons = document.getElementById('video_recording_buttons');
  if (recordingButtons) {
    hideElement(recordingButtons);
  }
};
//UI Helper Functions
const enableDashboard = () => {
  const dashboardBlocker = document.getElementById('dashboardBlur');
  if (dashboardBlocker) {
    if (!dashboardBlocker.classList.contains('display_none')) {
      dashboardBlocker.classList.add('display_none');
    }
  }
};
const disableDashboard = () => {
  const dashboardBlocker = document.getElementById('dashboardBlur');
  if (dashboardBlocker) {
    if (dashboardBlocker.classList.contains('display_none')) {
      dashboardBlocker.classList.remove('display_none');
    }
  }
};

const hideElement = element => {
  if (!element.classList.contains('display_none')) {
    element.classList.add('display_none');
  }
};

const showElement = element => {
  if (element.classList.contains('display_none')) {
    element.classList.remove('display_none');
  }
};
