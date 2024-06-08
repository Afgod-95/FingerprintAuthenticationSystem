import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import zxcvbn from 'zxcvbn';

const PasswordStrength = ({ password }) => {
  const result = zxcvbn(password);
  const score = result.score;
  const strength = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  const slideAnim = useRef(new Animated.Value(-Dimensions.get('screen').width)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [password]);

  const ColorStrength = () => {
    switch (score) {
      case 0:
        return 'red';
      case 1:
        return 'orange';
      case 2:
        return 'yellow';
      case 3:
        return 'green';
      case 4:
        return 'green';
      default:
        return '#D1D1D1'; // Default color if score is out of range
    }
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: slideAnim }] }]}>
      <Text style={[styles.text, { color: ColorStrength() }]}>
        {strength[score]}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 15,
    width: Dimensions.get('screen').width - 25
  },
  text: {
    fontSize: 14,
    textAlign: 'right'
  },
});

export default PasswordStrength;
