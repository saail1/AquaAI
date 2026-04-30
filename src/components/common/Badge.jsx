import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants/theme';

export const Badge = ({ label, variant = 'primary', style }) => {
  if (variant === 'primary') {
    return (
      <View style={[styles.container, style]}>
        <LinearGradient
          colors={COLORS.gradientMain}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[StyleSheet.absoluteFill, { borderRadius: RADIUS.full }]}
        />
        <Text style={styles.textPrimary}>{label}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles[`bg_${variant}`], style]}>
      <Text style={[styles.text, styles[`text_${variant}`]]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  bg_secondary: {
    backgroundColor: COLORS.bgSurface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bg_success: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  bg_warning: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  textPrimary: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  text: {
    fontFamily: FONTS.semiBold,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  text_secondary: {
    color: COLORS.textMuted,
  },
  text_success: {
    color: COLORS.success,
  },
  text_warning: {
    color: COLORS.warning,
  },
});