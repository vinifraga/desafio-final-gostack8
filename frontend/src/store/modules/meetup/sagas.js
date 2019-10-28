import { all, takeLatest, put, call } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '~/services/api';
import history from '~/services/history';

import * as MeetupActions from './actions';

function* indexMeetups() {
  try {
    const response = yield call(api.get, '/meetups');

    yield put(MeetupActions.indexSuccess(response.data));
  } catch (error) {
    toast.error('Failed to index meetups');
    yield put(MeetupActions.failure());
  }
}

function* storeMeetup({ payload }) {
  try {
    const { data } = payload;

    const response = yield call(api.post, '/meetups', data);

    yield put(MeetupActions.storeSuccess(response.data));

    toast.success('Meetup successfully created');
    history.push('/dashboard');
  } catch (error) {
    toast.error('Failed to create meetup, verify your data');
    yield put(MeetupActions.failure());
  }
}

function* updateMeetup({ payload }) {
  try {
    const { id, data, bannerId } = payload;

    let response;

    if (bannerId) {
      response = yield all([
        call(api.put, `/meetups/${id}`, data),
        call(api.delete, `/files/${bannerId}`),
      ]);
    } else {
      response = yield call(api.put, `/meetups/${id}`, data);
    }

    yield put(MeetupActions.storeSuccess(response.data));

    toast.success('Meetup successfully updated');
    history.push('/dashboard');
  } catch (error) {
    toast.error('Failed to update meetup, verify your data');
    yield put(MeetupActions.failure());
  }
}

function* deleteMeetup({ payload }) {
  try {
    const { id, bannerId } = payload;

    yield all([
      call(api.delete, `/meetups/${id}`),
      call(api.delete, `/files/${bannerId}`),
    ]);

    toast.info('Meetup successfully canceled');
    history.push('/dashboard');

    yield put(MeetupActions.deleteSuccess());
  } catch (error) {
    toast.error('Failed to cancel meetup');
    yield put(MeetupActions.failure());
  }
}

export default all([
  takeLatest('@meetup/INDEX_REQUEST', indexMeetups),
  takeLatest('@meetup/STORE_REQUEST', storeMeetup),
  takeLatest('@meetup/UPDATE_REQUEST', updateMeetup),
  takeLatest('@meetup/DELETE_REQUEST', deleteMeetup),
]);
