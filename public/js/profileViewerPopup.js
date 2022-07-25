/* eslint-disable */
import { hideOverlay } from './overlay';
import { showSignupPopup } from './signupPopup';
import { login } from './login';
export const hideProfileViewerPopup = () => {
  const el = document.querySelector('.loginPopup');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
export const showProfileViewerPopup = () => {
  hideProfileViewerPopup();
  const markup = `<div class="popup loginPopup id="profileViewerPopup" flex">
    <div class="close-popup-btn flex btn">
      <i class='bx bx-x'></i> 
    </div>
    <h2> Sign in to your account </h2> 
    <form class="login-form flex">
      <input type="email" id="loginEmail" placeholder="Email"></input>
      <input type="password" id="loginPassword" placeholder="Password"></input>
      <button class="btn btn-login">Sign in</button>
    </form>
    <div class="newAccountLink"> 
      <span>Have no account?</span> 
      <a class="btn btn-showSignUp">Sign up </a> 
    </div>
  </div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  // window.setTimeout(hideAlert, 5000);

  const closePopupBtn = document.querySelector('.close-popup-btn');
  if (closePopupBtn) {
    closePopupBtn.addEventListener('click', () => {
      hideProfileViewerPopup();
      hideOverlay();
    });
  }
};
