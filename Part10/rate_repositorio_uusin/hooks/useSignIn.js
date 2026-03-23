import { useMutation, useApolloClient } from '@apollo/client';
import useAuthStorage from './useAuthStorage';
import { useCallback } from 'react';
import { AUTHENTICATE } from '../graphql/mutations';

const useSignIn = () => {
  const [mutate, result] = useMutation(AUTHENTICATE);
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();

  const signIn = useCallback(async ({ username, password }) => {
    const { data } = await mutate({ variables: { credentials: { username, password } } });
    const accessToken = data?.authenticate?.accessToken;
    if (accessToken) {
      await authStorage.setAccessToken(accessToken);
      await apolloClient.resetStore();
    }
    return { data };
  }, [mutate, authStorage, apolloClient]);

  return [signIn, result];
};

export default useSignIn;