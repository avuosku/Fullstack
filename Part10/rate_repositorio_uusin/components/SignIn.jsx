import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import Text from './Text';
import useSignIn from '../hooks/useSignIn';
import { useNavigate } from 'react-router-native';

const validationSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const SignIn = () => {
  const [signIn] = useSignIn();
  const navigate = useNavigate();
  const [formError, setFormError] = useState(null);

  const onSubmit = async (values) => {
    try {
      const { data } = await signIn(values);
      if (data?.authenticate?.accessToken) {
        setFormError(null);
        navigate('/');
      }
    } catch (e) {
      setFormError('Invalid username or password');
    }
  };

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          {formError && <Text style={styles.formError}>{formError}</Text>}

          <TextInput
            placeholder="Username"
            value={values.username}
            onChangeText={handleChange('username')}
            onBlur={handleBlur('username')}
            style={[styles.input, touched.username && errors.username && styles.inputError]}
          />
          {touched.username && errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

          <TextInput
            placeholder="Password"
            value={values.password}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            secureTextEntry
            style={[styles.input, touched.password && errors.password && styles.inputError]}
          />
          {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <Button title="Sign In" onPress={handleSubmit} />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: 'white' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 10, marginBottom: 5 },
  inputError: { borderColor: '#d73a4a' },
  errorText: { color: '#d73a4a', marginBottom: 5 },
  formError: { color: '#d73a4a', fontWeight: 'bold', marginBottom: 10 },
});

export default SignIn;