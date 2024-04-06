import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { View, Text,  StyleSheet, Image,  ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import IconsNavigation from '../component/IconsNavigation'
import AsyncStorage from '@react-native-async-storage/async-storage'
const Home = () => {
  const navigate = useNavigation()
  const [userData, setUserData] = useState(null)
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        console.log(userDataString)
        if (userDataString) {
          const userDataObject = JSON.parse(userDataString);
          setUserData(userDataObject);
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
        <Text style = {styles.headerText}>Student Particulars</Text>
        <LinearGradient
          colors={['#0CEEF2', '#E400F8', 'transparent']}
          start={{ x: 1, y: 0.1 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.gradientBorder}
        >
          {userData && userData.profile ? (
            <Image source={{uri: userData.profile}} style={styles.image} />
          ) : (
            <Text style={{ color: 'white' }}>No profile picture</Text>
          )}
        </LinearGradient>

      </View>
      <ScrollView showsVerticalScrollIndicator = {true}>
        <View style = {{margin: 15}}>
          <Text style = {styles.textMedium}>Basic Information</Text>
          <Text style = {styles.textSmall}>Name:  <Text style = {{color: '#fff'}}>{userData.name}</Text>
          </Text>
          <Text style = {styles.textSmall}>Date of birth: <Text style = {{color: '#fff'}}>{dateOfBirth}</Text>
          </Text>
          <Text style = {styles.textSmall}>Student ID:  <Text style = {{color: '#fff'}}>{userData.studentID}</Text>
          </Text>
        </View>
        <View style = {{margin: 15,}}>
          <Text style = {styles.textMedium}>Contact Information</Text>
          <Text style = {styles.textSmall}>Email:  <Text style = {{color: '#fff'}}>{userData.email}</Text></Text>
          <Text style = {styles.textSmall}>Phone Number:  <Text style = {{color: '#fff'}}>{userData.phoneNumber}</Text></Text>
        </View>

        <View style = {{margin: 15}}>
          <Text style = {styles.textMedium}>Academic Information</Text>         
          <Text style = {styles.textSmall}>Faculty:  <Text style = {{color: '#fff'}}>{userData.faculty}</Text></Text>
          <Text style = {styles.textSmall}>Department:  <Text style = {{color: '#fff'}}>{userData.department}</Text></Text>
          <Text style = {styles.textSmall}>Program:  <Text style = {{color: '#fff'}}>{userData.program}</Text></Text>
          <Text style = {styles.textSmall}>Level:  <Text style = {{color: '#fff'}}>{userData.level}</Text></Text>
          <Text style = {styles.textSmall}>Year of enrollment:  <Text style = {{color: '#fff'}}>{userData.enrollmentYear}</Text></Text>
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
