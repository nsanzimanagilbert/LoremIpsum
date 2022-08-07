import axios from 'axios';
import { showAlert } from './alerts';
import { showProfileViewerPopup } from './profileViewerPopup';

export const createUser = async (
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
) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/users/signup`,
      data: {
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
      }
    });
    if ((res.data.status = 'success'))
      showAlert('success', 'Your account has been created!');
    window.setTimeout(() => {
      location.assign('/welcome');
    }, 1500);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const getUser = async userId => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/users/${userId}`
    });
    if ((res.data.status = 'success')) {
      const user = res.data.data.data;
      console.log(user);
      showProfileViewerPopup(user);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
