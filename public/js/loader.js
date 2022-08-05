/* eslint-disable */

export const hideUserLoader = () => {
  const el = document.querySelector('.userLoader');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
export const showUserLoader = () => {
  hideUserLoader();
  const markup = `<div class="popup loginPopup userLoader"><span class="loader"></span></div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
};
