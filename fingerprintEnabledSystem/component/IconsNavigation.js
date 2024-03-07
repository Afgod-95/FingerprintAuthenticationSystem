import React, { useState, useRef } from 'react';
import { Pressable, View, Text, Animated, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const IconsNavigation = () => {
  const [isFocused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const navigate = useNavigation();

  const handlePress = () => {
    setFocused(!isFocused);
    setShow(!show);
    Animated.timing(slideAnimation, {
      toValue: show ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const slidingStyle = {
    transform: [
      {
        translateY: slideAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0],
        }),
      },
    ],
  };

  return (
    <View>
      <Pressable
        onPress={handlePress}
        style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          bottom: 0,
          right: 10,
          width: 50,
          height: 50,
          borderRadius: 10,
          backgroundColor: '#212020',
        }}
      >
        <Feather name="settings" size={30} color={isFocused ? '#fff' : '#acadac'} />
      </Pressable>
      {show && (
        <Animated.View style={[{ position: 'absolute', bottom: 60, right: 10 }, slidingStyle]}>
          <TouchableOpacity
            onPress={()=> {
              navigate.navigate('Login');
            }}
            style={{
              backgroundColor: '#212020',
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: '#fff' }}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export default IconsNavigation;
