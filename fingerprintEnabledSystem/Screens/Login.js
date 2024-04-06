import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { View, TouchableOpacity, Text, TextInput, KeyboardAvoidingView, StyleSheet, Image, Pressable, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as LocalAuthentication from 'expo-local-authentication'
import axios from 'axios'
import { Feather } from '@expo/vector-icons'

const Login = () => {
    const fingerPrintImage = require('../assets/finger.png')
    const navigate = useNavigation()
    const [isVisible, setIsVisible] = useState(false)
    const [user, setUser] = useState({
      email: '',
      password:''
    })

    const handleNavigation = () => {
      navigate.navigate('Register')
    }

    const backendURL = "https://fingerprintenabled.onrender.com/api/auth/login"
  
    const userLogin = async (fingerprint, userData) => {
      try {
        const response = await axios.post(backendURL, {
          fingerprint: fingerprint,
          email: userData.email,
          password: userData.password
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
        if (error.response){
          Alert.alert('Error',  error.response.data.error);
          console.log(error.response.data)
        }
        else if (error.request){
          Alert.alert('Error', error.request);
          console.log(error.request)
        }
        else if (error){
          Alert.alert('Error', error.message);
          console.log(`Error: ${error.message}`)
        }
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
          userLogin(fingerprintData, user); 
        } else {
          Alert.alert('Error', 'Fingerprint authentication failed');
        }
      } catch (error) {
        Alert.alert('Error', error.message)
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

            <View>
            <TextInput
                style={[styles.input, { margin: 15 }]}
                placeholder="Enter email"
                placeholderTextColor="#acadac"
                value={user.email}
                onChangeText={(text) => setUser({ ...user, email: text })}
              />
              <View>
                <TextInput
                  style={[styles.input, { margin: 15 }]}
                  placeholder="Enter password"
                  secureTextEntry={!isVisible}
                  placeholderTextColor="#acadac"
                  value={user.password}
                  onChangeText={(text) => setUser({ ...user, password: text })}
                />
                <TouchableOpacity onPress={() => setIsVisible(!isVisible)} 
                  style = {{
                    position: 'absolute',
                    right: 10, top: 25,
                    height: 40, 
                    width: 40
                  }}
                >
                  <Feather name={isVisible ? 'eye' : 'eye-off'} size={24} color="#0CEEF2" />
                </TouchableOpacity>
              </View>
              
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

    input: {
      borderWidth: 0.5,
      margin: 10,
      width: 350,
      height: 50,
      borderColor: '#0CEEF2',
      borderRadius: 20,
      padding: 10,
      color: '#fff',
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
