import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, KeyboardAvoidingView, StyleSheet, Image, TextInput, Pressable, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import axios from 'axios'

const Register = () => {
  const [user, setUser] = useState({
    profile: '',
    name: '',
    gender: '',
    dateOfBirth: '',
    studentID: '',
    email: '',
    phoneNumber: '',
    department: '',
    faculty: '',
    program: '',
    level: '',
    enrollmentYear: '',
    email: '', 
  });

  const backendURL = "https://fingerprintenabled.onrender.com/api/auth/register"
  
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = 4;
  const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);

  const navigate = useNavigation();
  const image = require('../assets/profile.jpeg');

  const handleNavigation = () => {
    navigate.navigate('Login');
  };


  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)

  const showDatePicker = () => {
    setIsDatePickerVisible(true)
  }

  const hideDatePicker = () => {
    setIsDatePickerVisible(false)
  }

  const handleConfirm = (selectedDate) => {
    console.log(`A date has been picked: ${selectedDate}`)
    setUser({ ...user, dateOfBirth: selectedDate });
    hideDatePicker()
  }


  // Image Picker
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setUser({ ...user, profile: result.uri });
    }
  };

  // Data submission
  const submitData = async () => {
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
  
      console.log('Fingerprint result:', JSON.stringify(result)); // Log fingerprint result as plain text
  
      if (result.success) {
        // Register user using his fingerprint data
        const userData = { 
         fingerprint: result.success,
          ...user
        };
        console.log(`Fingerprint: ${result.success}`);
        console.log("User Data to be registered: ", userData);
        const response = await axios.post(backendURL, userData);
        if (response.status === 200) {
          const { token } = response.data;
          console.log(`token: ${token}`)
          Alert.alert('Message', response.data.message);
          setUser({ ...user, hasFingerprintData: true });
          const DOB = user.dateOfBirth instanceof Date ? user.dateOfBirth.toLocaleDateString() : '';
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          await AsyncStorage.setItem('token', token); // Save the token in AsyncStorage
          navigate.navigate('Home');
        } else {
          Alert.alert('Error', response.data.error);
        }
      } else {
        Alert.alert('Error', 'Fingerprint authentication failed');
      }
    } catch (error) {
      console.error('Error during fingerprint authentication:', error);
      Alert.alert('Error', error.message)
    }
  };

  useEffect(() => {
    submitData()
    
  },[])
  

  const handleNext = () => {
    if (!isStepValid(currentStep)) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
  
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } 
    else {
      submitData(); // Trigger data submission when all steps are completed
    }
  };
  

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return !!user.profile;
      case 2:
        if (!user.name || !user.dateOfBirth || !user.studentID) {
          Alert.alert('Error', 'Please fill in all required fields.');
          return false;
        }
        return true;
      case 3:
        if (!user.email || !user.phoneNumber) {
          Alert.alert('Error', 'Please fill in all required fields.');
          return false;
        }
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(user.email);
        if (!isValidEmail) {
          Alert.alert('Error', 'Invalid email format');
          return false;
        }
        // Phone number validation (assuming 10-digit numbers)
        const phoneRegex = /^[0-9]{10}$/;
        const isValidPhone = phoneRegex.test(user.phoneNumber);
        if (!isValidPhone) {
          Alert.alert('Error', 'Invalid phone number format (10 digits expected)');
          return false;
        }
        return true;
      case 4:
        if (!user.department || !user.faculty || !user.program || !user.level || !user.enrollmentYear) {
          Alert.alert('Error', 'Please fill in all required fields.');
          return false;
        }
        return true;
      default:
        return true;
    }
  };
  
  
  //Bottom sheet
  const bottomSheetRef = useRef(true)
  const handleDepartmentSelect = (department) => {
    setUser({ ...user, department });
    bottomSheetRef.current.close(); // Close bottom sheet after selection
  };

  const renderBackdrop = useCallback((props) => {
    return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={2} />;
  }, []);


  const departments = ['Department 1', 'Department 2', 'Department 3', 'Department 4'];
  // Render department items
  const renderDepartmentItems = () => {
    return departments.map((department) => (
      <Pressable
        key={department}
        style={styles.departmentItem}
        onPress={() => handleDepartmentSelect(department)}
      >
        <Text style={styles.departmentText}>{department}</Text>
      </Pressable>
    ));
  };

  // Rendering inputs
  const renderInputs = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <Text style={styles.textMedium}>Choose a profile</Text>
            <LinearGradient
              colors={['#0CEEF2', '#E400F8', 'transparent']}
              start={{ x: 1, y: 0.1 }}
              end={{ x: 0.8, y: 1 }}
              style={styles.gradientBorder}
            >
              <Image source={{ uri: user.profile || 'https://t3.ftcdn.net/jpg/02/43/51/48/360_F_243514868_XDIMJHNNJYKLRST05XnnTj0MBpC4hdT5.jpg' }} style={styles.image} />
              <Pressable
                onPress={pickImage}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: 100,
                  backgroundColor: '#fff',
                  position: 'absolute',
                  right: 0,
                  bottom: 15,
                }}
              >
                <Feather name="camera" size={28} color="#0CEEF2" />
              </Pressable>
            </LinearGradient>
          </>
        );
      case 2:
        return (
          <>
            <View>
              <Text style={[styles.textMedium, { color: '#acadac', marginLeft: 20 }]}>Basic Information</Text>
              <TextInput
                style={[styles.input, { margin: 15 }]}
                placeholder="Name"
                placeholderTextColor="#acadac"
                value={user.name}
                onChangeText={(text) => setUser({ ...user, name: text })}
              />
               {Platform.OS === 'ios' ? (
                <DateTimePickerModal 
                  isVisible = {isDatePickerVisible}
                  mode='date'
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                
                />
              ) : (
                <View style = {{alignItems: 'center', justifyContent: 'center'}}> 
                  <Pressable onPress={showDatePicker}  style={[styles.input, { justifyContent: 'center'}]}>
                    <Text style={{color: '#acadac'}}>{user.dateOfBirth ? user.dateOfBirth.toLocaleDateString() : 'Date of Birth'}</Text>
                  </Pressable>
                  {isDatePickerVisible && (
                    <DateTimePickerModal 
                    isVisible = {isDatePickerVisible}
                    mode='date'
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                  
                  />
                  )}
                </View>
              )}

              <TextInput
                style={[styles.input, { margin: 15 }]}
                placeholder="Student ID"
                placeholderTextColor="#acadac"
                value={user.studentID}
                onChangeText={(text) => setUser({ ...user, studentID: text })}
              />
            </View>
          </>
        );
      case 3:
        return (
          <>
            <View style={{ marginTop: 15 }}>
              <Text style={[styles.textMedium, { textAlign: 'left', marginLeft: 20 }]}>Contact Information</Text>
              <TextInput
                style={[styles.input, { margin: 15 }]}
                placeholder="Email"
                placeholderTextColor="#acadac"
                value={user.email}
                onChangeText={(text) => setUser({ ...user, email: text })}
              />
              <TextInput
                style={[styles.input, { margin: 15 }]}
                placeholder="Phone Number"
                placeholderTextColor="#acadac"
                value={user.phoneNumber}
                onChangeText={(text) => setUser({ ...user, phoneNumber: text })}
              />
            </View>
          </>
        );
      case 4:
        return (
          <>
            <View>
              <Text style={[styles.textMedium, { color: '#acadac', marginLeft: 20 }]}>Academic Details</Text>
              <TextInput
                style={styles.input}
                placeholder="Department"
                placeholderTextColor="#acadac"
                value={user.department}
                onChangeText={(text) => setUser({ ...user, department: text })}
                onFocus={() => bottomSheetRef.current.expand()}
              />

              <TextInput
                style={styles.input}
                placeholder="Faculty"
                placeholderTextColor="#acadac"
                value={user.faculty}
                onChangeText={(text) => setUser({ ...user, faculty: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Program"
                placeholderTextColor="#acadac"
                value={user.program}
                onChangeText={(text) => setUser({ ...user, program: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Level"
                placeholderTextColor="#acadac"
                value={user.level}
                onChangeText={(text) => setUser({ ...user, level: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Year of Enrollment"
                placeholderTextColor="#acadac"
                value={user.enrollmentYear}
                onChangeText={(text) => setUser({ ...user, enrollmentYear: text })}
              />

              <BottomSheet ref={bottomSheetRef} snapPoints={['25%', '50%', '75%']}>
                <View style={styles.bottomSheetContent}>
                  <Text style={styles.bottomSheetHeader}>Select Department</Text>
                  {renderDepartmentItems()}
                </View>
              </BottomSheet>
            </View>
          </>
        );
      default:
        return null;
    }
  };

  const renderIndicator = () => {
    return (
      <>
        <View style={{ margin: 5, flexDirection: 'row', alignItems: 'center', gap: 25 }}>
          {steps.map((step) => (
            <Pressable
              key={step}
              onPress={() => {
                if (!isStepValid(step)) {
                  Alert.alert('Error', 'Please fill in all required fields before proceeding.');
                  return;
                }
                setCurrentStep(step);
              }}
              style={[
                styles.circle,
                {
                  backgroundColor: currentStep === step ? '#0CEEF2' : 'transparent',
                },
              ]}
            >
              <Text
                style={[
                  styles.textSmall,
                  {
                    color: currentStep !== step ? '#acadac' : '#fff',
                  },
                ]}
              >
                {step}
              </Text>
            </Pressable>
          ))}
        </View>
      </>
    );
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.innerContainer}>
        <Text style={styles.headerText}>Sign Up</Text>
        {renderIndicator()}
        {renderInputs()}
        <Pressable style={styles.button} onPress={handleNext}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
            {currentStep < totalSteps ? 'Next' : 'Authenticate fingerprint'}
          </Text>
        </Pressable>
        <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', margin: 15 }}>
          <Text style={styles.textSmall}>Haven't registered?</Text>
          <Pressable onPress={handleNavigation}>
            <Text style={[styles.textSmall, { color: '#0CEEF2' }]}>Click here</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#0CEEF2',
    borderRadius: 70,
    borderWidth: 0.5,
    borderColor: '#0CEEF2',
  },
  textMedium: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'left',
    margin: 10,
  },
  textSmall: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gradientBorder: {
    width: 195,
    height: 195,
    borderRadius: 200,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 200,
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
  button: {
    margin: 15,
    width: 350,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0CEEF2',
    borderRadius: 20,
    padding: 10,
  },
});

export default Register;
