import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';

import * as AuthActions from '~/store/modules/auth/actions';
import logo from '~/assets/logo.svg';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function SignIn() {
  const loading = useSelector(state => state.auth.loading);
  const dispatch = useDispatch();

  async function handleSubmit({ email, password }) {
    dispatch(AuthActions.signInRequest(email, password));
  }

  return (
    <>
      <img src={logo} alt="MeetApp_Logo" />
      <Form schema={schema} onSubmit={handleSubmit}>
        <Input name="email" type="email" placeholder="Email" />
        <Input
          name="password"
          type="password"
          placeholder="Your secret password"
        />
        <button disabled={loading} type="submit">
          {loading ? <FaSpinner color="#FFF" /> : 'Sign In'}
        </button>
      </Form>
      <Link to="/register">Create a free account</Link>
    </>
  );
}
