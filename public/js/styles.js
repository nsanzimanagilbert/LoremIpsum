export const addColor = () => {
  randomColor =
    '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
  const userImg = document.querySelector('.user-image');
  if (userImg) {
    userImg.classList.add('display_none');
  }
};
