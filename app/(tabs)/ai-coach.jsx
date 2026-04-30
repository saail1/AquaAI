import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { Header } from '../../src/components/layout/Header';
import { AiCoachCard } from '../../src/components/ai/AiCoachCard';
import { Card } from '../../src/components/common/Card';
import { useAiCoach } from '../../src/hooks/useAiCoach';
import { HYDRATION_TIPS } from '../../src/constants/tips';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/constants/theme';

export default function AiCoachScreen() {
  const { insight, isLoading, error, fetchInsight, score } = useAiCoach();
  const [dailyTip, setDailyTip] = useState(HYDRATION_TIPS[0]);

  useEffect(() => {
    // Pick a random tip daily based on date to ensure it doesn't flip on every render
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const tipIndex = dayOfYear % HYDRATION_TIPS.length;
    setDailyTip(HYDRATION_TIPS[tipIndex]);
  }, []);

  const getScoreGrade = (s) => {
    if (s >= 90) return { grade: 'A', color: COLORS.success };
    if (s >= 80) return { grade: 'B', color: COLORS.accentCyan };
    if (s >= 70) return { grade: 'C', color: COLORS.warning };
    return { grade: 'D', color: COLORS.danger };
  };

  const { grade, color } = getScoreGrade(score);

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.headerContainer}>
          <Header title="AI Coach" />
          <View style={styles.badgeContainer}>
            <LinearGradient
              colors={COLORS.gradientMain}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[StyleSheet.absoluteFill, { borderRadius: RADIUS.full }]}
            />
            <Text style={styles.badgeText}>Powered by Claude</Text>
          </View>
        </View>

        {/* 1. Main Insight Generation */}
        <AiCoachCard 
          insight={insight}
          isLoading={isLoading}
          error={error}
          onGenerate={fetchInsight}
        />

        {/* 2. Score Section */}
        <Text style={styles.sectionTitle}>Daily Hydration Score</Text>
        <Card style={styles.scoreCard}>
          <View style={styles.scoreRow}>
            <View style={[styles.gradeCircle, { borderColor: color }]}>
              <Text style={[styles.gradeText, { color }]}>{grade}</Text>
            </View>
            <View style={styles.scoreTextContainer}>
              <Text style={styles.scoreNumber}>{score}<Text style={styles.scoreMax}>/100</Text></Text>
              <Text style={styles.scoreDesc}>
                Based on volume, pacing, and consistency.
              </Text>
            </View>
          </View>
        </Card>

        {/* 3. Daily Tip */}
        <Text style={styles.sectionTitle}>Tip of the Day</Text>
        <Card style={styles.tipCard}>
          <View style={styles.tipGradientTop} />
          <Text style={styles.tipText}>"{dailyTip.text}"</Text>
          <Text style={styles.tipSource}>— Focus: {dailyTip.source}</Text>
        </Card>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
  headerContainer: {
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    right: 0,
    top: -5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  badgeText: {
    fontFamily: FONTS.bold,
    fontSize: 9,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.textPrimary,
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  scoreCard: {
    padding: SPACING.lg,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  gradeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bgSurface,
  },
  gradeText: {
    fontFamily: FONTS.extraBold,
    fontSize: 28,
  },
  scoreTextContainer: {
    flex: 1,
  },
  scoreNumber: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  scoreMax: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
  scoreDesc: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  tipCard: {
    padding: SPACING.lg,
    overflow: 'hidden',
  },
  tipGradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.accentTeal,
  },
  tipText: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  tipSource: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.textAccent,
    marginTop: SPACING.md,
    textAlign: 'right',
  },
});