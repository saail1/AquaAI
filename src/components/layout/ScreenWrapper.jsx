import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../../constants/theme';

export const ScreenWrapper = ({ children, style, noPadding = false, bg = COLORS.bgDeep }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={[
        styles.content, 
        { 
          paddingTop: insets.top + SPACING.sm,
          paddingBottom: insets.bottom 
        },
        !noPadding && styles.defaultPadding,
        style
      ]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  defaultPadding: {
    paddingHorizontal: SPACING.lg,
  },
});