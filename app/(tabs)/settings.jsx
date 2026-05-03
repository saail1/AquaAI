import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGoalStore } from '../../src/store/goalStore';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { Header } from '../../src/components/layout/Header';
import { Card } from '../../src/components/common/Card';
import { Button } from '../../src/components/common/Button';
import { Avatar } from '../../src/components/common/Avatar';
import { useAuth } from '../../src/hooks/useAuth';
import { useGoal } from '../../src/hooks/useGoal';
import { formatMl } from '../../src/utils/formatters';
import { COLORS, FONTS, SPACING } from '../../src/constants/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const [weightInput, setWeightInput] = useState(weight ? String(weight) : '');
const [selectedActivity, setSelectedActivity] = useState(activityLevel || 'low');

const handleSaveWeight = () => {
  const w = parseFloat(weightInput);
  if (!w || w < 20 || w > 300) {
    Alert.alert('Invalid Weight', 'Please enter a valid weight between 20-300 kg');
    return;
  }
  setWeightAndActivity(w, selectedActivity);
  Alert.alert('✅ Goal Updated!', `Your new daily goal is set based on your weight.`);
};
  const { user, logout } = useAuth();
  const { goal, reminderEnabled, toggleReminder, updateWeightGoal } = useGoal();
const { weight, activityLevel, setWeightAndActivity } = useGoalStore();

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out of AquaAI?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive", 
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          } 
        }
      ]
    );
  };

  const SettingRow = ({ icon, title, value, onToggle, showBorder = true }) => (
    <View style={[styles.row, showBorder && styles.rowBorder]}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={22} color={COLORS.textMuted} style={styles.rowIcon} />
        <Text style={styles.rowTitle}>{title}</Text>
      </View>
      {onToggle ? (
        <Switch 
          value={value} 
          onValueChange={onToggle}
          trackColor={{ false: COLORS.bgSurface, true: COLORS.accentCyan }}
          thumbColor="#FFF"
        />
      ) : (
        <Text style={styles.rowValue}>{value}</Text>
      )}
    </View>
  );

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Header title="Settings" />

        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <Avatar name={user?.displayName || 'User'} size={70} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.displayName || 'AquaAI User'}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </Card>
<Text style={styles.sectionTitle}>Body & Activity</Text>
<Card style={styles.settingsCard}>
  <Text style={styles.rowTitle}>Your Weight (kg)</Text>
  <TextInput
    style={styles.weightInput}
    value={weightInput}
    onChangeText={setWeightInput}
    keyboardType="numeric"
    placeholder="e.g. 70"
    placeholderTextColor={COLORS.textMuted}
    maxLength={5}
  />

  <Text style={[styles.rowTitle, { marginTop: SPACING.md, marginBottom: SPACING.sm }]}>
    Activity Level
  </Text>
  <View style={styles.activityRow}>
    {['low', 'medium', 'high'].map((level) => (
      <TouchableOpacity
        key={level}
        style={[styles.activityBtn, selectedActivity === level && styles.activityBtnActive]}
        onPress={() => setSelectedActivity(level)}
      >
        <Text style={[styles.activityBtnText, selectedActivity === level && styles.activityBtnTextActive]}>
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </Text>
      </TouchableOpacity>
    ))}
  </View>

  <TouchableOpacity style={styles.saveBtn} onPress={handleSaveWeight}>
    <Text style={styles.saveBtnText}>Calculate & Save Goal</Text>
  </TouchableOpacity>
</Card>
        <Text style={styles.sectionTitle}>Goals & Reminders</Text>
        <Card style={styles.settingsCard} noPadding>
          <SettingRow 
            icon="flag-outline" 
            title="Daily Target" 
            value={formatMl(goal)} 
          />
          <SettingRow 
            icon="notifications-outline" 
            title="Smart Reminders" 
            value={reminderEnabled}
            onToggle={toggleReminder}
            showBorder={false}
          />
        </Card>

        <Text style={styles.sectionTitle}>App Preferences</Text>
        <Card style={styles.settingsCard} noPadding>
          <SettingRow 
            icon="color-palette-outline" 
            title="Theme" 
            value="Dark Mode" 
          />
          <SettingRow 
            icon="server-outline" 
            title="Data Sync" 
            value="Enabled" 
            showBorder={false}
          />
        </Card>

        <Text style={styles.sectionTitle}>Account</Text>
        <Card style={styles.settingsCard} noPadding>
          <SettingRow 
            icon="shield-checkmark-outline" 
            title="Privacy Policy" 
            value="View" 
          />
          <SettingRow 
            icon="help-circle-outline" 
            title="Help & Support" 
            value="v1.0.0" 
            showBorder={false}
          />
        </Card>

        <Button 
          title="Log Out" 
          variant="danger" 
          icon="log-out-outline" 
          onPress={handleLogout} 
          style={styles.logoutBtn}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  profileInfo: {
    marginLeft: SPACING.md,
  },
  profileName: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  profileEmail: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
    paddingLeft: SPACING.sm,
  },
  settingsCard: {
    marginBottom: SPACING.xl,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginRight: SPACING.md,
  },
  rowTitle: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  rowValue: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  logoutBtn: {
    marginTop: SPACING.md,
  },
  weightInput: {
  backgroundColor: COLORS.bgSurface,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: COLORS.border,
  color: COLORS.textPrimary,
  fontFamily: FONTS.medium,
  fontSize: 16,
  paddingHorizontal: SPACING.md,
  paddingVertical: SPACING.sm,
  marginTop: SPACING.sm,
},
activityRow: {
  flexDirection: 'row',
  gap: SPACING.sm,
},
activityBtn: {
  flex: 1,
  paddingVertical: SPACING.sm,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: COLORS.border,
  alignItems: 'center',
  backgroundColor: COLORS.bgSurface,
},
activityBtnActive: {
  backgroundColor: 'rgba(6, 182, 212, 0.15)',
  borderColor: COLORS.accentCyan,
},
activityBtnText: {
  fontFamily: FONTS.medium,
  fontSize: 14,
  color: COLORS.textMuted,
},
activityBtnTextActive: {
  color: COLORS.accentCyan,
  fontFamily: FONTS.bold,
},
saveBtn: {
  marginTop: SPACING.lg,
  backgroundColor: COLORS.accentCyan,
  borderRadius: 10,
  paddingVertical: SPACING.md,
  alignItems: 'center',
},
saveBtnText: {
  fontFamily: FONTS.bold,
  fontSize: 15,
  color: '#000',
},
});