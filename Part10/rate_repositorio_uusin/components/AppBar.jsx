import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useQuery, useApolloClient } from '@apollo/client';
import { useNavigate } from 'react-router-native';
import { ME } from '../graphql/queries';
import AuthStorage from '../utils/authStorage';
import Text from './Text';

const AppBar = () => {
  const navigate = useNavigate();
  const apolloClient = useApolloClient();
  const authStorage = new AuthStorage();

  const { data } = useQuery(ME, { fetchPolicy: 'cache-and-network' });
  const user = data?.me;

  const handleSignOut = async () => {
    await authStorage.removeAccessToken();
    await apolloClient.resetStore();
    navigate('/');
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigate('/')}>
        <Text style={styles.tab}>Repositories</Text>
      </Pressable>

      {user ? (
        <>
          <Pressable onPress={() => navigate('/create-review')}>
            <Text style={styles.tab}>Create Review</Text>
          </Pressable>

          <Pressable onPress={() => navigate('/my-reviews')}>
            <Text style={styles.tab}>My Reviews</Text>
          </Pressable>

          <Pressable onPress={handleSignOut}>
            <Text style={styles.tab}>Sign Out</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Pressable onPress={() => navigate('/signin')}>
            <Text style={styles.tab}>Sign In</Text>
          </Pressable>

          <Pressable onPress={() => navigate('/signup')}>
            <Text style={styles.tab}>Sign Up</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#24292e',
  },
  tab: {
    color: 'white',
    marginRight: 15,
    fontWeight: 'bold',
  },
});

export default AppBar;