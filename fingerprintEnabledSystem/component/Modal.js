import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, StyleSheet, Pressable } from 'react-native';
import RadioButton from './RadioButton';

const Modal = () => {
  const modalAnimatedValue = useRef(new Animated.Value(0)).current;

  const animateModal = (toValue) => {
    Animated.timing(modalAnimatedValue, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const departments = [
    'Faculty of Applied Science',
    'Faculty of Applied Arts',
    'Faculty of Engineering',
    'Faculty of Built Engineering',
    'Faculty of Business',
  ];

  return (
    <Pressable style={styles.container} onPress={() => setModalVisible(false)}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text>Select Department</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [
                  {
                    translateY: modalAnimatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [500, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {departments.map((department) => (
              <TouchableOpacity
                key={department}
                onPress={() => handleDepartmentSelect(department)}
              >
                <RadioButton
                  label={department}
                  selected={department === selectedDepartment}
                  onPress={() => handleDepartmentSelect(department)}
                />
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>
      </Modal>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#2b0103',
    padding: 16,
    borderRadius: 10,
    elevation: 5,
  },
});

export default Modal;
