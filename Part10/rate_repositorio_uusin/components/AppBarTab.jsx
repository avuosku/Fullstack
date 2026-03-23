import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Link, useLocation } from 'react-router-native';
import Text from './Text';

const styles = StyleSheet.create({
  tab: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  active: {
    color: 'white',
  },
  inactive: {
    color: 'white',
  },
});

const AppBarTab = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} component={Pressable}>
      <Text style={[styles.tab, isActive ? styles.active : styles.inactive]}>
        {children}
      </Text>
    </Link>
  );
};

export default AppBarTab;
