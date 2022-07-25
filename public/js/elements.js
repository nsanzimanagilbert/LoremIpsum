import { callType } from './chatConstants';

export const getIncomingCallDialog = (
  callTypeInfo,
  acceptCallHandler,
  rejectCallHandler
) => {
  console.log('getting incoming call dialog');
  const dialog = document.createElement('div');
  dialog.classList.add('callDialogWrapper');
  const callDialogContent = document.createElement('div');
  callDialogContent.classList.add('call-dialog-content');

  dialog.appendChild(callDialogContent);

  const title = document.createElement('p');
  title.classList.add('call-dialog-title');
  title.innerHTML = `Incoming ${callTypeInfo} call`;

  const callImageContainer = document.createElement('div');
  callImageContainer.classList.add('call-dialog-image');
  const image = document.createElement('img');
  const avatarImagePath =
    'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  image.src = avatarImagePath;
  callImageContainer.appendChild(image);

  const callButtonsContainer = document.createElement('div');
  callButtonsContainer.classList.add('call-dialog-btns-container');

  const callAccBtn = document.createElement('button');
  callAccBtn.classList.add('call-acc-btn');
  callAccBtn.textContent = 'Accept call';

  const callRejBtn = document.createElement('button');
  callRejBtn.classList.add('call-rej-btn');
  callRejBtn.textContent = 'Reject call';

  callButtonsContainer.appendChild(callAccBtn);
  callButtonsContainer.appendChild(callRejBtn);

  callDialogContent.appendChild(title);
  callDialogContent.appendChild(callImageContainer);
  callDialogContent.appendChild(callButtonsContainer);

  const dialogHTML = document.getElementById('callDialogWrapper');
  dialogHTML.appendChild(dialog);

  callAccBtn.addEventListener('click', () => {
    acceptCallHandler();
  });
  callRejBtn.addEventListener('click', () => {
    rejectCallHandler();
  });

  return dialog;
};

export const getCallingDialog = rejectCallHandler => {
  const dialog = document.createElement('div');
  dialog.classList.add('callDialogWrapper');
  const callDialogContent = document.createElement('div');
  callDialogContent.classList.add('call-dialog-content');

  dialog.appendChild(callDialogContent);

  const title = document.createElement('p');
  title.classList.add('call-dialog-title');
  title.innerHTML = `Calling...`;

  const callImageContainer = document.createElement('div');
  callImageContainer.classList.add('call-dialog-image');
  const image = document.createElement('img');
  const avatarImagePath =
    'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  image.src = avatarImagePath;
  callImageContainer.appendChild(image);

  const callButtonsContainer = document.createElement('div');
  callButtonsContainer.classList.add('call-dialog-btns-container');

  const hangUpCallBtn = document.createElement('button');
  hangUpCallBtn.classList.add('hangup-call-btn');
  hangUpCallBtn.textContent = 'End Call';

  callButtonsContainer.appendChild(hangUpCallBtn);

  callDialogContent.appendChild(title);
  callDialogContent.appendChild(callImageContainer);
  callDialogContent.appendChild(callButtonsContainer);

  return dialog;
};

export const getInfoDialog = (dialogTitle, dialogDescription) => {
  const dialog = document.createElement('div');
  dialog.classList.add('callDialogWrapper');
  const callDialogContent = document.createElement('div');
  callDialogContent.classList.add('call-dialog-content');

  dialog.appendChild(callDialogContent);

  const title = document.createElement('p');
  title.classList.add('call-dialog-title');
  title.innerHTML = dialogTitle;

  const callImageContainer = document.createElement('div');
  callImageContainer.classList.add('call-dialog-image');
  const image = document.createElement('img');
  const avatarImagePath =
    'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  image.src = avatarImagePath;
  callImageContainer.appendChild(image);

  const description = document.createElement('p');
  description.classList.add('callDialogDescription');
  description.innerHTML = dialogDescription;

  callDialogContent.appendChild(title);
  callDialogContent.appendChild(callImageContainer);
  callDialogContent.appendChild(description);

  return dialog;
};

export const getLeftMessage = message => {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message_left_container');
  const messageParagraph = document.createElement('p');
  messageParagraph.classList.add('message_left_paragraph');
  messageParagraph.innerHTML = message;
  messageContainer.appendChild(messageParagraph);

  return messageContainer;
};

export const getRightMessage = message => {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message_right_container');
  const messageParagraph = document.createElement('p');
  messageParagraph.classList.add('message_right_paragraph');
  messageParagraph.innerHTML = message;
  messageContainer.appendChild(messageParagraph);

  return messageContainer;
};
