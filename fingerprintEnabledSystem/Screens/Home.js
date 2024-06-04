import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import IconsNavigation from '../component/IconsNavigation';
import axios from 'axios';
import { Buffer } from 'buffer'


const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState({
    profile: null,
    name: null,
    gender: null,
    dateOfBirth: null,
    studentID: null,
    email: null,
    password: null,
    phoneNumber: null,
    department: null,
    faculty: null,
    program: null,
    level: null,
    enrollmentYear: null,
  });
  const route = useRoute();

  
  useEffect(() => {
    const getuser = async () => {
      try {
        setIsLoading(true)
        const id = route.params?.studentID;
        const response = await axios.get(`https://fingerprintenabled.onrender.com/api/student/${id}`);
        const { dateOfBirth, yearOfEnrollment, ...userData } = response.data.student;
       
        setUser({
          ...userData,
          dateOfBirth: formatDate(dateOfBirth),
          enrollmentYear: formatDate(yearOfEnrollment),
        });
      } catch (error) {
        console.log(error.message);
      }

      finally{
        setIsLoading(false)
      }
    };
    getuser();
  }, []);

  // Function to format date as dd-mm-yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, flex: 1}}>
          <ActivityIndicator size="large" color="#0CEEF2" />
          <Text style ={{color: '#fff', fontSize: 16}}>Please wait a moment...</Text>
        </View>
      ): (
        <>
          <View style={styles.topContainer}>
            <Text style={styles.headerText}>Student Data</Text>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.5)']}
              start={{ x: 1, y: 0.1 }}
              end={{ x: 0.8, y: 1 }}
              style={styles.gradientBorder}
            >
              {user.image && (
                <Image
                  source={{ uri: `data:${user.image.contentType};base64,${Buffer.from(user.image.data.data).toString('base64')}` }}
                  style={styles.image} />
              )}
            </LinearGradient>

          </View><View></View><ScrollView showsVerticalScrollIndicator={true}>
              <View style={{ margin: 15 }}>
                <Text style={styles.textMedium}>Basic Information</Text>
                <Text style={styles.textSmall}>Name: {user?.name}</Text>
                <Text style={styles.textSmall}>Date of birth: {user?.dateOfBirth}</Text>
                <Text style={styles.textSmall}>Gender: {user?.gender}</Text>
              </View>
              <View style={{ margin: 15 }}>
                <Text style={styles.textMedium}>Contact Information</Text>
                <Text style={styles.textSmall}>Email: {user?.email}</Text>
                <Text style={styles.textSmall}>Phone Number: {user?.phoneNumber}</Text>
              </View>
              <View style={{ margin: 15 }}>
                <Text style={styles.textMedium}>Academic Details</Text>
                <Text style={styles.textSmall}>Faculty: {user?.faculty}</Text>
                <Text style={styles.textSmall}>Department: {user?.department}</Text>
                <Text style={styles.textSmall}>Program: {user?.program}</Text>
                <Text style={styles.textSmall}>Student ID: {user?.studentID}</Text>
                <Text style={styles.textSmall}>Level: {user?.level}</Text>
                <Text style={styles.textSmall}>Year of enrollment: {user?.enrollmentYear}</Text>
              </View>
            </ScrollView><IconsNavigation />
          </>
      )}
      
    </SafeAreaView>
  );
};

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
    marginBottom: 5,
  },
  textSmall: {
    color: '#acadac',
    fontSize: 17,
    marginVertical: 5,
  },
  gradientBorder: {
    width: Dimensions.get('screen').width,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: Dimensions.get('screen').width,
    height: 250,
    objectFit: 'scale-down'
  },
});

export default Home;
