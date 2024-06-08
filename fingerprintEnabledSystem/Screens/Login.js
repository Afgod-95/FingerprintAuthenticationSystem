import { useNavigation } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Text, TextInput, KeyboardAvoidingView, StyleSheet, Image, Pressable, Alert, ScrollView, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as LocalAuthentication from 'expo-local-authentication'
import axios from 'axios'
import { Feather } from '@expo/vector-icons'
import CircularLoader from '../component/CircularLoader'
import FingerprintAnimation from '../component/FingerprintAnimation'
import { ErrorMessages, SuccessMessages } from '../component/Messages'

const Login = () => {
    const navigate = useNavigation()
    const [isVisible, setIsVisible] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
    const [user, setUser] = useState({
      studentID: '',
      password:''
    })

    const [isLoading, setIsLoading] = useState(false)
    const [errorVisible, setErrorVisible] = useState(false)
    const [successVisible, setSuccessVisible] = useState(false)

    const handleNavigation = () => {
      navigate.navigate('Register')
    }

    const backendURL = "https://fingerprintenabled.onrender.com/api/auth/login"
  
    const userLogin = async (fingerprint, userData) => {
      try {
        setIsLoading(true)
        const response = await axios.post(backendURL, {
          fingerprint: fingerprint,
          studentID: userData.studentID,
          password: userData.password
        });
    
        if (response.data.error) {
          setIsLoading(false)
          setErrorMessage(response.data.error)
          setErrorVisible(true)
        } 
        else {
          setIsLoading(false)
          setSuccessMessage(response.data.message)
          setSuccessVisible(true)
          setUser("")
        }

       
      } catch (error) {
        setIsLoading(false)
        if (error.response) {
          setErrorMessage(error.response.data.error)
          setErrorVisible(true)
        } else if (error.request) {
          setErrorMessage('Network error')
          setErrorVisible(true)
        } else {
          setErrorMessage(error.message)
          setErrorVisible(true)
        }
      }
    }

    useEffect(() => {
      if (successVisible) {
        setTimeout(() => {
          setSuccessVisible(false);
          navigate.navigate('Home', { studentID: user.studentID });
        }, 3000); 
      }
    }, [successVisible]);
    
    const handleFingerprintScan = async () => {
      try {
        setIsLoading(true)
        const hasHardware = await LocalAuthentication.hasHardwareAsync()
        if (!hasHardware) {
          setErrorMessage('Fingerprint authentication is not supported on this device')
          setErrorVisible(true)
          return
        }
        const isEnrolled = await LocalAuthentication.isEnrolledAsync()
        if (!isEnrolled) {
          setErrorMessage('No fingerprint enrolled on this device.')
          setErrorVisible(true)
          return
        }
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate with your fingerprint',
        })
    
        if (result.success) {
          const fingerprintData = result.success.toString()
          userLogin(fingerprintData, user)
        } else {
          setIsLoading(false)
          setErrorMessage('Fingerprint authentication failed')
          setErrorVisible(true)
        }
       
      } catch (error) {
       setErrorMessage(error.message)
       setErrorVisible(true)
      }
    }
    
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.innerContainer}>
        <Text style={styles.headerText}>Login</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <FingerprintAnimation /> 
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.textMedium}>Fingerprint Auth</Text>
            <Text style={styles.textSmall}>Authenticate using your fingerprint</Text>
          </View>

          <View style={styles.container}>
            <TextInput
              style={[styles.input, { margin: 10 }]}
              placeholder="Enter your student ID"
              placeholderTextColor="#acadac"
              value={user.studentID}
              onChangeText={(text) => setUser({ ...user, studentID: text })}
            />
            <View>
              <TextInput
                style={[styles.input, { margin: 10 }]}
                placeholder="Enter password"
                secureTextEntry={!isVisible}
                placeholderTextColor="#acadac"
                value={user.password}
                onChangeText={(text) => setUser({ ...user, password: text })}
              />

              <TouchableOpacity onPress={() => setIsVisible(!isVisible)} 
                style={{
                  position: 'absolute',
                  right: 18, top: 24,
                  height: 40, 
                  width: 40
                }}
              >
                <Feather name={isVisible ? 'eye' : 'eye-off'} size={24} color="#0CEEF2" />
              </TouchableOpacity>
            </View>
          </View>
          
          <Pressable style={styles.button} onPress={handleFingerprintScan} disabled={isLoading}>
            {isLoading ? (
              <CircularLoader />
            ) : (
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Proceed</Text>
            )}  
          </Pressable>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Text style={styles.textSmall}>Don't have an account?</Text>
            <TouchableOpacity onPress={handleNavigation} >
                <Text style={[styles.textSmall, { color: '#0CEEF2' }]}> Click here</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <ErrorMessages
          errorMessage={errorMessage}
          visible={errorVisible}
          onClose={() => setErrorVisible(false)}
        />
        <SuccessMessages
          successMessage={successMessage}
          visible={successVisible}
          onClose={() => setSuccessVisible(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center'
    },
    innerContainer: {
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
    },
    textSmall: {
      color: 'white',
      fontSize: 18,
      textAlign: 'center',
    },
    input: {
      borderWidth: 0.5,
      margin: 15,
      width: Dimensions.get('window').width - 30,
      height: 50,
      borderColor: '#0CEEF2',
      borderRadius: 20,
      padding: 10,
      color: '#acadac',
    },
    button: {
      margin: 15,
      width: Dimensions.get('window').width - 30,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0CEEF2',
      borderRadius: 20,
      padding: 10,
    }
})

export default Login
