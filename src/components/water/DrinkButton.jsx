import React from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const DrinkButton = ({ label, ml, icon, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 12, stiffness: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={[styles.container, animatedStyle]}
    >
      <View style={styles.gradientTopBorder} />
      <Ionicons name={icon} size={28} color={COLORS.accentCyan} style={styles.icon} />
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
      <Text style={styles.mlText}>{ml === 0 ? 'Custom' : `+${ml}ml`}</Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    aspectRatio: 1, // Keeps buttons perfectly square
    overflow: 'hidden',
  },
  gradientTopBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.accentBlue, // Simulating gradient top edge
  },
  icon: {
    marginBottom: SPACING.xs,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  mlText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
});