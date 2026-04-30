import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Path, Defs, ClipPath, Rect, Line } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SHADOWS } from '../../constants/theme';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export const WineGlass = ({ totalMl = 0, goalMl = 2500 }) => {
  const percentComplete = goalMl > 0 ? Math.min((totalMl / goalMl), 1) : 0;
  
  // Animation value for the water level (0 = empty, 1 = full)
  const fillProgress = useSharedValue(0);

  useEffect(() => {
    // Spring animation for realistic fluid motion when adding water
    fillProgress.value = withSpring(percentComplete, {
      damping: 15,
      stiffness: 90,
    });
  }, [totalMl, goalMl]);

  // SVG Coordinate Constants
  const CANVAS_WIDTH = 220;
  const CANVAS_HEIGHT = 300;
  const BOWL_TOP_Y = 30;
  const BOWL_BOTTOM_Y = 220;
  const MAX_WATER_HEIGHT = BOWL_BOTTOM_Y - BOWL_TOP_Y;

  // The precise path drawing the goblet shape
  const gobletPath = `
    M30 30 
    C30 180, 100 220, 100 220 
    L100 260 
    C70 260, 60 270, 60 280 
    C60 290, 160 290, 160 280 
    C160 270, 150 260, 120 260 
    L120 220 
    C120 220, 190 180, 190 30 
    Z
  `;

  const animatedProps = useAnimatedProps(() => {
    const currentHeight = fillProgress.value * MAX_WATER_HEIGHT;
    const yPosition = BOWL_BOTTOM_Y - currentHeight;
    return {
      y: yPosition,
      height: currentHeight,
    };
  });

  const displayPercent = Math.round(percentComplete * 100);

  return (
    <View style={styles.container}>
      <View style={styles.glowWrapper}>
        <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT} viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}>
          <Defs>
            <ClipPath id="glassClip">
              <Path d={gobletPath} />
            </ClipPath>
          </Defs>

          {/* 1. The Water Fill (Clipped to the glass shape) */}
          <AnimatedRect
            x="0"
            width={CANVAS_WIDTH}
            fill={COLORS.accentTeal}
            opacity="0.85"
            clipPath="url(#glassClip)"
            animatedProps={animatedProps}
          />
          
          {/* Overlaid Gradient for the water depth effect */}
          <AnimatedRect
            x="0"
            width={CANVAS_WIDTH}
            fill={COLORS.accentBlue}
            opacity="0.4"
            clipPath="url(#glassClip)"
            animatedProps={animatedProps}
          />

          {/* 2. Glass Outline */}
          <Path 
            d={gobletPath} 
            stroke="rgba(6, 182, 212, 0.5)" 
            strokeWidth="3" 
            fill="none" 
          />

          {/* 3. Glass Reflection Highlight */}
          <Line 
            x1="45" 
            y1="50" 
            x2="65" 
            y2="120" 
            stroke="rgba(255, 255, 255, 0.2)" 
            strokeWidth="4" 
            strokeLinecap="round"
          />
        </Svg>

        {/* 4. Overlay Text */}
        <View style={[StyleSheet.absoluteFill, styles.textOverlay]}>
          <Text style={styles.percentText}>{displayPercent}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  glowWrapper: {
    ...SHADOWS.glow,
  },
  textOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    top: -40, // Adjust to center inside the bowl
  },
  percentText: {
    fontFamily: FONTS.extraBold,
    fontSize: 32,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});