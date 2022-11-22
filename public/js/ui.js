import * as chatConstants from './chatConstants';
import * as elements from './elements';
import * as store from './store';
export const updatePersonalCode = personalCode => {
  const personalCodeParagraph = document.getElementById(
    'personalCodeParagraph'
  );
  if (personalCodeParagraph) {
    personalCodeParagraph.value = personalCode;
  }
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
      showElement(remoteVideo);
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
export const showNoStrangerAvailable = () => {
  const infoDialog = elements.getInfoDialog(
    'No client is available',
    'Please check the appointment lists'
  );
  if (infoDialog) {
    const dialog = document.getElementById('callDialogWrapper');
    dialog.appendChild(infoDialog);

    setTimeout(() => {
      removeCallDialogs();
    }, [4000]);
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
  if (
    callType === chatConstants.callType.CHAT_PERSONAL_CODE ||
    callType === chatConstants.callType.CHAT_STRANGER
  ) {
    showChatCallElements();
  }
  if (
    callType === chatConstants.callType.VIDEO_PERSONAL_CODE ||
    callType === chatConstants.callType.VIDEO_STRANGER
  ) {
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
export const updateMicButton = micActive => {
  const micBtnMute = document.getElementById('icon-audio--mute');
  const micBtnUnmute = document.getElementById('icon-audio--unmute');

  if (micActive) {
    showElement(micBtnUnmute);
    hideElement(micBtnMute);
  } else {
    showElement(micBtnMute);
    hideElement(micBtnUnmute);
  }
};

const cameraOnImgSrc = "<i class='bx bx-video'></i>";
const cameraOffImgSrc = "<i class='bx bxs-video-off'></i>";
export const updateCameraButton = cameraActive => {
  const cameraButtonImage = document.getElementById('camera_button_image');
  if (cameraButtonImage) {
    cameraButtonImage.classList.toggle('activeCallBtn');
    cameraButtonImage.innerHTML = cameraActive
      ? cameraOffImgSrc
      : cameraOnImgSrc;
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

export const clearMessanger = () => {
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
export const switchRecordingBtns = (switchForResumeButton = false) => {
  const resumeBtn = document.getElementById('resume_recording_button');
  const pauseBtn = document.getElementById('pause_recording_button');
  if (switchForResumeButton) {
    hideElement(pauseBtn);
    showElement(resumeBtn);
  } else {
    hideElement(resumeBtn);
    showElement(pauseBtn);
  }
};

//UI after hanging up
export const updateUIAfterHangUp = callType => {
  enableDashboard();
  // hide the call buttons
  if (
    callType === chatConstants.callType.VIDEO_PERSONAL_CODE ||
    callType === chatConstants.callType.VIDEO_STRANGER
  ) {
    const callBtns = document.getElementById('call_buttons');
    if (callBtns) {
      hideElement(callBtns);
    }
  } else {
    const chatCallButtons = document.getElementById(
      'finish_chat_button_container'
    );
    if (chatCallButtons) {
      hideElement(chatCallButtons);
    }
  }

  clearMessanger();
  updateMicButton(false);
  updateCameraButton();

  //Hide remote video and show place holder

  const placeholder = document.getElementById('video_placeholder');
  if (placeholder) {
    showElement(placeholder);
  }
  const remoteVideo = document.getElementById('remote_video');
  if (remoteVideo) {
    hideElement(remoteVideo);
  }

  removeCallDialogs();
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
  if (!element.classList.contains('noShow')) {
    element.classList.add('noShow');
  }
};

const showElement = element => {
  if (element.classList.contains('noShow')) {
    element.classList.remove('noShow');
  }
};
