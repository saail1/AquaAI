import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { useAuth } from '../../src/hooks/useAuth';
import { useUiStore } from '../../src/store/uiStore';
import { validateEmail, validatePassword, validateName } from '../../src/utils/validators';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login, signup } = useAuth();
  const { showToast } = useUiStore();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  // Background Animation Values
  const blob1Scale = useSharedValue(1);
  const blob2Scale = useSharedValue(1);

  useEffect(() => {
    blob1Scale.value = withRepeat(
      withSequence(withTiming(1.2, { duration: 4000 }), withTiming(0.8, { duration: 4000 })),
      -1, true
    );
    blob2Scale.value = withRepeat(
      withSequence(withTiming(0.8, { duration: 3000 }), withTiming(1.2, { duration: 3000 })),
      -1, true
    );
  }, []);

  const animatedBlob1 = useAnimatedStyle(() => ({ transform: [{ scale: blob1Scale.value }] }));
  const animatedBlob2 = useAnimatedStyle(() => ({ transform: [{ scale: blob2Scale.value }] }));

  const handleAuth = async () => {
    setErrors({});
    let hasErrors = false;
    const newErrors = {};

    // Validation
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      newErrors.email = emailCheck.error;
      hasErrors = true;
    }

    const passCheck = validatePassword(password);
    if (!passCheck.valid) {
      newErrors.password = passCheck.error;
      hasErrors = true;
    }

    if (!isLogin) {
      const nameCheck = validateName(name);
      if (!nameCheck.valid) {
        newErrors.name = nameCheck.error;
        hasErrors = true;
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    if (isLogin) {
      const { success, error } = await login(email, password);
      if (success) {
        router.replace('/(tabs)/home');
      } else {
        showToast(error, 'error');
      }
    } else {
      const { success, error } = await signup(email, password, name);
      if (success) {
        router.replace('/(tabs)/home');
      } else {
        showToast(error, 'error');
      }
    }
    
    setIsLoading(false);
  };

  const passwordStrength = validatePassword(password).strength;

  return (
    <View style={styles.container}>
      {/* Animated Background */}
      <View style={StyleSheet.absoluteFill}>
        <Animated.View style={[styles.blob1, animatedBlob1]} />
        <Animated.View style={[styles.blob2, animatedBlob2]} />
        <View style={styles.bgOverlay} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header Section */}
          <View style={styles.headerArea}>
            <Text style={styles.appName}>Aqua<Text style={styles.accent}>AI</Text></Text>
            <Text style={styles.tagline}>Hydration, Intelligently Tracked</Text>
          </View>

          {/* Glassmorphism Auth Card */}
          <View style={styles.authCard}>
            
            {/* Toggle Switch */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity 
                style={[styles.toggleBtn, isLogin && styles.toggleActive]}
                onPress={() => setIsLogin(true)}
              >
                <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleBtn, !isLogin && styles.toggleActive]}
                onPress={() => setIsLogin(false)}
              >
                <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>Create Account</Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            {!isLogin && (
              <Input
                label="Full Name"
                icon="person-outline"
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
                error={errors.name}
              />
            )}

            <Input
              label="Email Address"
              icon="mail-outline"
              placeholder="hello@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
            />

            <Input
              label="Password"
              icon="lock-closed-outline"
              placeholder="••••••••"
              password
              value={password}
              onChangeText={setPassword}
              error={errors.password}
            />

            {/* Password Strength Indicator */}
            {!isLogin && password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={[styles.strengthBar, { backgroundColor: passwordStrength === 'weak' ? COLORS.danger : passwordStrength === 'medium' ? COLORS.warning : COLORS.success }]} />
                <View style={[styles.strengthBar, { backgroundColor: passwordStrength === 'medium' || passwordStrength === 'strong' ? (passwordStrength === 'medium' ? COLORS.warning : COLORS.success) : COLORS.bgSurface }]} />
                <View style={[styles.strengthBar, { backgroundColor: passwordStrength === 'strong' ? COLORS.success : COLORS.bgSurface }]} />
              </View>
            )}

            {!isLogin && (
              <Input
                label="Confirm Password"
                icon="checkmark-circle-outline"
                placeholder="••••••••"
                password
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={errors.confirmPassword}
              />
            )}

            {isLogin && (
              <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={styles.forgotLink}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            <Button 
              title={isLogin ? "Sign In" : "Create Account"} 
              onPress={handleAuth} 
              isLoading={isLoading}
              style={styles.submitBtn}
            />

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDeep,
  },
  blob1: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(37, 99, 235, 0.15)', // accentBlue
  },
  blob2: {
    position: 'absolute',
    top: '20%',
    right: -150,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(6, 182, 212, 0.15)', // accentCyan
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4, 8, 16, 0.6)', // Creates a frosted glass effect over blobs
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  headerArea: {
    marginTop: 100,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
  },
  appName: {
    fontFamily: FONTS.extraBold,
    fontSize: 48,
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  accent: {
    color: COLORS.accentCyan,
  },
  tagline: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  authCard: {
    backgroundColor: 'rgba(12, 18, 32, 0.95)',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
    paddingTop: SPACING.xxl,
    marginTop: 40,
    ...SHADOWS.card,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.full,
    padding: 4,
    marginBottom: SPACING.xl,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: RADIUS.full,
  },
  toggleActive: {
    backgroundColor: COLORS.bgCard,
    ...SHADOWS.glow,
  },
  toggleText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  toggleTextActive: {
    color: COLORS.accentCyan,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.md,
  },
  forgotText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.textAccent,
  },
  submitBtn: {
    marginTop: SPACING.md,
  },
  strengthContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.md,
    marginTop: -SPACING.sm, // pull it closer to password input
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
});