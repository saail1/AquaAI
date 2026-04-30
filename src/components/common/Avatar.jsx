import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../../constants/theme';
import { getInitials } from '../../utils/formatters';

export const Avatar = ({ name, url, size = 40 }) => {
  const borderRadius = size / 2;

  if (url) {
    return (
      <Image 
        source={{ uri: url }} 
        style={[styles.image, { width: size, height: size, borderRadius }]} 
      />
    );
  }

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius }]}>
      <LinearGradient
        colors={COLORS.gradientMain}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius }]}
      />
      <Text style={[styles.text, { fontSize: size * 0.4 }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  text: {
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
  },
});