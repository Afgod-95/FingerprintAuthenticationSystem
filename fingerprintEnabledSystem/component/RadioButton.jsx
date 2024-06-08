import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // You may need to install @expo/vector-icons

const RadioButton = ({ label, selected, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style = {{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
        <Ionicons 
            name={selected ? 'radio-button-on' : 'radio-button-off'} 
            size={24} 
            color={selected ? '#0CEEF2' : '#8E8E93'} 
        />
        <Text style={[styles.label, {color: '#acadac'}]}>{label}</Text>
      </View>
      
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export default RadioButton;
