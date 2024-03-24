import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View, Text, KeyboardAvoidingView, StyleSheet, Image, Pressable, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as LocalAuthentication from 'expo-local-authentication'
import axios from 'axios'

const Login = () => {
    const fingerPrintImage = require('../assets/finger.png')
    const navigate = useNavigation()

    const handleNavigation = () => {
      navigate.navigate('Register')
    }

    const backendURL = "https://fingerprintenabled.onrender.com/api/auth/login"
  
    const userLogin = async (fingerprint) => {
      try {
        const response = await axios.post(backendURL, {
          fingerprint: fingerprint
        });
    
        if (response.data.error) {
          Alert.alert('Error', response.data.error);
          console.error(response.data.error);
        } 
        else if (response.status === 200) {
          Alert.alert('Success', response.data.message);
          console.log(response.data.token);
          navigate.navigate('Home')
        }
    
      } catch (error) {
        console.log(error.message);
        Alert.alert('Error', error.message);
      }
    }
    

    const handleLogin = async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (!hasHardware) {
          Alert.alert('Error', 'Fingerprint authentication is not supported on this device');
          return;
        }
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!isEnrolled) {
          Alert.alert('Error', 'No fingerprint enrolled on this device.');
          return;
        }
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate with your fingerprint',
        });
    
        if (result.success) {
          const fingerprintData = result.success.toString();
          console.log(typeof fingerprintData);
          userLogin(fingerprintData); // Send fingerprint data directly as a string
        } else {
          Alert.alert('Error', 'Fingerprint authentication failed');
        }
      } catch (error) {
        console.log('Error during fingerprint authentication:', error.message);
      }
    };
    
  
  return (
   <SafeAreaView style = {styles.container}>
        <KeyboardAvoidingView style = {styles.innerContainer}>
            <Text style = {styles.headerText}>Login</Text>
            <Image source = {fingerPrintImage} style = {styles.image}/>
            <View style = {{margin: 20}}>
                <Text style = {styles.textMedium}>Fingerprint Auth</Text>
                <Text style = {styles.textSmall}>Authenticate using your fingerprint</Text>
            </View>
            
            <Pressable style = {styles.button} onPress={handleLogin}>
                <Text style = {{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>Proceed</Text>
            </Pressable>
            <View style = {{flexDirection: 'row', gap: 5, alignItems: 'center', margin: 15}}>
                <Text style = {styles.textSmall}>Haven't registered?</Text>
                <Pressable onPress={handleNavigation}>
                    <Text style = {[styles.textSmall, {color: '#0CEEF2'}]}>Click here to sign up</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
        
   </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
  
    innerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerText: {
      color: 'white',
      fontSize: 45,
      margin: 15,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    textMedium: {
      color: 'white',
      fontSize: 25,
      fontWeight: 'bold',
      textAlign: 'center',
      margin: 10
    },
    textSmall: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
    
    image: {
        width: 250,
        height: 250,
        objectFit: 'contain'
    },
    button: {
        margin: 15,
        width: 350,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0CEEF2',
        borderRadius: 20,
        padding: 10,
    }
    
  });
  
export default Login
