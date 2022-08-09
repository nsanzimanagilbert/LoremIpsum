/* eslint-disable */
import Chart from 'chart.js/auto';
import axios from 'axios';
import moment from 'moment';
import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { hideLoginPopup, showLoginPopup } from './loginPopup';
import { showOverlay, hideOverlay } from './overlay';
import { showSignupPopup, hideSignupPopup } from './signupPopup';
import { showStaffSignupPopup, hideStaffSignupPopup } from './staffSignupPopup';
import { createSchedule, completeSchedule, progressSchedule } from './schedule';
import { refleshPage } from './refleshPage';
import { getUser } from './user';
import {
  showProfileViewerPopup,
  hideProfileViewerPopup
} from './profileViewerPopup';
// Session Handlers
////////////////////
import * as wss from './wss';
import * as store from './store';
import * as webRTCHandler from './webRTCHandler';
import * as chatConstants from './chatConstants';
import * as ui from './ui';
import * as recordingUtils from './recordingUtils';
import * as strangerUtils from './strangerUtils';

import io from 'socket.io-client';
const socket = io('/');
// import { getIncomingCallDialog } from './elements';

const getTurnServerCredentials = async () => {
  const responseData = await axios.get('/api/v1/get-turn-credentials');
  webRTCHandler.setTURNServers(responseData.data.token.iceServers);
};

wss.registerSocketEvents(socket);

getTurnServerCredentials().then(() => {
  webRTCHandler.getLocalPreview();
  console.log('Local preview started...');
});

// webRTCHandler.getLocalPreview();
const personalCodeCopyBtn = document.getElementById('copyPersonalCodeBtn');
if (personalCodeCopyBtn) {
  personalCodeCopyBtn.addEventListener('click', () => {
    const personalCode = store.getState().socketId;
    navigator.clipboard && navigator.clipboard.writeText(personalCode);
  });
}

const personalCodeVideoBtn = document.querySelector(
  '.personalCodeConnectingBtn'
);
const personalCodeChatBtn = document.querySelector('.icon-chat');

if (personalCodeChatBtn) {
  personalCodeChatBtn.addEventListener('click', () => {
    const calleePersonalCode = document.getElementById('personalCodeInput')
      .value;
    const callType = chatConstants.callType.CHAT_PERSONAL_CODE;
    webRTCHandler.sendPreOffer(callType, calleePersonalCode);
  });
}
if (personalCodeVideoBtn) {
  personalCodeVideoBtn.addEventListener('click', () => {
    const calleePersonalCode = document.getElementById('personalCodeInput')
      .value;
    const callType = chatConstants.callType.VIDEO_PERSONAL_CODE;
    webRTCHandler.sendPreOffer(callType, calleePersonalCode);
  });
}

//event Listeneers for Video call buttons
const micBtn = document.querySelector('.icon-audio--mute');
if (micBtn) {
  micBtn.addEventListener('click', () => {
    const localStream = store.getState().localStream;
    const micEnabled = localStream.getAudioTracks()[0].enabled;
    localStream.getAudioTracks()[0].enabled = !micEnabled;
    ui.updateMicButton(micEnabled);
  });
}
const cameraBtn = document.querySelector('.icon-video--cancel');
if (cameraBtn) {
  cameraBtn.addEventListener('click', () => {
    const localStream = store.getState().localStream;
    const cameraEnabled = localStream.getVideoTracks()[0].enabled;
    localStream.getVideoTracks()[0].enabled = !cameraEnabled;
    ui.updateCameraButton(cameraEnabled);
  });
}

const screenSharingBtn = document.querySelector('.icon-screen');
if (screenSharingBtn) {
  screenSharingBtn.addEventListener('click', () => {
    const screenSharingActive = store.getState().screenSharingActive;
    webRTCHandler.switchBetweenCameraAndScreenSharing(screenSharingActive);
  });
}

const pauseRecordingBtn = document.getElementById('pause_recording_button');
if (pauseRecordingBtn) {
  pauseRecordingBtn.addEventListener('click', () => {
    recordingUtils.pauseRecording();
    ui.switchRecordingBtns(true);
  });
}
const resumeRecordingBtn = document.getElementById('resume_recording_button');
if (resumeRecordingBtn) {
  resumeRecordingBtn.addEventListener('click', () => {
    recordingUtils.resumeRecording();
    ui.switchRecordingBtns();
  });
}
//MESSANGER
const newMessageInput = document.getElementById('newMessageInput');
if (newMessageInput) {
  newMessageInput.addEventListener('keydown', event => {
    console.log('change occured');
    const key = event.key;
    if (key === 'Enter') {
      webRTCHandler.sendMessageUsingDataChannel(event.target.value);
      ui.appendMessage(event.target.value, true);
      newMessageInput.value = '';
    }
  });
}

