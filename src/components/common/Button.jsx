import React from 'react';
import { Text, StyleSheet, Pressable, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  icon, 
  isLoading = false, 
  disabled = false,
  style 
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 12, stiffness: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });
  };

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator color={variant === 'secondary' ? COLORS.textAccent : '#FFFFFF'} />;
    }
    return (
      <>
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={variant === 'secondary' ? COLORS.textAccent : '#FFFFFF'} 
            style={styles.icon} 
          />
        )}
        <Text style={[styles.text, styles[`text_${variant}`]]}>{title}</Text>
      </>
    );
  };

  const baseStyle = [styles.button, disabled && styles.disabled, style];

  if (variant === 'primary') {
    return (
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled || isLoading}
        style={[...baseStyle, animatedStyle]}
      >
        <LinearGradient
          colors={COLORS.gradientMain}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[StyleSheet.absoluteFill, { borderRadius: RADIUS.full }]}
        />
        <View style={styles.contentContainer}>
          {renderContent()}
        </View>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[...baseStyle, styles[`bg_${variant}`], animatedStyle]}
    >
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...SHADOWS.glow,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    width: '100%',
    height: '100%',
  },
  bg_secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 0,
    shadowOpacity: 0,
  },
  bg_danger: {
    backgroundColor: COLORS.danger,
    elevation: 0,
    shadowOpacity: 0,
  },
  text: {
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  text_primary: {
    color: '#FFFFFF',
  },
  text_secondary: {
    color: COLORS.textAccent,
  },
  text_danger: {
    color: '#FFFFFF',
  },
  icon: {
    marginRight: SPACING.sm,
  },
  disabled: {
    opacity: 0.5,
  },
});