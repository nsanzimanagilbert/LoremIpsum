/* eslint-disable */
import { hideOverlay } from './overlay';
import { login } from './login';
export const hideProfileViewerPopup = () => {
  const el = document.querySelector('#profileViewerPopup');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
export const showProfileViewerPopup = (fname, lname, profile, photo) => {
  hideProfileViewerPopup();
  const markup = `<div class="popup loginPopup flex" id="profileViewerPopup">
    <div class="close-popup-btn flex btn">
      <i class='bx bx-x'></i> 
    </div>
    <h2> ${fname} ${lname}  </h2> 
    <form class="login-form flex">
      <img src='/img/users/${photo}'
      <div> ${profile} </div>
    </form>
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
