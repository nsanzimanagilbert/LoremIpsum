/* eslint-disable */
import { hideOverlay } from './overlay';
import { login } from './login';
export const hideProfileViewerPopup = () => {
  const el = document.querySelector('#profileViewerPopup');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
export const showProfileViewerPopup = user => {
  hideProfileViewerPopup();
  const markup = `<div class="popup loginPopup flex" id="profileViewerPopup">
    <div class="close-popup-btn flex btn">
      <i class='bx bx-x'></i> 
    </div>
    <div id='profileViewContainer' class="grid grid-2">
      <div class="user-info">
        <img src='/img/users/${user.photo}'>
        <h2>${user.salutation} ${user.firstName} ${user.lastName}</h2>
        <p> Therapist </p>
      </div>
      <div class="user-info-bio flex">
        <div class="user-info-section--profile">
          <h3></h3>
          <p> <i class='bx bxs-quote-left'></i> ${user.profile}</p>
        </div>
        <div class="user-info-section">
          <h3>Education</h3>
          <p> ${user.education}</p>
        </div>
        <div class="user-info-section">
          <h3>Experience</h3>
          <p> ${user.experience}</p>
        </div>
        <div class="user-info-section">
          <h3>Spoken Languages</h3>
          <p> ${user.languages}</p>
        </div>
        <div class="user-info-section">
          <h3>Location</h3>
          <p> ${user.location}</p>
        </div>
      </div>
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
