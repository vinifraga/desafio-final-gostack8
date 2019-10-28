import { all, takeLatest, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '~/services/api';
import history from '~/services/history';
import * as AuthActions from './actions';

function* signIn({ payload }) {
  try {
    const { email, password } = payload;

    const response = yield call(api.post, '/sessions', { email, password });

    const { token, user } = response.data;

    yield put(AuthActions.signInSuccess(token, user));

    api.defaults.headers.Authorization = `Bearer ${token}`;

    history.push('/dashboard');
  } catch (error) {
    toast.error('Failed to sign in, verify your credentials');
    yield put(AuthActions.signFailure());
  }
}

function* signUp({ payload }) {
  try {
    const { name, email, password } = payload;

    yield call(api.post, '/users', { name, email, password });

    yield put(AuthActions.signUpSuccess());

    toast.success('Sign up completed');
    history.push('/');
  } catch (error) {
    toast.error('Failed to sign up, verify your credentials');
    yield put(AuthActions.signFailure());
  }
}

function setToken({ payload }) {
  const { token } = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

function signOut() {
  history.push('/');
}

export default all([
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_OUT', signOut),
]);
