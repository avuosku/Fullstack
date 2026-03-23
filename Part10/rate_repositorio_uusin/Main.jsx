import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Routes, Route, Navigate } from 'react-router-native';

import AppBar from './components/AppBar';
import RepositoryList from './components/RepositoryList';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import CreateReview from './components/CreateReview';
import MyReviews from './components/MyReviews';
import RepositoryView from './components/RepositoryView'; // LISÄÄ TÄMÄ

const styles = StyleSheet.create({
  container: { flex: 1 },
});

const Main = () => {
  return (
    <View style={styles.container}>
      <AppBar />

      <Routes>
        <Route path="/" element={<RepositoryList />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />}/>
        <Route path="/create-review" element={<CreateReview />} />
        <Route path="/my-reviews" element={<MyReviews />} />
        <Route path="/repository/:id" element={<RepositoryView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

    </View>
  );
};

export default Main;