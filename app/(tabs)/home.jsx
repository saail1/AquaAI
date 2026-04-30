import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { Header } from '../../src/components/layout/Header';
import { Card } from '../../src/components/common/Card';
import { WineGlass } from '../../src/components/water/WineGlass';
import { WaterProgress } from '../../src/components/water/WaterProgress';
import { DrinkButton } from '../../src/components/water/DrinkButton';
import { CustomAmountModal } from '../../src/components/water/CustomAmountModal';
import { CircularRing } from '../../src/components/charts/CircularRing';
import { AiCoachCard } from '../../src/components/ai/AiCoachCard';

import { useWater } from '../../src/hooks/useWater';
import { useGoal } from '../../src/hooks/useGoal';
import { useStreak } from '../../src/hooks/useStreak';
import { useStats } from '../../src/hooks/useStats';
import { useUiStore } from '../../src/store/uiStore';

import { QUICK_DRINKS } from '../../src/constants/drinks';
import { formatMl } from '../../src/utils/formatters';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  
  // Connect to our Custom Hooks
  const { todayTotal, addLog } = useWater();
  const { goal, remaining, percentComplete } = useGoal();
  const { streak } = useStreak();
  const { weeklyAvg } = useStats();
  const { toggleCustomModal, showToast } = useUiStore();

  const handleQuickAdd = async (drink) => {
    if (drink.ml === 0) {
      toggleCustomModal(true);
    } else {
      const { success, error } = await addLog(drink.id, drink.label, drink.ml);
      if (success) {
        showToast(`Added ${drink.ml}ml of ${drink.label}`, 'success');
      } else {
        showToast(error || 'Failed to add drink', 'error');
      }
    }
  };

  // Streak Flame Pulse Animation
  const pulseScale = useSharedValue(1);
  useEffect(() => {
    if (streak > 0) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 600 }), 
          withTiming(1, { duration: 600 })
        ),
        -1,
        true
      );
    } else {
      pulseScale.value = 1;
    }
  }, [streak]);
  
  const pulseStyle = useAnimatedStyle(() => ({ 
    transform: [{ scale: pulseScale.value }] 
  }));

  return (
    <ScreenWrapper>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <Header />

        {/* 1. HERO SECTION */}
        <Card style={styles.heroCard} noPadding>
          <LinearGradient
            colors={COLORS.gradientCard}
            style={styles.heroGradient}
          >
            <WineGlass totalMl={todayTotal} goalMl={goal} />
            
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTotalText}>{formatMl(todayTotal)}</Text>
              <Text style={styles.heroSubText}>consumed today</Text>
              <Text style={styles.heroRemainingText}>
                {remaining > 0 
                  ? `${formatMl(remaining)} remaining to reach your ${formatMl(goal)} goal` 
                  : 'Daily goal reached! Outstanding work!'}
              </Text>
            </View>

            <View style={styles.progressContainer}>
              <WaterProgress percent={percentComplete} />
            </View>
          </LinearGradient>
        </Card>

        {/* 2. STATS ROW */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.statsRow}
        >
          <Card style={styles.statCard}>
            <CircularRing percent={percentComplete} size={60} strokeWidth={6}>
              <Text style={styles.statRingText}>{Math.round(percentComplete)}%</Text>
            </CircularRing>
            <Text style={styles.statLabel}>Today</Text>
          </Card>

          <Card style={styles.statCard}>
            <Animated.View style={[styles.iconContainer, pulseStyle]}>
              <Ionicons 
                name={streak > 0 ? "flame" : "flame-outline"} 
                size={36} 
                color={streak > 0 ? COLORS.warning : COLORS.textMuted} 
              />
            </Animated.View>
            <Text style={styles.statMainText}>{streak}</Text>
            <Text style={styles.statLabel}>day streak</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.iconContainer}>
              <Ionicons 
                name={weeklyAvg >= goal ? "trending-up" : "trending-down"} 
                size={32} 
                color={weeklyAvg >= goal ? COLORS.success : COLORS.textMuted} 
              />
            </View>
            <Text style={styles.statMainText}>{formatMl(weeklyAvg)}</Text>
            <Text style={styles.statLabel}>weekly avg</Text>
          </Card>
        </ScrollView>

        {/* 3. QUICK ADD GRID */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Log a Drink</Text>
        </View>
        <View style={styles.gridContainer}>
          {QUICK_DRINKS.map((drink, index) => (
            <View key={index} style={styles.gridItem}>
              <DrinkButton 
                label={drink.label} 
                ml={drink.ml} 
                icon={drink.icon} 
                onPress={() => handleQuickAdd(drink)} 
              />
            </View>
          ))}
        </View>

        {/* 4. AI COACH PREVIEW */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Insight</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/ai-coach')}>
            <Text style={styles.linkText}>View full analysis →</Text>
          </TouchableOpacity>
        </View>
        <AiCoachCard 
          compact 
          onGenerate={() => router.push('/(tabs)/ai-coach')} 
        />
        
        {/* Bottom padding to ensure scroll clears the absolute Tab Bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Renders over the screen when toggled via Zustand store */}
      <CustomAmountModal />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  heroCard: {
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  heroGradient: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  heroTextContainer: {
    alignItems: 'center',
    marginTop: -10, // Pull text slightly closer to the glass
    marginBottom: SPACING.lg,
  },
  heroTotalText: {
    fontFamily: FONTS.extraBold,
    fontSize: 42,
    color: COLORS.textPrimary,
    letterSpacing: -1,
    ...SHADOWS.glow,
    shadowColor: COLORS.accentBlue,
  },
  heroSubText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: -4,
  },
  heroRemainingText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.textAccent,
    marginTop: SPACING.sm,
  },
  progressContainer: {
    width: '100%',
    paddingHorizontal: SPACING.sm,
  },
  statsRow: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
    paddingBottom: 8, // Prevent shadow clipping
  },
  statCard: {
    width: 110,
    alignItems: 'center',
    padding: SPACING.md,
  },
  iconContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statRingText: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  statMainText: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  linkText: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: COLORS.accentCyan,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: SPACING.xl,
  },
  gridItem: {
    width: '23%', // Fits 4 items per row with gaps
    minWidth: 75,
  },
  bottomSpacer: {
    height: 100, // Space for custom tab bar
  },
});