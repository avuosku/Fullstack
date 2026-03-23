// src/components/SignOut.jsx
import { useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { useNavigate } from 'react-router-native';
import { useAuthStorage } from '../hooks/useAuthStorage';

const SignOut = () => {
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();
  const navigate = useNavigate();

  useEffect(() => {
    const doSignOut = async () => {
      await authStorage.removeAccessToken();
      await apolloClient.resetStore(); // 🔁 re-execute queries like "me"
      navigate('/');
    };

    doSignOut();
  }, []);

  return null;
};

export default SignOut;
