import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { NativeRouter } from 'react-router-native';
import client from './graphql/ApolloClient';
import Main from './Main';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NativeRouter>
        <Main />
      </NativeRouter>
    </ApolloProvider>
  );
}