const sendMessageBtn = document.getElementById('sendMessageBtn');
if (sendMessageBtn) {
  sendMessageBtn.addEventListener('click', () => {
    const message = newMessageInput.value;
    webRTCHandler.sendMessageUsingDataChannel(message);
    ui.appendMessage(message, true);

    newMessageInput.value = '';
  });
}

//Recording;

const startRecordingBtn = document.getElementById('icon-record');
if (startRecordingBtn) {
  startRecordingBtn.addEventListener('click', () => {
    recordingUtils.startRecording();
    ui.showRecordingPanel();
  });
}
const stopRecordingBtn = document.getElementById('icon-record--stop');
if (stopRecordingBtn) {
  stopRecordingBtn.addEventListener('click', () => {
    recordingUtils.stopRecording();
    ui.resetRecordingButtons();
  });
}

//Hangup Calls
const hangUpCallBtn = document.getElementById('icon-hangup');
if (hangUpCallBtn) {
  hangUpCallBtn.addEventListener('click', () => {
    webRTCHandler.handleHungUp();
  });
}

const hangUpChatBtn = document.getElementById('hangup-chat-btn');
if (hangUpChatBtn) {
  hangUpChatBtn.addEventListener('click', () => {
    webRTCHandler.handleHungUp();
  });
}

// Getting ready for calls

const getReadyForCallsBtn = document.getElementById('allow_staff_call_btn');
if (getReadyForCallsBtn) {
  getReadyForCallsBtn.addEventListener('click', () => {
    const allowState = store.getState().allowConnectionsFromStranger;
    store.setAllowConnectionsFromStrangers(!allowState);
    strangerUtils.changeStrangerConnectionStatus(!allowState);
  });
}
const strangerCallerBtn = document.getElementById('callStranger');
if (strangerCallerBtn) {
  strangerCallerBtn.addEventListener('click', () => {
    strangerUtils.getStrangerSocketIdAndConnect(
      chatConstants.callType.VIDEO_STRANGER
    );
  });
}
// getIncomingCallDialog();
// Session End
////////////////////

const userNav = document.querySelector('.user');
if (userNav) {
  userNav.addEventListener('click', () => {
    document.querySelector('.profile-viewer').classList.toggle('hideViewer');
  });
}
const profileViewerBtn = document.querySelectorAll('.profileViewerBtn');
if (profileViewerBtn) {
  profileViewerBtn.forEach(btn => {
    btn.addEventListener('click', async function(e) {
      const userId = this.dataset.userid;
      showOverlay();
      await getUser(userId);
    });
  });
}

// DELEGATION
const logoutBtn = document.querySelector('.btn-logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async e => {
    e.preventDefault();
    await logout();
  });
}
const time = moment()
  .local(Date.now())
  .format('ll');
const navTime = document.querySelector('.nav-time');
if (navTime) {
  navTime.textContent = time;
}

const signInBtn = document.querySelector('.signin-btn');
if (signInBtn) {
  signInBtn.addEventListener('click', () => {
    showOverlay();
    showLoginPopup();
  });
}

const signUpBtn = document.querySelector('.signup-btn');
if (signUpBtn) {
  signUpBtn.addEventListener('click', () => {
    showOverlay();
    showSignupPopup();
  });
}
const connectBtn = document.querySelector('.connect-btn');
if (connectBtn) {
  connectBtn.addEventListener('click', () => {
    showSignupPopup();
    showOverlay();
  });
}
const addStaffBtn = document.querySelector('.btn-addStaff');
if (addStaffBtn) {
  addStaffBtn.addEventListener('click', () => {
    showStaffSignupPopup();
    showOverlay();
  });
}

// Updating User Data
////////////////////
const userDataForm = document.getElementById('userDateForm');
if (userDataForm) {
  userDataForm.addEventListener('submit', async e => {
    e.preventDefault();

    const form = new FormData();
    form.append('firstName', document.getElementById('myFirstName').value);
    form.append('lastName', document.getElementById('myLastName').value);
    form.append('email', document.getElementById('myEmail').value);
    form.append('phone', document.getElementById('myPhone').value);
    form.append('profile', document.getElementById('myProfile').value);
    form.append('photo', document.getElementById('myPhoto').files[0]);
    form.append('salutation', document.getElementById('salutation').value);
    form.append('education', document.getElementById('myEducation').value);
    form.append('experience', document.getElementById('myEducation').value);
    form.append('languages', document.getElementById('myLanguages').value);
    form.append('location', document.getElementById('myLocation').value);

    document.querySelector('.data-change-btn').textContent = 'Updating...';
    await updateSettings(form, 'data');
    document.querySelector('.data-change-btn').textContent = 'Update Data';
  });
}

