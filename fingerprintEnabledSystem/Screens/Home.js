import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { View, Text,  StyleSheet, Image,  ScrollView, Modal, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import IconsNavigation from '../component/IconsNavigation'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Home = () => {
  const navigate = useNavigation()
  const [userData, setUserData] = useState(null)
  const [modalVisible, setModalVisible] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false)
  
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  
  useEffect(() => {
    setLoginSuccess(false)
    setTimeout(() => {
      setLoginSuccess(true)
    }, 3000)
  }, [])

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        const userToken = await AsyncStorage.getItem('token')
        
        if( userToken) {
          if (userDataString) {
            const parsedUserData = JSON.parse(userDataString);
            setUserData(parsedUserData);
          }

          else{
            console.log(`Error getting user token ${userToken}`)
          }
        }
        
       
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };

    getUserData();
  }, []);

   
  return (
   <SafeAreaView style = {styles.container}>
      <View style = {styles.topContainer}>
          <Text style = {styles.headerText}>Student Data</Text>
          <LinearGradient
            colors={['#0CEEF2', '#E400F8', 'transparent']}
            start={{ x: 1, y: 0.1 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.gradientBorder}
          >
            {userData && userData.profile ? (
              <TouchableOpacity onPress={toggleModal}>
                <Image source={{ uri: userData.profile }} style={styles.image} />
              </TouchableOpacity>
            ) : (
              <Text style={{ color: 'white' }}>No profile picture</Text>
            )}
          </LinearGradient>
  
        </View>
        <ScrollView showsVerticalScrollIndicator = {true}>
          <View style = {{margin: 15}}>
            <Text style = {styles.textMedium}>Basic Information</Text>
            <Text style = {styles.textSmall}>Name:   {userData?.name}</Text>
            <Text style = {styles.textSmall}>Date of birth: {userData?.dateOfBirth}</Text>
            <Text style = {styles.textSmall}>Gender: {userData?.gender}</Text>
          </View>
          <View style = {{margin: 15,}}>
            <Text style = {styles.textMedium}>Contact Information</Text>
            <Text style = {styles.textSmall}>Email: {userData?.email}</Text>
            <Text style = {styles.textSmall}>Phone Number: {userData?.phoneNumber}  </Text>
          </View>
  
          <View style = {{margin: 15}}>
            <Text style = {styles.textMedium}>Academic Details</Text>         
            <Text style = {styles.textSmall}>Faculty: {userData?.faculty}</Text>
            <Text style = {styles.textSmall}>Department: {userData?.department} </Text>
            <Text style = {styles.textSmall}>Program: {userData?.program} </Text>
            <Text style = {styles.textSmall}>Level: {userData?.level}</Text>
            <Text style = {styles.textSmall}>Year of enrollment: {userData?.enrollmentYear}</Text>
          </View>  
        </ScrollView>  
        <IconsNavigation />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    topContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerText: {
      color: 'white',
      fontSize: 30,
      margin: 15,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    textMedium: {
      color: 'white',
      fontSize: 25,
      fontWeight: 'bold',
      textAlign: 'left',
      marginBottom: 5
    },
    textSmall: {
      color: '#acadac',
      fontSize: 18,
      marginVertical: 5
    },
    
    gradientBorder: {
      width: 220,
      height: 220,
      borderRadius: 200,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 15
    },
    image: {
      width: 200,
      height: 200,
      borderRadius: 200,
    },
    
  });
  
export default Home
