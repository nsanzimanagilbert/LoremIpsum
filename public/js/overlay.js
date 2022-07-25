/* eslint-disable */

export const hideOverlay = () => {
  const el = document.querySelector('.overlay');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
export const showOverlay = () => {
  hideOverlay();
  const markup = `<div class="overlay"></div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  // window.setTimeout(hideAlert, 5000);
};
