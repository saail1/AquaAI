import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { format, subDays } from 'date-fns';

import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { Header } from '../../src/components/layout/Header';
import { Card } from '../../src/components/common/Card';
import { WeeklyBarChart } from '../../src/components/charts/WeeklyBarChart';
import { HourlyHeatmap } from '../../src/components/charts/HourlyHeatmap';
import { useStats } from '../../src/hooks/useStats';
import { useGoal } from '../../src/hooks/useGoal';
import { formatMl } from '../../src/utils/formatters';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/constants/theme';

export default function StatsScreen() {
  const stats = useStats();
  const { goal } = useGoal();

  if (stats.isLoading) {
    return (
      <ScreenWrapper>
        <Header title="Statistics" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accentCyan} />
        </View>
      </ScreenWrapper>
    );
  }

  // Format data for WeeklyBarChart
  const getChartData = () => {
    const data = [];
    const today = format(new Date(), 'yyyy-MM-dd');
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      data.push({
        label: format(date, 'EEE'), // Mon, Tue
        value: stats.dailyTotals[dateStr] || 0,
        isToday: dateStr === today
      });
    }
    return data;
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Header title="Statistics" />

        {/* 1. Weekly Chart */}
        <Text style={styles.sectionTitle}>Weekly Overview</Text>
        <Card style={styles.chartCard}>
          <WeeklyBarChart data={getChartData()} goal={goal} />
        </Card>

        {/* 2. Key Metrics Grid */}
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.gridContainer}>
          <Card style={styles.gridCard}>
            <Text style={styles.gridValue}>{stats.goalHitRate}<Text style={styles.gridSub}>/7</Text></Text>
            <Text style={styles.gridLabel}>Days Met Goal</Text>
          </Card>
          
          <Card style={styles.gridCard}>
            <Text style={styles.gridValue}>{formatMl(stats.bestDay)}</Text>
            <Text style={styles.gridLabel}>Best Day</Text>
          </Card>
          
          <Card style={styles.gridCard}>
            <Text style={styles.gridValue}>{stats.topDrink}</Text>
            <Text style={styles.gridLabel}>Top Drink</Text>
          </Card>
          
          <Card style={styles.gridCard}>
            <Text style={styles.gridValue}>{formatMl(stats.weeklyAvg)}</Text>
            <Text style={styles.gridLabel}>Daily Avg</Text>
          </Card>
        </View>

        {/* 3. Hourly Heatmap */}
        <Text style={styles.sectionTitle}>Intake Heatmap (24h)</Text>
        <Card style={styles.heatmapCard}>
          <HourlyHeatmap hourlyData={stats.hourlyBreakdown} />
        </Card>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  chartCard: {
    marginBottom: SPACING.md,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  gridCard: {
    width: '47%',
    padding: SPACING.md,
    alignItems: 'flex-start',
  },
  gridValue: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.accentCyan,
  },
  gridSub: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
  gridLabel: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  heatmapCard: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xs,
  },
});