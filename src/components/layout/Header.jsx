import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar } from '../common/Avatar';
import { formatDate } from '../../utils/dateHelpers';
import { useAuth } from '../../hooks/useAuth';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

export const Header = ({ title }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const today = formatDate(new Date());

  const handleAvatarPress = () => {
    Alert.alert(
      "Profile",
      `Signed in as ${user?.email}`,
      [
        { text: "Settings", onPress: () => router.push('/(tabs)/settings') },
        { text: "Logout", onPress: logout, style: "destructive" },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        {title ? (
          <Text style={styles.title}>{title}</Text>
        ) : (
          <Text style={styles.logoText}>Aqua<Text style={styles.logoAccent}>AI</Text></Text>
        )}
        <Text style={styles.dateText}>{today}</Text>
      </View>

      <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.8}>
        <Avatar name={user?.displayName || 'User'} size={44} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  leftContent: {
    flex: 1,
  },
  logoText: {
    fontFamily: FONTS.extraBold,
    fontSize: 22,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  logoAccent: {
    color: COLORS.accentCyan,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.textPrimary,
  },
  dateText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});