import { useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { View, Text,  StyleSheet, Image,  ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import IconsNavigation from '../component/IconsNavigation'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [studentData, setStudentData] = useState(null)
  const route = useRoute()
  
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  
  useEffect(() => {
    const getStudentData = async () => {
      const id = route.params?.studentID
      await axios.get(`https://fingerprintenabled.onrender.com/api/student/${id}`)
        .then((response) => {
          console.log(response.data)
          setStudentData(response.data.student)
        }).catch(error => {
        console.log(error.message)
      })
    }
    getStudentData()
  }, [])

   
  return (
   <SafeAreaView style = {styles.container}>
      <View style = {styles.topContainer}>
          <Text style = {styles.headerText}>Student Data</Text>
          <LinearGradient
            colors={['#0CEEF2', '#fff', 'transparent']}
            start={{ x: 1, y: 0.1 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.gradientBorder}
          >
            {studentData?.profilePic ? (
              <TouchableOpacity onPress={toggleModal}>
                <Image source={ studentData?.profilePic } style={styles.image} />
              </TouchableOpacity>
            ) : (
              <Text style={{ color: 'white' }}>No profile picture</Text>
            )}
          </LinearGradient>
        </View>
        <ScrollView showsVerticalScrollIndicator = {true}>
          <View style = {{margin: 15}}>
            <Text style = {styles.textMedium}>Basic Information</Text>
            <Text style = {styles.textSmall}>Name:   { studentData?.name }</Text>
            <Text style = {styles.textSmall}>Date of birth: { studentData?.dateOfBirth }</Text>
            <Text style = {styles.textSmall}>Gender: {studentData?.profilePic }</Text>
          </View>
          <View style = {{margin: 15,}}>
            <Text style = {styles.textMedium}>Contact Information</Text>
            <Text style = {styles.textSmall}>Email: {studentData?.email }</Text>
            <Text style = {styles.textSmall}>Phone Number: {studentData?.phoneNumber }  </Text>
          </View>
  
          <View style = {{margin: 15}}>
            <Text style = {styles.textMedium}>Academic Details</Text>         
            <Text style = {styles.textSmall}>Faculty: {studentData?.faculty}</Text>
            <Text style = {styles.textSmall}>Department: { studentData?.department} </Text>
            <Text style = {styles.textSmall}>Program: {studentData?.program } </Text>
            <Text style = {styles.textSmall}>Student ID: { studentData?.studentID}</Text>
            <Text style = {styles.textSmall}>Level: {studentData?.level}</Text>
            <Text style = {styles.textSmall}>Year of enrollment: {studentData?.yearOfEnrollment }</Text>
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
