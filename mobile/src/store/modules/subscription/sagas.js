import { takeLatest, all, call, put } from 'redux-saga/effects';
import { Alert } from 'react-native';

import api from '~/services/api';
import navigation from '../../../services/navigation';
import {
  indexSuccess,
  storeSuccess,
  requestFailure,
  deleteSuccess,
} from './actions';

function* indexSubscriptions() {
  try {
    const response = yield call(api.get, 'subscriptions');

    yield put(indexSuccess(response.data));
  } catch (error) {
    Alert.alert('Error', 'Failed to index subscriptions');
    yield put(requestFailure());
  }
}

function* storeSubscription({ payload }) {
  try {
    const { meetup_id } = payload;

    const response = yield call(api.post, 'subscriptions', { meetup_id });

    Alert.alert('Success', 'Successfully subscribed to Meetup');
    yield put(storeSuccess(response.data));
    navigation.navigate('Subscriptions');
  } catch (error) {
    Alert.alert('Error', 'Failed to subscribe to Meetup');
    yield put(requestFailure());
  }
}

function* deleteSubscription({ payload }) {
  try {
    const { id } = payload;

    yield call(api.delete, `subscriptions/${id}`);

    Alert.alert('Success', 'Successfully unsubscribed from Meetup');
    yield put(deleteSuccess(id));
  } catch (error) {
    Alert.alert('Error', 'Failed to unsubscribe from Meetup');
  }
}

export default all([
  takeLatest('@subscription/INDEX_REQUEST', indexSubscriptions),
  takeLatest('@subscription/STORE_REQUEST', storeSubscription),
  takeLatest('@subscription/DELETE_REQUEST', deleteSubscription),
]);
