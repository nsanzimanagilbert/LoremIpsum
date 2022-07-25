import axios from 'axios';
import { showAlert } from './alerts';

export const createUser = async (
  firstName,
  lastName,
  email,
  phone,
  duty,
  role,
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
        password,
        passwordConfirm
      }
    });
    if ((res.data.status = 'success'))
      showAlert('success', 'Your account has been created!');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
