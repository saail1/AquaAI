import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUiStore } from '../../store/uiStore';
import { useWater } from '../../hooks/useWater';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants/theme';

export const CustomAmountModal = () => {
  const { isCustomModalOpen, toggleCustomModal, showToast } = useUiStore();
  const { addLog } = useWater();
  
  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('Custom Drink');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    toggleCustomModal(false);
    setAmount('');
    setLabel('Custom Drink');
  };

  const handleSubmit = async () => {
    const mlValue = parseInt(amount, 10);
    
    if (isNaN(mlValue) || mlValue <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    setIsSubmitting(true);
    const { success, error } = await addLog('custom', label, mlValue);
    setIsSubmitting(false);

    if (success) {
      showToast(`Logged ${mlValue}ml of ${label}`, 'success');
      handleClose();
    } else {
      showToast(error || 'Failed to log drink', 'error');
    }
  };

  return (
    <Modal
      visible={isCustomModalOpen}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Log Custom Amount</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <Input
            label="Amount (ml)"
            placeholder="e.g., 350"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            icon="water-outline"
            maxLength={4}
          />

          <Input
            label="Drink Name (Optional)"
            placeholder="e.g., Protein Shake"
            value={label}
            onChangeText={setLabel}
            icon="cafe-outline"
          />

          <View style={styles.buttonContainer}>
            <Button 
              title="Cancel" 
              variant="secondary" 
              onPress={handleClose} 
              style={styles.cancelBtn}
            />
            <Button 
              title="Add Drink" 
              onPress={handleSubmit} 
              isLoading={isSubmitting}
              style={styles.addBtn}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 8, 16, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: SPACING.md,
  },
  cancelBtn: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  addBtn: {
    flex: 2,
  },
});