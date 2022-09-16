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
    <form id="signUpForm">
      <div class="signup-form--container signup-form--1">
        <div class="signup-form flex flex">
          <div class="field">
            <i class='bx bxs-user' ></i>
            <input type="text" placeholder="Your First Name" id="firstName" required>
          </div>
          <div class="field">
            <i class='bx bxs-user' ></i>
            <input type="text" placeholder="Your Last Name" id="lastName" required>
          </div>
          <div class="field">
            <i class='bx bxs-user' ></i>
            <select id="gender">
              <option>--Your gender--</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="field">
            <i class='bx bxs-calendar'></i>
            <input type="date" placeholder="Date of birth" id="age" required>
          </div>
          <div class="btn btn-signup btn-signup--next">Continue</div>
        </div>
      </div>
      <div class="signup-form--container signup-form--2 display_none">
        <div class="signup-form flex signup-form--2">
          <div class="field">
            <i class='bx bxs-envelope' ></i>
            <input type="email" placeholder="Your Email" id="email" required></input>
          </div>
          <div class="field">
            <i class='bx bxs-phone' ></i>
            <input type="text" placeholder="Your Phone number" id="phone" required></input>
          </div>
          <div class="field">
            <i class='bx bxs-lock-alt' ></i>
            <input type="password" placeholder="Your Password" id="password" required></input>
          </div>
          <div class="field">
            <i class='bx bxs-lock-alt' ></i>
            <input type="password" placeholder="Repeat Your Password" id="passwordConfirm" required></input>
          </div>
          <div class="formBackBtn" flex>
            <i class='bx bx-arrow-back'></i> Back
          </div>
          <div class="btn btn-signup btn-signup--complete">Complete Sign up</div>
        </div>
      </div>
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
  const form1 = document.querySelector('.signup-form--1');
  const form2 = document.querySelector('.signup-form--2');
  const showNextBtn = document.querySelector('.btn-signup--next');
  const formBackBtn = document.querySelector('.formBackBtn');

  if (showNextBtn) {
    showNextBtn.addEventListener('click', () => {
      form1.classList.add('display_none');
      form2.classList.remove('display_none');
    });
  }
  if (formBackBtn) {
    formBackBtn.addEventListener('click', () => {
      form1.classList.remove('display_none');
      form2.classList.add('display_none');
    });
  }
  const completeSignupBtn = document.querySelector('.btn-signup--complete');
  if (completeSignupBtn) {
    completeSignupBtn.addEventListener('click', async e => {
      e.preventDefault();
      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const gender = document.getElementById('gender').value;
      const age = document.getElementById('age').value;
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
        gender,
        age,
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
