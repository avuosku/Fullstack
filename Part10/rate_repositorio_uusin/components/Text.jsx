import React from 'react';
import { Text as NativeText, StyleSheet } from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
  text: {
    fontFamily: theme.fonts.main,
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontWeights.normal,
    color: theme.colors.textPrimary,
  },
  colorTextWhite: {
    color: theme.colors.textWhite,
  },
  fontWeightBold: {
    fontWeight: theme.fontWeights.bold,
  },
  fontSizeSubheading: {
    fontSize: theme.fontSizes.subheading,
  },
});

const Text = ({ color, fontSize, fontWeight, style, ...props }) => {
  const textStyle = [
    styles.text,
    color === 'textWhite' && styles.colorTextWhite,
    fontSize === 'subheading' && styles.fontSizeSubheading,
    fontWeight === 'bold' && styles.fontWeightBold,
    style,
  ];

  return <NativeText style={textStyle} {...props} />;
};

export default Text;
