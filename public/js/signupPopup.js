/* eslint-disable */
import { showLoginPopup } from './loginPopup';
import { hideOverlay } from './overlay';
import { createUser } from './user';
export const hideSignupPopup = () => {
  const el = document.querySelector('.signupPopup');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
export const showSignupPopup = () => {
  hideSignupPopup();
  const markup = `<div class="popup signupPopup flex">
    <div class="close-popup-btn flex btn">
      <i class='bx bx-x'></i> 
    </div>
    <h2> Create your personal account </h2> 
    <form class="signup-form flex">
      <input type="text" placeholder="First name" id="firstName" required></input>
      <input type="text" placeholder="Last name" id="lastName" required></input>
      <input type="email" placeholder="Email" id="email" required></input>
      <input type="text" placeholder="Phone number" id="phone" required></input>
      <input type="password" placeholder="Password" id="password" required></input>
      <input type="password" placeholder="Confirm password" id="passwordConfirm" required></input>

      <button class="btn btn-signup">Sign up</button>
    </form>
    <div class="newAccountLink signinLink"> 
      <span>Have an account already?</span> 
      <a class="btn btn-showSignin">Sign in </a> 
    </div>
  </div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  // window.setTimeout(hideAlert, 5000);

  const closePopupBtn = document.querySelector('.close-popup-btn');
  if (closePopupBtn) {
    closePopupBtn.addEventListener('click', () => {
      hideSignupPopup();
      hideOverlay();
    });
  }
  const showSigninBtn = document.querySelector('.btn-showSignin');
  if (showSigninBtn) {
    showSigninBtn.addEventListener('click', e => {
      e.preventDefault();
      hideSignupPopup();
      showLoginPopup();
    });
  }

  const signUpForm = document.querySelector('.signup-form');
  if (signUpForm) {
    signUpForm.addEventListener('submit', async e => {
      e.preventDefault();
      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const duty = 'client';
      const role = 'user';
      const profile = '';
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('passwordConfirm').value;
      await createUser(
        firstName,
        lastName,
        email,
        phone,
        duty,
        role,
        profile,
        password,
        passwordConfirm
      );
    });
  }
};
