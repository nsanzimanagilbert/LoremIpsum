import axios from 'axios';
import { showAlert } from './alerts';

export const createSchedule = async (
  schSender,
  schDate,
  schTime,
  schType,
  schPhone,
  createdAt,
  service
) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/schedules`,
      data: {
        schSender,
        schDate,
        schTime,
        schType,
        schPhone,
        createdAt,
        service
      }
    });
    if ((res.data.status = 'success'))
      showAlert('success', 'Schedule Confirmed!');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const completeSchedule = async (schId, complete) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/schedules/${schId}`,
      data: {
        complete
      }
    });
    if ((res.data.status = 'success')) showAlert('success', 'Visit Completed!');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const progressSchedule = async (
  schId,
  inProgress,
  doneSessions,
  remainingSessions
) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/schedules/${schId}`,
      data: {
        inProgress,
        doneSessions,
        remainingSessions
      }
    });
    if ((res.data.status = 'success')) showAlert('success', 'Session set');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
