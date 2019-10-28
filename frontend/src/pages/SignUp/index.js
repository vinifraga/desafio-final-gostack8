import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input } from '@rocketseat/unform';
import { useSelector, useDispatch } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import * as Yup from 'yup';

import * as AuthActions from '~/store/modules/auth/actions';
import logo from '~/assets/logo.svg';

const schema = Yup.object().shape({
  name: Yup.string().required('Full name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Minimum 6 characters')
    .required('Password is required'),
});

export default function SignUp() {
  const loading = useSelector(state => state.auth.loading);
  const dispatch = useDispatch();
  function handleSubmit({ name, email, password }) {
    dispatch(AuthActions.signUpRequest(name, email, password));
  }
  return (
    <>
      <img src={logo} alt="MeetApp_Logo" />
      <Form schema={schema} onSubmit={handleSubmit}>
        <Input name="name" type="text" placeholder="Full name" />
        <Input name="email" type="email" placeholder="Email" />
        <Input
          name="password"
          type="password"
          placeholder="Your secret password"
        />
        <button disabled={loading} type="submit">
          {loading ? <FaSpinner color="#FFF" /> : 'Sign Up'}
        </button>
      </Form>
      <Link to="/">I&apos;ve already have an account</Link>
    </>
  );
}
