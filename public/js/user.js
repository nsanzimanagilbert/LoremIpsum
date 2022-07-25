import axios from 'axios';
import { showAlert } from './alerts';

export const createUser = async (
  firstName,
  lastName,
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