const userPasswordForm = document.getElementById('userPasswordForm');
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    const passwordCurrent = document.getElementById('myPasswordCurrent').value;
    const password = document.getElementById('myPasswordNew').value;
    const passwordConfirm = document.getElementById('myPasswordConfirm').value;
    document.querySelector('.password-change-btn').textContent = 'Changing...';

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    refleshPage();
  });
}
// Updating User Data FORM
//////////////////////////

// Schedule Counselling session
///////////////////////////////
const formCounselling = document.querySelector('.form-schedule--counselling');
if (formCounselling) {
  formCounselling.addEventListener('submit', async e => {
    e.preventDefault();
    const schSenderEmail = document.getElementById('schSender').value;
    const schSenderName = document.getElementById('schSenderName').value;
    const schDate = document.getElementById('schDate').value;
    const schHour = document.getElementById('schHour').value;
    const schMins = document.getElementById('schMins').value;
    const schTiming = document.getElementById('schTiming').value;
    const schTime = `${schHour}:${schMins} ${schTiming}`;
    const schPhone = document.getElementById('schPhone').value;
    const service = 'counselling';
    const createdAt = moment().format('lll');
    const schTypes = document.querySelectorAll('input[name="schType"]');
    var schType;
    for (const radioButton of schTypes) {
      if (radioButton.checked) {
        schType = radioButton.value;
        break;
      }
    }
    await createSchedule(
      schSenderEmail,
      schSenderName,
      schDate,
      schTime,
      schType,
      schPhone,
      createdAt,
      service
    );
    refleshPage();
  });
}
// Schedule Counselling session END
///////////////////////////////

// Complete Schedule
/////////////////////
const schCompleteBtn = document.querySelector('.btn-sch--complete');
if (schCompleteBtn) {
  schCompleteBtn.addEventListener('click', async e => {
    const schId = document.getElementById('schId').value;
    const complete = true;
    await completeSchedule(schId, complete);
    refleshPage();
  });
}
const schProgressBtn = document.querySelector('.btn-sch--inprogress');
if (schProgressBtn) {
  schProgressBtn.addEventListener('click', async e => {
    const schId = document.getElementById('schId').value;
    const doneSessions = document.getElementById('doneSessions').value;
    const remainingSessions = document.getElementById('remainingSessions')
      .value;
    const inProgress = true;
    await progressSchedule(schId, inProgress, doneSessions, remainingSessions);
    refleshPage();
  });
}
// Complete Schedule END
/////////////////////

const ctx = document.getElementById('myChartClientsStats');
if (ctx) {
  ctx.getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ],
      datasets: [
        {
          barThickness: 5,
          data: [12, 19, 3, 5, 2, 3, 10, 30, 27, 10, 57, 60],
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
          borderRadius: 2
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            borderDash: [2, 4]
          }
        },
        x: {
          grid: {
            borderDash: [2, 4]
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

const ctxGender = document.getElementById('myChartClientsGender');

if (ctxGender) {
  ctxGender.getContext('2d');
  const myChart = new Chart(ctxGender, {
    type: 'doughnut',
    data: {
      labels: ['Male', 'Female'],
      datasets: [
        {
          data: [12, 19],
          backgroundColor: ['rgb(60, 92, 245)', 'rgb(56, 210, 158)'],
          borderWidth: 0,
          hoverOffset: 2,
          cutout: '80%'
        }
      ]
    },

    options: {
      plugins: {
        legend: {
          position: 'bottom',
          rtl: false,
          align: 'center',
          labels: {
            boxHeight: 7,
            boxWidth: 7,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        }
      }
    }
  });
}

const ctxClientsSummary = document.getElementById('myChartClientsSummary');
if (ctxClientsSummary) {
  ctxClientsSummary.getContext('2d');
  const myChart = new Chart(ctxClientsSummary, {
    type: 'doughnut',
    data: {
      labels: ['Counselling', 'Consultation'],
      datasets: [
        {
          data: [12, 19],
          backgroundColor: ['rgb(240, 143, 96)', 'rgb(56, 210, 158)'],
          borderWidth: 0,
          hoverOffset: 2,
          cutout: '80%'
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom',
          rtl: false,
          align: 'end',
          labels: {
            boxHeight: 7,
            boxWidth: 7,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        }
      }
    }
  });
}
