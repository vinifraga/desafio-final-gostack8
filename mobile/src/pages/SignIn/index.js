import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Alert } from 'react-native';
import * as Yup from 'yup';

import { signInRequest } from '~/store/modules/auth/actions';

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

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const passwordRef = useRef();

  const loading = useSelector(state => state.auth.loading);
  const dispatch = useDispatch();

  const schema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  async function handleSubmit() {
    try {
      await schema.validate({
        email,
        password,
      });

      dispatch(signInRequest(email, password));
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
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Email"
            returnKeyType="next"
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
            Sign In
          </SubmitButton>
        </Form>

        <SignLink onPress={() => navigation.navigate('SignUp')}>
          <SignLinkText>Create a free account</SignLinkText>
        </SignLink>
      </Container>
    </Background>
  );
}

SignIn.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};
