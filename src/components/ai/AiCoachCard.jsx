import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { TypingDots } from './TypingDots';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

export const AiCoachCard = ({ insight, isLoading, error, onGenerate, compact = false }) => {
  const [displayedText, setDisplayedText] = useState('');

  // Typewriter effect logic
  useEffect(() => {
    if (!insight) {
      setDisplayedText('');
      return;
    }

    let i = 0;
    const words = insight.split(' ');
    
    const timer = setInterval(() => {
      setDisplayedText(words.slice(0, i + 1).join(' '));
      i++;
      if (i >= words.length) clearInterval(timer);
    }, 40); // 40ms per word creates a natural reading pace

    return () => clearInterval(timer);
  }, [insight]);

  return (
    <Card style={styles.card}>
      <View style={styles.accentBorder} />
      
      <View style={styles.content}>
        {!insight && !isLoading && !error && (
          <View style={styles.emptyState}>
            <Text style={styles.title}>Personalized Insight</Text>
            <Text style={styles.subtitle}>Let Claude analyze your patterns.</Text>
            <Button 
              title="Get Insight" 
              onPress={onGenerate} 
              style={styles.generateBtn}
            />
          </View>
        )}

        {isLoading && (
          <View style={styles.loadingState}>
            <Text style={styles.analyzingText}>Analyzing your hydration...</Text>
            <TypingDots />
          </View>
        )}

        {error && (
          <View style={styles.errorState}>
            <Text style={styles.errorText}>Unable to reach AI Coach.</Text>
            <Button title="Try Again" variant="secondary" onPress={onGenerate} />
          </View>
        )}

        {insight && !isLoading && (
          <View style={styles.insightState}>
            <Text style={styles.insightText}>{displayedText}</Text>
            {!compact && (
              <Button 
                title="Refresh Insight" 
                variant="secondary" 
                onPress={onGenerate} 
                style={styles.refreshBtn}
                icon="refresh"
              />
            )}
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    overflow: 'hidden',
  },
  accentBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: COLORS.accentCyan,
  },
  content: {
    paddingLeft: SPACING.md,
  },
  emptyState: {
    alignItems: 'flex-start',
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  generateBtn: {
    height: 40,
    paddingHorizontal: SPACING.md,
  },
  refreshBtn: {
    height: 40,
    marginTop: SPACING.md,
    alignSelf: 'flex-start',
  },
  loadingState: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  analyzingText: {
    fontFamily: FONTS.medium,
    color: COLORS.textAccent,
  },
  errorState: {
    alignItems: 'flex-start',
  },
  errorText: {
    fontFamily: FONTS.medium,
    color: COLORS.danger,
    marginBottom: SPACING.sm,
  },
  insightState: {
    justifyContent: 'flex-start',
  },
  insightText: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
});