import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text} from 'react-native';

const CircularLoader = () => {
  return (
    <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10}}>
      <ActivityIndicator size="large" color="#000000" />
      <Text style ={{color: '#fff', fontSize: 16}}>Please wait a moment...</Text>
    </View>
  );
};


export default CircularLoader;


