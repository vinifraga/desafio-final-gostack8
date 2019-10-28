import { all, takeLatest, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '~/services/api';
import * as UserActions from './actions';

function* updateProfile({ payload }) {
  try {
    const { name, email, ...rest } = payload.data;

    const data = {
      name,
      email,
      ...(rest.oldPassword ? rest : {}),
    };

    const response = yield call(api.put, '/users', data);

    toast.success('Profile successfully updated');

    yield put(UserActions.updateSuccess(response.data));
  } catch (error) {
    toast.error('Failed to update profile, verify your data');
    yield put(UserActions.updateFailure());
  }
}

export default all([takeLatest('@user/UPDATE_REQUEST', updateProfile)]);
