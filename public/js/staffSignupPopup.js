/* eslint-disable */
import { hideOverlay } from './overlay';
import { createUser } from './user';
export const hideStaffSignupPopup = () => {
  const el = document.querySelector('.staffsignupPopup');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
export const showStaffSignupPopup = () => {
  hideStaffSignupPopup();
  const markup = `<div class="popup signupPopup staffsignupPopup flex">
    <div class="close-popup-btn flex btn">
      <i class='bx bx-x'></i> 
    </div>
    <h2> You are about to add a new Staff </h2> 
    <form class="signup-form flex" id="staffSignupForm">
      <input type="text" placeholder="First name" id="firstName" required></input>
      <input type="text" placeholder="Last name" id="lastName" required></input>
      <input type="email" placeholder="Email" id="email" required></input>
      <input type="text" placeholder="Phone number" id="phone" required></input>
      <select id="staffRole" required>
        <option>--Select Role--</option>
        <option value="counsellor">Counsellor</option>
        <option value="admin">Admin</option>

      </select>
      <input type="password" placeholder="Password" id="password" required></input>
      <input type="password" placeholder="Confirm password" id="passwordConfirm" required></input>
      <button class="btn btn-signup">Create staff</button>
    </form>
  </div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  // window.setTimeout(hideAlert, 5000);

  const closePopupBtn = document.querySelector('.close-popup-btn');
  if (closePopupBtn) {
    closePopupBtn.addEventListener('click', () => {
      hideStaffSignupPopup();
      hideOverlay();
    });
  }

  const staffsignUpForm = document.getElementById('staffSignupForm');
  if (staffsignUpForm) {
    staffsignUpForm.addEventListener('submit', async e => {
      e.preventDefault();
      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('passwordConfirm').value;
      const role = document.getElementById('staffRole').value;
      const duty = 'staff';
      await createUser(
        firstName,
        lastName,
        email,
        phone,
        duty,
        role,
        password,
        passwordConfirm
      );
    });
  }
};
