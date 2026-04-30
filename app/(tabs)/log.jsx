import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { format } from 'date-fns';

import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { Header } from '../../src/components/layout/Header';
import { Card } from '../../src/components/common/Card';
import { WaterProgress } from '../../src/components/water/WaterProgress';
import { useWater } from '../../src/hooks/useWater';
import { useGoal } from '../../src/hooks/useGoal';
import { formatMl, formatTime } from '../../src/utils/formatters';
import { QUICK_DRINKS } from '../../src/constants/drinks';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/constants/theme';
import { useRouter } from 'expo-router';

export default function LogScreen() {
  const router = useRouter();
  const { logs, todayTotal, removeLog } = useWater();
  const { goal, percentComplete } = useGoal();

  // Sort logs: newest first
  const sortedLogs = [...logs].sort((a, b) => {
    const timeA = a.timestamp?.seconds || 0;
    const timeB = b.timestamp?.seconds || 0;
    return timeB - timeA;
  });

  const getDrinkIcon = (type) => {
    const drink = QUICK_DRINKS.find(d => d.id === type || d.label.toLowerCase() === type.toLowerCase());
    return drink ? drink.icon : 'water';
  };

  const handleDelete = (logId, ml) => {
    Alert.alert(
      "Delete Entry",
      `Are you sure you want to remove this ${ml}ml drink?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => removeLog(logId, ml) }
      ]
    );
  };

  const renderItem = ({ item, index }) => (
    <Animated.View entering={FadeInRight.delay(index * 100).duration(400)}>
      <View style={styles.logItemContainer}>
        {/* Timeline Line */}
        <View style={styles.timeline}>
          <View style={styles.timelineDot} />
          {index !== sortedLogs.length - 1 && <View style={styles.timelineLine} />}
        </View>

        {/* Time */}
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(item.timestamp)}</Text>
        </View>

        {/* Card */}
        <Card style={styles.logCard}>
          <View style={styles.logCardLeft}>
            <Ionicons name={getDrinkIcon(item.drinkType)} size={24} color={COLORS.accentCyan} />
            <Text style={styles.drinkLabel}>{item.label}</Text>
          </View>
          
          <View style={styles.logCardRight}>
            <View style={styles.mlBadge}>
              <Text style={styles.mlBadgeText}>+{item.ml}ml</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id, item.ml)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Ionicons name="trash-outline" size={20} color={COLORS.danger} style={styles.deleteIcon} />
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </Animated.View>
  );

  return (
    <ScreenWrapper>
      <Header title="Activity Log" />
      
      {/* Summary Bar */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Today's Progress</Text>
          <Text style={styles.summaryText}>{formatMl(todayTotal)} / {formatMl(goal)}</Text>
        </View>
        <WaterProgress percent={percentComplete} height={6} />
      </View>

      {sortedLogs.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="water-outline" size={80} color={COLORS.border} />
          <Text style={styles.emptyTitle}>No drinks logged yet</Text>
          <Text style={styles.emptySubtitle}>Tap the + button to log your first drink of the day.</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/(tabs)/home')}>
            <Text style={styles.emptyBtnText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={sortedLogs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  summaryContainer: {
    marginBottom: SPACING.xl,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  summaryTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  summaryText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  listContent: {
    paddingBottom: 100, // For bottom tab bar
  },
  logItemContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    minHeight: 60,
  },
  timeline: {
    width: 24,
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accentCyan,
    marginTop: 24, // align with card center
    shadowColor: COLORS.accentCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.border,
    marginTop: 4,
  },
  timeContainer: {
    width: 65,
    justifyContent: 'center',
    paddingTop: 4,
  },
  timeText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  logCard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
  },
  logCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  drinkLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  logCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  mlBadge: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  mlBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.accentCyan,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyTitle: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  emptyBtn: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyBtnText: {
    fontFamily: FONTS.bold,
    color: COLORS.accentCyan,
  },
});