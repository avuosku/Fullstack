// src/components/CreateReview.jsx

import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-native';

import Text from './Text';
import { CREATE_REVIEW } from '../graphql/mutations';

const validationSchema = yup.object().shape({
  ownerName: yup
    .string()
    .required("Repository owner's username is required"),

  repositoryName: yup
    .string()
    .required("Repository name is required"),

  rating: yup
    .number()
    .min(0, 'Rating must be between 0 and 100')
    .max(100, 'Rating must be between 0 and 100')
    .required('Rating is required'),

  text: yup
    .string()
});

const initialValues = {
  ownerName: '',
  repositoryName: '',
  rating: '',
  text: '',
};

const CreateReview = () => {
  const navigate = useNavigate();
  const [createReview] = useMutation(CREATE_REVIEW);

  const onSubmit = async (values) => {
    const { ownerName, repositoryName, rating, text } = values;

    try {
      const result = await createReview({
        variables: {
          review: {
            ownerName,
            repositoryName,
            rating: Number(rating),
            text,
          },
        },
      });

      const repositoryId = result.data.createReview.repositoryId;

      navigate(`/repository/${repositoryId}`);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleChange, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>

          <TextInput
            placeholder="Repository owner's GitHub username"
            value={values.ownerName}
            onChangeText={handleChange('ownerName')}
            style={styles.input}
          />
          {touched.ownerName && errors.ownerName && (
            <Text style={styles.error}>{errors.ownerName}</Text>
          )}

          <TextInput
            placeholder="Repository name"
            value={values.repositoryName}
            onChangeText={handleChange('repositoryName')}
            style={styles.input}
          />
          {touched.repositoryName && errors.repositoryName && (
            <Text style={styles.error}>{errors.repositoryName}</Text>
          )}

          <TextInput
            placeholder="Rating between 0 and 100"
            value={values.rating}
            onChangeText={handleChange('rating')}
            keyboardType="numeric"
            style={styles.input}
          />
          {touched.rating && errors.rating && (
            <Text style={styles.error}>{errors.rating}</Text>
          )}

          <TextInput
            placeholder="Review"
            value={values.text}
            onChangeText={handleChange('text')}
            multiline
            style={styles.input}
          />

          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Create review</Text>
          </Pressable>

        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({

  container: {
    padding: 15,
    backgroundColor: 'white'
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },

  error: {
    color: 'red',
    marginBottom: 10
  },

  button: {
    backgroundColor: '#0366d6',
    padding: 15,
    borderRadius: 5
  },

  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  }

});

export default CreateReview;