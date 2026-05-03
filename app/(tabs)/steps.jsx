import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { Header } from '../../src/components/layout/Header';
import { Card } from '../../src/components/common/Card';
import { useStepCounter } from '../../src/hooks/useStepCounter';
import { useStepStore } from '../../src/store/stepStore';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/constants/theme';

const QUICK_FOODS = [
  { label: 'Rice (1 cup)', calories: 206 },
  { label: 'Egg (1)', calories: 78 },
  { label: 'Roti (1)', calories: 120 },
  { label: 'Banana', calories: 89 },
  { label: 'Chicken (100g)', calories: 165 },
  { label: 'Milk (1 cup)', calories: 149 },
];

export default function StepsScreen() {
  const { steps, stepGoal, isTracking, startTracking, stopTracking, percentComplete, setStepGoal } = useStepCounter();
  const { calorieLogs, addCalorieLog, removeCalorieLog } = useStepStore();
  const [goalInput, setGoalInput] = useState(String(stepGoal));
  const [foodName, setFoodName] = useState('');
  const [foodCalories, setFoodCalories] = useState('');

  const totalCaloriesEaten = calorieLogs.reduce((sum, l) => sum + l.calories, 0);
  const caloriesBurned = Math.round(steps * 0.04);
  const netCalories = totalCaloriesEaten - caloriesBurned;

  const handleGoalSave = () => {
    const g = parseInt(goalInput);
    if (!g || g < 100) {
      Alert.alert('Invalid Goal', 'Please enter a valid step goal!');
      return;
    }
    setStepGoal(g);
    Alert.alert('✅ Goal Updated!', `Your step goal is now ${g.toLocaleString()} steps.`);
  };

  const handleAddFood = () => {
    if (!foodName || !foodCalories) {
      Alert.alert('Missing Info', 'Please enter food name and calories!');
      return;
    }
    addCalorieLog({ name: foodName, calories: parseInt(foodCalories) });
    setFoodName('');
    setFoodCalories('');
  };

  const handleQuickFood = (food) => {
    addCalorieLog({ name: food.label, calories: food.calories });
  };

  const handleDelete = (id) => {
    Alert.alert('Delete', 'Remove this food entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeCalorieLog(id) }
    ]);
  };

  const getMotivation = () => {
    if (percentComplete >= 100) return '🏆 Goal Achieved!';
    if (percentComplete >= 75) return '💪 Almost there!';
    if (percentComplete >= 50) return '🔥 Halfway there!';
    if (percentComplete >= 25) return '👣 Keep going!';
    return '🚀 Let\'s get moving!';
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Header title="Steps & Calories" />

        {/* Main Steps Card */}
        <Card style={styles.mainCard}>
          <Text style={styles.motivation}>{getMotivation()}</Text>
          <View style={styles.circleContainer}>
            <View style={styles.circle}>
              <Text style={styles.stepsNumber}>{steps.toLocaleString()}</Text>
              <Text style={styles.stepsLabel}>steps</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${percentComplete}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(percentComplete)}% of {stepGoal.toLocaleString()} goal</Text>
          <TouchableOpacity
            style={[styles.trackBtn, isTracking && styles.trackBtnStop]}
            onPress={isTracking ? stopTracking : startTracking}
          >
            <Ionicons name={isTracking ? 'stop-circle' : 'play-circle'} size={24} color="#000" />
            <Text style={styles.trackBtnText}>{isTracking ? 'Stop Tracking' : 'Start Tracking'}</Text>
          </TouchableOpacity>
          {isTracking && <Text style={styles.trackingText}>📡 Tracking your steps...</Text>}
        </Card>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{(steps * 0.0008).toFixed(2)}</Text>
            <Text style={styles.statLabel}>km</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{caloriesBurned}</Text>
            <Text style={styles.statLabel}>burned</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{Math.round(steps / 100)}</Text>
            <Text style={styles.statLabel}>mins active</Text>
          </Card>
        </View>

        {/* Calorie Summary */}
        <Card style={styles.calSummary}>
          <Text style={styles.calTitle}>🍽️ Calorie Balance</Text>
          <View style={styles.calRow}>
            <View style={styles.calItem}>
              <Text style={styles.calValue}>{totalCaloriesEaten}</Text>
              <Text style={styles.calLabel}>Eaten</Text>
            </View>
            <Text style={styles.calMinus}>−</Text>
            <View style={styles.calItem}>
              <Text style={styles.calValue}>{caloriesBurned}</Text>
              <Text style={styles.calLabel}>Burned</Text>
            </View>
            <Text style={styles.calMinus}>=</Text>
            <View style={styles.calItem}>
              <Text style={[styles.calValue, { color: netCalories > 2000 ? COLORS.danger : COLORS.success }]}>
                {netCalories}
              </Text>
              <Text style={styles.calLabel}>Net</Text>
            </View>
          </View>
        </Card>

        {/* Quick Add Foods */}
        <Text style={styles.sectionTitle}>Quick Add Food</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickScroll}>
          {QUICK_FOODS.map((food, index) => (
            <TouchableOpacity key={index} style={styles.quickChip} onPress={() => handleQuickFood(food)}>
              <Text style={styles.quickChipText}>{food.label}</Text>
              <Text style={styles.quickChipCal}>{food.calories} kcal</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Manual Add */}
        <Card style={styles.addCard}>
          <Text style={styles.addTitle}>Add Food Manually</Text>
          <TextInput
            style={styles.input}
            value={foodName}
            onChangeText={setFoodName}
            placeholder="Food name"
            placeholderTextColor={COLORS.textMuted}
          />
          <View style={styles.addRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={foodCalories}
              onChangeText={setFoodCalories}
              placeholder="Calories"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAddFood}>
              <Ionicons name="add" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Food Logs */}
        {calorieLogs.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Today's Food Log</Text>
            {calorieLogs.map((item) => (
              <Card key={item.id} style={styles.logCard}>
                <Ionicons name="restaurant-outline" size={20} color={COLORS.accentCyan} />
                <View style={styles.logInfo}>
                  <Text style={styles.logName}>{item.name}</Text>
                  <Text style={styles.logCal}>{item.calories} kcal</Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
                </TouchableOpacity>
              </Card>
            ))}
          </>
        )}

        {/* Goal Setting */}
        <Card style={styles.goalCard}>
          <Text style={styles.goalTitle}>Daily Step Goal</Text>
          <View style={styles.goalRow}>
            <TextInput
              style={styles.goalInput}
              value={goalInput}
              onChangeText={setGoalInput}
              keyboardType="numeric"
              placeholder="e.g. 10000"
              placeholderTextColor={COLORS.textMuted}
            />
            <TouchableOpacity style={styles.goalSaveBtn} onPress={handleGoalSave}>
              <Text style={styles.goalSaveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </Card>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 100 },
  mainCard: { padding: SPACING.lg, alignItems: 'center', marginBottom: SPACING.md },
  motivation: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.accentCyan, marginBottom: SPACING.lg },
  circleContainer: { marginBottom: SPACING.lg },
  circle: { width: 160, height: 160, borderRadius: 80, borderWidth: 6, borderColor: COLORS.accentCyan, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(6, 182, 212, 0.08)' },
  stepsNumber: { fontFamily: FONTS.bold, fontSize: 36, color: COLORS.textPrimary },
  stepsLabel: { fontFamily: FONTS.medium, fontSize: 14, color: COLORS.textMuted },
  progressBar: { width: '100%', height: 8, backgroundColor: COLORS.bgSurface, borderRadius: RADIUS.full, overflow: 'hidden', marginBottom: SPACING.xs },
  progressFill: { height: '100%', backgroundColor: COLORS.accentCyan, borderRadius: RADIUS.full },
  progressText: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textMuted, marginBottom: SPACING.lg },
  trackBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.accentCyan, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, borderRadius: RADIUS.full },
  trackBtnStop: { backgroundColor: COLORS.danger },
  trackBtnText: { fontFamily: FONTS.bold, fontSize: 15, color: '#000' },
  trackingText: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.md },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  statCard: { flex: 1, alignItems: 'center', padding: SPACING.md },
  statValue: { fontFamily: FONTS.bold, fontSize: 20, color: COLORS.accentCyan },
  statLabel: { fontFamily: FONTS.medium, fontSize: 12, color: COLORS.textMuted },
  calSummary: { padding: SPACING.lg, marginBottom: SPACING.md },
  calTitle: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.textPrimary, marginBottom: SPACING.md },
  calRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  calItem: { alignItems: 'center' },
  calValue: { fontFamily: FONTS.bold, fontSize: 22, color: COLORS.accentCyan },
  calLabel: { fontFamily: FONTS.medium, fontSize: 12, color: COLORS.textMuted },
  calMinus: { fontFamily: FONTS.bold, fontSize: 22, color: COLORS.textMuted },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: 18, color: COLORS.textPrimary, marginBottom: SPACING.sm },
  quickScroll: { marginBottom: SPACING.md },
  quickChip: { backgroundColor: COLORS.bgSurface, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, marginRight: SPACING.sm, alignItems: 'center' },
  quickChipText: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textPrimary },
  quickChipCal: { fontFamily: FONTS.bold, fontSize: 11, color: COLORS.accentCyan },
  addCard: { padding: SPACING.lg, marginBottom: SPACING.md },
  addTitle: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.textPrimary, marginBottom: SPACING.md },
  input: { backgroundColor: COLORS.bgSurface, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, color: COLORS.textPrimary, fontFamily: FONTS.medium, fontSize: 15, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, marginBottom: SPACING.sm },
  addRow: { flexDirection: 'row', gap: SPACING.sm, alignItems: 'center' },
  addBtn: { backgroundColor: COLORS.accentCyan, borderRadius: 10, padding: SPACING.sm, justifyContent: 'center', alignItems: 'center' },
  logCard: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, marginBottom: SPACING.sm, gap: SPACING.md },
  logInfo: { flex: 1 },
  logName: { fontFamily: FONTS.bold, fontSize: 15, color: COLORS.textPrimary },
  logCal: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textMuted },
  goalCard: { padding: SPACING.lg, marginTop: SPACING.sm },
  goalTitle: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.textPrimary, marginBottom: SPACING.md },
  goalRow: { flexDirection: 'row', gap: SPACING.sm },
  goalInput: { flex: 1, backgroundColor: COLORS.bgSurface, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, color: COLORS.textPrimary, fontFamily: FONTS.medium, fontSize: 16, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  goalSaveBtn: { backgroundColor: COLORS.accentCyan, borderRadius: 10, paddingHorizontal: SPACING.lg, justifyContent: 'center' },
  goalSaveBtnText: { fontFamily: FONTS.bold, fontSize: 15, color: '#000' },
});