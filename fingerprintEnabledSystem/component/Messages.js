import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import LottieView from 'lottie-react-native'

const ErrorMessages = ({ errorMessage, visible, onClose }) => {
    const errorAnimationRef = useRef(null)
    const fadeAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (visible) {
            errorAnimationRef.current?.play()
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start()
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start()
        }
    }, [visible])

    if (!visible) return null

    return (
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
            <View style={styles.modalContent}>
                <LottieView
                    autoPlay
                    loop={false}
                    ref={errorAnimationRef}
                    style={styles.lottieStyle}
                    source={require('../assets/Error.json')}
                />
               <View style = {{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={[styles.messageText, {fontWeight: 'bold', color: '#FF0000'}]}>Error: </Text>
                  <Text style={styles.messageText}>{errorMessage}</Text>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    )
}

const SuccessMessages = ({ successMessage, visible, onClose }) => {
    const successAnimationRef = useRef(null)
    const fadeAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (visible) {
            successAnimationRef.current?.play()
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start()
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start()
        }
    }, [visible])

    if (!visible) return null

    return (
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
            <View style={styles.modalContent}>
                <LottieView
                    autoPlay
                    loop = {false}
                    ref={successAnimationRef}
                    style={styles.lottieStyle}
                    source={require('../assets/Success.json')}
                />
                <View style = {{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={[styles.messageText, {fontWeight: 'bold', color: '#04d120'}]}>Success: </Text>
                  <Text style={styles.messageText}>{successMessage}</Text>
                </View>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        position: 'absolute',
        height: Dimensions.get('screen').height,
        width: Dimensions.get('screen').width,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalContent: {
        width: Dimensions.get('screen').width - 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#121212',
        borderRadius: 20,
        padding: 15,
    },
    lottieStyle: {
        width: 150,
        height: 150,
        backgroundColor: '#121212',
    },
    messageText: {
        color: '#FFF',
        marginVertical: 10,
        textAlign: 'center',
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#FF0000',
        borderRadius: 10,
    },
    closeButtonText: {
        color: '#FFF',
    },
})

export { ErrorMessages, SuccessMessages }
