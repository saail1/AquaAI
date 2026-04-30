import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS } from '../../constants/theme';

export const WaterProgress = ({ percent = 0, height = 8 }) => {
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    // Cap percent at 100 for the visual bar
    const targetPercent = Math.min(Math.max(percent, 0), 100);
    progressWidth.value = withSpring(targetPercent, {
      damping: 15,
      stiffness: 90,
    });
  }, [percent]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    };
  });

  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <Animated.View style={[styles.fill, animatedStyle]}>
        <LinearGradient
          colors={COLORS.gradientMain}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: COLORS.bgSurface,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
});