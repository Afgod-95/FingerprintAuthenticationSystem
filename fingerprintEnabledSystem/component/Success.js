import { View, Text, StyleSheet } from 'react-native'
import React, {useEffect, useRef} from 'react'
import LottieView from 'lottie-react-native'

const Success = () => {
    const animation = useRef(null);

    useEffect(() => {
      const startTimeout = setTimeout(() => {
        animation.current?.play();
      }, 120000); 
  
      const stopTimeout = setTimeout(() => {
        animation.current?.pause();
      }, 420000); 
  
      return () => {
        clearTimeout(startTimeout);
        clearTimeout(stopTimeout);
      };
    }, []);
  
    return (
    <View style = {styles.animationContainer}>
        <LottieView 
            autoPlay
            ref={animation}
            style={{
              width: 150,
              height: 150,
              backgroundColor: '#000',
            }}
            source={require('../assets/Animation2.json')}
        />
    </View>
  )
}

export default Success

const styles = StyleSheet.create({
    animationContainer: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1
    },
  });