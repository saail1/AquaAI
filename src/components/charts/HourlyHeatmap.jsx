import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants/theme';

export const HourlyHeatmap = ({ hourlyData }) => {
  // hourlyData is an array of 24 numbers representing ml per hour
  
  const getIntensityColor = (ml) => {
    if (ml === 0) return COLORS.bgSurface;
    if (ml < 200) return 'rgba(13, 148, 136, 0.2)'; // accentTeal 20%
    if (ml < 400) return 'rgba(13, 148, 136, 0.6)'; // accentTeal 60%
    return COLORS.accentCyan; // 100%
  };

  const formatHour = (index) => {
    if (index === 0) return '12A';
    if (index === 12) return '12P';
    return index > 12 ? `${index - 12}P` : `${index}A`;
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {hourlyData.map((ml, index) => (
        <View key={index} style={styles.cellContainer}>
          <View 
            style={[
              styles.cell, 
              { backgroundColor: getIntensityColor(ml) }
            ]} 
          />
          <Text style={styles.hourText}>{formatHour(index)}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: SPACING.sm,
    gap: 4,
  },
  cellContainer: {
    alignItems: 'center',
    width: 32,
  },
  cell: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.xs,
  },
  hourText: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: COLORS.textMuted,
  },
});