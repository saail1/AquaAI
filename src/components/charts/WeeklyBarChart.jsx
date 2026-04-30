import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants/theme';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

const Bar = ({ label, value, maxVal, goal, isToday }) => {
  const heightProgress = useSharedValue(0);
  
  // Ensure we don't divide by zero
  const safeMax = Math.max(maxVal, goal, 1);
  const targetHeight = (value / safeMax) * 100;

  useEffect(() => {
    heightProgress.value = withTiming(targetHeight, { duration: 800 });
  }, [value, maxVal]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: `${heightProgress.value}%`,
  }));

  return (
    <View style={styles.barContainer}>
      <Text style={styles.valueText}>{value > 0 ? value : ''}</Text>
      <View style={styles.track}>
        <AnimatedGradient
          colors={COLORS.gradientMain}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={[
            styles.fill,
            animatedStyle,
            isToday && styles.glow
          ]}
        />
      </View>
      <Text style={[styles.label, isToday && styles.labelToday]}>{label}</Text>
    </View>
  );
};

export const WeeklyBarChart = ({ data, goal }) => {
  // data should be array of { label: 'Mon', value: 1500, isToday: false }
  const maxVal = Math.max(...data.map(d => d.value));

  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <Bar 
          key={index} 
          label={item.label} 
          value={item.value} 
          maxVal={maxVal} 
          goal={goal}
          isToday={item.isToday}
        />
      ))}
      {/* Goal Line */}
      <View style={[styles.goalLine, { bottom: `${Math.min((goal / Math.max(maxVal, goal, 1)) * 100, 100)}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    position: 'relative',
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  track: {
    width: 24,
    height: '75%', // Leaves room for text above/below
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.sm,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginVertical: SPACING.xs,
  },
  fill: {
    width: '100%',
    borderRadius: RADIUS.sm,
  },
  glow: {
    shadowColor: COLORS.accentCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  valueText: {
    fontFamily: FONTS.semiBold,
    fontSize: 10,
    color: COLORS.textMuted,
    height: 14,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  labelToday: {
    fontFamily: FONTS.bold,
    color: COLORS.textAccent,
  },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    borderTopWidth: 1,
    borderColor: COLORS.textMuted,
    borderStyle: 'dashed',
    opacity: 0.5,
    marginBottom: 20, // Offset for the label area
  },
});