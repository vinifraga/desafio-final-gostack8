import { all, takeLatest, call, put } from 'redux-saga/effects';
import { Alert } from 'react-native';

import api from '~/services/api';
import navigation from '../../../services/navigation';
import * as AuthActions from './actions';

function* signIn({ payload }) {
  try {
    const { email, password } = payload;

    const response = yield call(api.post, '/sessions', { email, password });

    const { token, user } = response.data;

    yield put(AuthActions.signInSuccess(token, user));

    api.defaults.headers.Authorization = `Bearer ${token}`;
  } catch (error) {
    Alert.alert('Error', 'Failed to sign in, verify your credentials');
    yield put(AuthActions.signFailure());
  }
}

function* signUp({ payload }) {
  try {
    const { name, email, password } = payload;

    yield call(api.post, '/users', { name, email, password });

    yield put(AuthActions.signUpSuccess());

    Alert.alert('Success', 'Sign up completed');
    navigation.navigate('SignIn');
  } catch (error) {
    Alert.alert('Error', 'Failed to sign up, verify your credentials');
    yield put(AuthActions.signFailure());
  }
}

function setToken({ payload }) {
  if (!payload) return;

  const { token } = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export default all([
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
  takeLatest('persist/REHYDRATE', setToken),
]);
