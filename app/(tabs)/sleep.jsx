import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { Header } from '../../src/components/layout/Header';
import { Card } from '../../src/components/common/Card';
import { useSleep } from '../../src/hooks/useSleep';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/constants/theme';

const QUALITY_OPTIONS = [
  { label: '😴 Poor', value: 1, color: '#FF4444' },
  { label: '😐 Fair', value: 2, color: '#FFA500' },
  { label: '🙂 Good', value: 3, color: '#06B6D4' },
  { label: '😊 Great', value: 4, color: '#00C48C' },
];

export default function SleepScreen() {
  const { sleepLogs, logSleep, removeSleepLog, avgSleep, avgQuality } = useSleep();

  const [bedTime, setBedTime] = useState(new Date());
  const [wakeTime, setWakeTime] = useState(new Date());
  const [showBed, setShowBed] = useState(false);
  const [showWake, setShowWake] = useState(false);
  const [quality, setQuality] = useState(3);
  const [notes, setNotes] = useState('');

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getQualityLabel = (val) => QUALITY_OPTIONS.find(q => q.value === val)?.label || '';
  const getQualityColor = (val) => QUALITY_OPTIONS.find(q => q.value === val)?.color || COLORS.accentCyan;

  const handleSave = () => {
    logSleep(bedTime, wakeTime, quality, notes);
    setNotes('');
    setQuality(3);
    Alert.alert('✅ Sleep Logged!', 'Your sleep has been recorded.');
  };

  const handleDelete = (id) => {
    Alert.alert('Delete', 'Remove this sleep entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeSleepLog(id) }
    ]);
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Header title="Sleep Tracker" />

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Ionicons name="moon" size={22} color={COLORS.accentCyan} />
            <Text style={styles.statValue}>{avgSleep} hrs</Text>
            <Text style={styles.statLabel}>Avg Sleep</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="star" size={22} color="#FFA500" />
            <Text style={styles.statValue}>{avgQuality}/4</Text>
            <Text style={styles.statLabel}>Avg Quality</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="calendar" size={22} color={COLORS.accentCyan} />
            <Text style={styles.statValue}>{sleepLogs.length}</Text>
            <Text style={styles.statLabel}>Total Logs</Text>
          </Card>
        </View>

        {/* Log Form */}
        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>Log Your Sleep</Text>

          {/* Bed Time */}
          <TouchableOpacity style={styles.timeRow} onPress={() => setShowBed(true)}>
            <Ionicons name="bed-outline" size={22} color={COLORS.textMuted} />
            <Text style={styles.timeLabel}>Bed Time</Text>
            <Text style={styles.timeValue}>{formatTime(bedTime)}</Text>
          </TouchableOpacity>
          {showBed && (
            <DateTimePicker
              value={bedTime}
              mode="time"
              is24Hour={false}
              onChange={(e, date) => { setShowBed(false); if (date) setBedTime(date); }}
            />
          )}

          {/* Wake Time */}
          <TouchableOpacity style={styles.timeRow} onPress={() => setShowWake(true)}>
            <Ionicons name="sunny-outline" size={22} color={COLORS.textMuted} />
            <Text style={styles.timeLabel}>Wake Time</Text>
            <Text style={styles.timeValue}>{formatTime(wakeTime)}</Text>
          </TouchableOpacity>
          {showWake && (
            <DateTimePicker
              value={wakeTime}
              mode="time"
              is24Hour={false}
              onChange={(e, date) => { setShowWake(false); if (date) setWakeTime(date); }}
            />
          )}

          {/* Quality */}
          <Text style={styles.qualityTitle}>Sleep Quality</Text>
          <View style={styles.qualityRow}>
            {QUALITY_OPTIONS.map((q) => (
              <TouchableOpacity
                key={q.value}
                style={[styles.qualityBtn, quality === q.value && { borderColor: q.color, backgroundColor: `${q.color}22` }]}
                onPress={() => setQuality(q.value)}
              >
                <Text style={[styles.qualityText, quality === q.value && { color: q.color }]}>{q.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Notes */}
          <Text style={styles.qualityTitle}>Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="e.g. Had trouble falling asleep..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={3}
          />

          {/* Save */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Sleep Entry</Text>
          </TouchableOpacity>
        </Card>

        {/* History */}
        <Text style={styles.sectionTitle}>Sleep History</Text>
        {sleepLogs.length === 0 ? (
          <Text style={styles.emptyText}>No sleep logged yet!</Text>
        ) : (
          sleepLogs.map((item) => (
            <Card key={item.id} style={styles.logCard}>
              <View style={styles.logLeft}>
                <Text style={styles.logDuration}>{item.duration} hrs</Text>
                <Text style={styles.logTimes}>{formatTime(item.bedTime)} → {formatTime(item.wakeTime)}</Text>
                <Text style={styles.logQuality} style={{ color: getQualityColor(item.quality) }}>
                  {getQualityLabel(item.quality)}
                </Text>
                {item.notes ? <Text style={styles.logNotes}>📝 {item.notes}</Text> : null}
                <Text style={styles.logDate}>{item.date}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
              </TouchableOpacity>
            </Card>
          ))
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 100 },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  statCard: { flex: 1, alignItems: 'center', padding: SPACING.md, gap: 4 },
  statValue: { fontFamily: FONTS.bold, fontSize: 18, color: COLORS.textPrimary },
  statLabel: { fontFamily: FONTS.medium, fontSize: 11, color: COLORS.textMuted },
  formCard: { padding: SPACING.lg, marginBottom: SPACING.md },
  formTitle: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.textPrimary, marginBottom: SPACING.md },
  timeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: SPACING.sm },
  timeLabel: { fontFamily: FONTS.medium, fontSize: 15, color: COLORS.textPrimary, flex: 1 },
  timeValue: { fontFamily: FONTS.bold, fontSize: 15, color: COLORS.accentCyan },
  qualityTitle: { fontFamily: FONTS.bold, fontSize: 14, color: COLORS.textPrimary, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  qualityRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  qualityBtn: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bgSurface },
  qualityText: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textMuted },
  notesInput: { backgroundColor: COLORS.bgSurface, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, color: COLORS.textPrimary, fontFamily: FONTS.medium, fontSize: 14, padding: SPACING.md, marginTop: SPACING.xs, textAlignVertical: 'top' },
  saveBtn: { marginTop: SPACING.lg, backgroundColor: COLORS.accentCyan, borderRadius: RADIUS.full, paddingVertical: SPACING.md, alignItems: 'center' },
  saveBtnText: { fontFamily: FONTS.bold, fontSize: 15, color: '#000' },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: 18, color: COLORS.textPrimary, marginBottom: SPACING.sm },
  emptyText: { fontFamily: FONTS.medium, fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.xl },
  logCard: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, marginBottom: SPACING.sm },
  logLeft: { flex: 1 },
  logDuration: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.textPrimary },
  logTimes: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textMuted },
  logQuality: { fontFamily: FONTS.bold, fontSize: 13, marginTop: 2 },
  logNotes: { fontFamily: FONTS.medium, fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  logDate: { fontFamily: FONTS.medium, fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
});