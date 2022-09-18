import axios from 'axios';
import { showAlert } from './alerts';

export const createSchedule = async (
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
        schDate,
        schTime,
        schType,
        schPhone,
        createdAt,
        service
      }
    });
    if ((res.data.status = 'success')) showAlert('success', 'Schedule sent!');

    window.setTimeout(() => {
      location.assign('/myappointments');
    }, 1500);
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

export const setMeeting = async (
  schId,
  approved,
  approvedBy,
  approvedAt,
  meetingDate,
  meetingTime
) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/schedules/${schId}`,
      data: {
        approved,
        approvedBy,
        approvedAt,
        meetingDate,
        meetingTime
      }
    });
    if ((res.data.status = 'success'))
      showAlert('success', 'Meeting has been set');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const startMeeting = async (schId, meetingStarted) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/schedules/${schId}`,
      data: {
        meetingStarted
      }
    });
    if ((res.data.status = 'success'))
      window.setTimeout(() => {
        location.assign('/sessions');
      }, 1500);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
