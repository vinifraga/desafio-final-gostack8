import React from 'react';
import { Form, Input } from '@rocketseat/unform';
import { useSelector, useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { MdAddCircleOutline } from 'react-icons/md';
import { FaSpinner } from 'react-icons/fa';

import * as UserActions from '~/store/modules/user/actions';

import { Container } from './styles';

const schema = Yup.object().shape({
  name: Yup.string(),
  email: Yup.string().email('Invalid email'),
  oldPassword: Yup.string(),
  password: Yup.string().when('oldPassword', (oldPassword, field) =>
    oldPassword
      ? field
          .min(6, 'Minimum 6 characters')
          .required('New password is required')
          .notOneOf(
            [Yup.ref('oldPassword')],
            'New password cannot be the same as old password'
          )
      : field
  ),
  confirmPassword: Yup.string().when('password', (password, field) =>
    password
      ? field
          .required('Confirm password is required')
          .oneOf(
            [Yup.ref('password')],
            'New password and confirmation do not match'
          )
      : field
  ),
});

export default function Profile() {
  const profile = useSelector(state => state.user.profile);
  const loading = useSelector(state => state.user.loading);
  const dispatch = useDispatch();

  async function handleSubmit(data) {
    dispatch(UserActions.updateRequest(data));
  }
  return (
    <Container loading={loading ? 1 : 0}>
      <Form initialData={profile} schema={schema} onSubmit={handleSubmit}>
        <Input name="name" placeholder="Full name" />
        <Input name="email" type="email" placeholder="Your best email" />

        <hr />

        <Input name="oldPassword" type="password" placeholder="Password" />
        <Input name="password" type="password" placeholder="New Password" />
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Password Confirmation"
        />
        <div>
          <button type="submit" disabled={loading}>
            {loading ? (
              <>
                <FaSpinner size={20} color="#FFF" />
                Saving...
              </>
            ) : (
              <>
                <MdAddCircleOutline size={20} color="#FFF" />
                Save profile
              </>
            )}
          </button>
        </div>
      </Form>
    </Container>
  );
}
