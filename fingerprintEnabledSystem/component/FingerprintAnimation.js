import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native'; 

const FingerprintAnimation = () => {
    const animation = useRef(null);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            animation.current?.play();
        }, 120000); 

        const stopTimeout = setTimeout(() => {
            animation.current?.pause();
        }, 240000); 

        return () => {
            clearTimeout(startTimeout);
            clearTimeout(stopTimeout);
        };
    }, []);

    return (
        <View style={styles.animationContainer}>
            <LottieView
                autoPlay
                ref={animation}
                style={{
                    width: 250,
                    height: 250,
                    backgroundColor: '#000', 
                }}
                source={require('../assets/fingerprintAnimate1.json')}
            />
        </View>
    );
};

export default FingerprintAnimation;

const styles = StyleSheet.create({
    animationContainer: {
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
});
