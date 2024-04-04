import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { View, Text,  StyleSheet, Image,  ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import IconsNavigation from '../component/IconsNavigation'
import AsyncStorage from '@react-native-async-storage/async-storage'
const Home = () => {
    const navigate = useNavigation()
    const [profile, setProfile] = useState(null);
    const [name, setName] = useState(null);
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [studentID, setStudentID] = useState(null);
    const [email, setEmail] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [department, setDepartment] = useState(null);
    const [faculty, setFaculty] = useState(null);
    const [program, setProgram] = useState(null);
    const [level, setLevel] = useState(null);
    const [enrollmentYear, setEnrollmentYear] = useState(null);
    
    const fetchData = async () => {
      try{
        setProfile(await AsyncStorage.getItem('profile'))
        setName(await AsyncStorage.getItem('name'))
        setDateOfBirth(await AsyncStorage.getItem('dateOfBirth'))
        setStudentID( await AsyncStorage.getItem('studentID'))
        setEmail(await AsyncStorage.getItem('email'))
        setPhoneNumber(await AsyncStorage.getItem('phoneNumber'))
        setDepartment( await AsyncStorage.getItem('department'))
        setFaculty(await AsyncStorage.getItem('faculty'))
        setProgram(await  AsyncStorage.getItem('program'))
        setLevel(await AsyncStorage.getItem('level'))
        setEnrollmentYear(await AsyncStorage.getItem('enrollmentYear'))
      }
      catch(error){
        console.log(error)
      }
    }
    
    useEffect(() => {
      fetchData()
    },[])
    
   
   
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
          <Image source={{uri: profile}} style={styles.image} />
        </LinearGradient>
      </View>
      <ScrollView showsVerticalScrollIndicator = {true}>
        <View style = {{margin: 15}}>
          <Text style = {styles.textMedium}>Basic Information</Text>
          <Text style = {styles.textSmall}>Name:  <Text style = {{color: '#fff'}}>{name}</Text>
          </Text>
          <Text style = {styles.textSmall}>Date of birth: <Text style = {{color: '#fff'}}>{dateOfBirth}</Text>
          </Text>
          <Text style = {styles.textSmall}>Student ID:  <Text style = {{color: '#fff'}}>{studentID}</Text>
          </Text>
        </View>
        <View style = {{margin: 15,}}>
          <Text style = {styles.textMedium}>Contact Information</Text>
          <Text style = {styles.textSmall}>Email:  <Text style = {{color: '#fff'}}>{email}</Text></Text>
          <Text style = {styles.textSmall}>Phone Number:  <Text style = {{color: '#fff'}}>{phoneNumber}</Text></Text>
        </View>

        <View style = {{margin: 15}}>
          <Text style = {styles.textMedium}>Academic Information</Text>         
          <Text style = {styles.textSmall}>Department:  <Text style = {{color: '#fff'}}>{department}</Text></Text>
          <Text style = {styles.textSmall}>Faculty:  <Text style = {{color: '#fff'}}>{faculty}</Text></Text>
          <Text style = {styles.textSmall}>Program:  <Text style = {{color: '#fff'}}>{program}</Text></Text>
          <Text style = {styles.textSmall}>Level:  <Text style = {{color: '#fff'}}>{level}</Text></Text>
          <Text style = {styles.textSmall}>Year of enrollment:  <Text style = {{color: '#fff'}}>{enrollmentYear}</Text></Text>
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
