import React, { useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSequence, 
  withTiming, 
  withSpring,
  runOnJS
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useUiStore } from '../../store/uiStore';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';

export const Toast = () => {
  const { toast, hideToast } = useUiStore();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (toast.visible) {
      translateY.value = withSpring(0, { damping: 12, stiffness: 90 });
      opacity.value = withTiming(1, { duration: 300 });
      
      const timer = setTimeout(() => {
        translateY.value = withTiming(-100, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 }, (finished) => {
          if (finished) {
            runOnJS(hideToast)();
          }
        });
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      translateY.value = withTiming(-100, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [toast.visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!toast.visible && opacity.value === 0) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'alert-circle';
      default: return 'information-circle';
    }
  };

  const getColor = () => {
    switch (toast.type) {
      case 'success': return COLORS.success;
      case 'error': return COLORS.danger;
      default: return COLORS.accentCyan;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} pointerEvents="none">
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.content}>
          <Ionicons name={getIcon()} size={24} color={getColor()} style={styles.icon} />
          <Text style={styles.message}>{toast.message}</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 9999,
    elevation: 9999,
  },
  container: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  message: {
    flex: 1,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
});