import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { sendPasswordReset } from '../../src/services/firebase/auth';
import { useUiStore } from '../../src/store/uiStore';
import { validateEmail } from '../../src/utils/validators';
import { COLORS, FONTS, SPACING } from '../../src/constants/theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { showToast } = useUiStore();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async () => {
    setError('');
    
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      setError(emailCheck.error);
      return;
    }

    setIsLoading(true);
    const { error: resetError } = await sendPasswordReset(email);
    setIsLoading(false);

    if (resetError) {
      showToast(resetError, 'error');
    } else {
      showToast('Password reset link sent to your email!', 'success');
      router.replace('/(auth)/login');
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter the email address associated with your account and we'll send you a link to reset your password.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email Address"
            icon="mail-outline"
            placeholder="hello@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            error={error}
          />

          <Button 
            title="Send Reset Link" 
            onPress={handleReset} 
            isLoading={isLoading}
            style={styles.submitBtn}
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 10,
    left: 0,
    zIndex: 10,
    padding: SPACING.xs,
  },
  header: {
    marginBottom: SPACING.xl,
    marginTop: SPACING.xxl,
  },
  title: {
    fontFamily: FONTS.extraBold,
    fontSize: 32,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.textMuted,
    lineHeight: 24,
  },
  form: {
    width: '100%',
  },
  submitBtn: {
    marginTop: SPACING.lg,
  },
});