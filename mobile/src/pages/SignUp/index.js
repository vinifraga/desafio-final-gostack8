import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Alert } from 'react-native';
import * as Yup from 'yup';

import { signUpRequest } from '~/store/modules/auth/actions';

import logo from '~/assets/Logo/Logo.png';
import {
  Container,
  Form,
  FormInput,
  SubmitButton,
  Logo,
  SignLink,
  SignLinkText,
} from './styles';
import Background from '~/components/Background';

export default function SignUp({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailRef = useRef();
  const passwordRef = useRef();

  const loading = useSelector(state => state.auth.loading);
  const dispatch = useDispatch();

  const schema = Yup.object().shape({
    name: Yup.string().required('Full name is required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Minimum 6 characters')
      .required('Password is required'),
  });

  async function handleSubmit() {
    try {
      await schema.validate({
        name,
        email,
        password,
      });

      dispatch(signUpRequest(name, email, password));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  return (
    <Background>
      <Container>
        <Logo source={logo} />

        <Form>
          <FormInput
            keyboardType="default"
            autoCorrect={false}
            autoCapitalize="words"
            placeholder="Full name"
            returnKeyType="next"
            onSubmitEditing={() => {
              emailRef.current.focus();
            }}
            value={name}
            onChangeText={setName}
          />

          <FormInput
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Email"
            returnKeyType="next"
            ref={emailRef}
            onSubmitEditing={() => {
              passwordRef.current.focus();
            }}
            value={email}
            onChangeText={setEmail}
          />

          <FormInput
            secureTextEntry
            placeholder="Your secret password"
            ref={passwordRef}
            value={password}
            onChangeText={setPassword}
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
          />
          <SubmitButton onPress={handleSubmit} loading={loading}>
            Sign Up
          </SubmitButton>
        </Form>

        <SignLink onPress={() => navigation.navigate('SignIn')}>
          <SignLinkText>I&apos;ve already have an account</SignLinkText>
        </SignLink>
      </Container>
    </Background>
  );
}

SignUp.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};
