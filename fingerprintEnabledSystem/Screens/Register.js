import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, KeyboardAvoidingView,
   StyleSheet, Image, TextInput, TouchableOpacity, 
   Platform, Alert, Animated, Modal, Dimensions, ScrollView,
   Pressable
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import  Feather from '@expo/vector-icons/Feather'; 
import { Picker } from '@react-native-picker/picker'
import { departments, faculties, genders, levels, } from '../UserData';
import RadioButton from '../component/RadioButton';
import CircularLoader from '../component/CircularLoader';

import * as FileSystem from 'expo-file-system'
import { ErrorMessages, SuccessMessages } from '../component/Messages';
import PasswordStrength from '../component/PasswordStrength';




const Register = () => {
  const [user, setUser] = useState({
    profile: 'https://t3.ftcdn.net/jpg/02/43/51/48/360_F_243514868_XDIMJHNNJYKLRST05XnnTj0MBpC4hdT5.jpg',
    name: '',
    gender: 'Select gender',
    dateOfBirth: '',
    studentID: '',
    email: '',
    password: '',
    phoneNumber: '',
    department: 'Please select your department',
    faculty: 'Please select your faculty',
    program: '',
    level: 'Select Level',
    enrollmentYear: '',
    yearOfCompletion:''
  });

  const [isPasswordFieldFocused, setIsPasswordFieldFocused] = useState(false)

  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorVisible, setErrorVisible] = useState(false)
  const [successVisible, setSuccessVisible] = useState(false)
  const [passwordStrengthVisible, setPasswordStrengthVisible] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())

  const [passwordScore, setPasswordScore] = useState(0)

  const [isLoading, setIsLoading] = useState(false)

  const pickerRef = useRef();

  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }

  const [isVisible, setIsVisible] = useState(false)

  const [modalVisible, setModalVisible] = useState(false);
  const modalAnimatedValue = useRef(new Animated.Value(0)).current;

  const handleDepartmentSelect = (department) => {
    setUser({ ...user, department });
    setModalVisible(false);
  };

  const animateModal = (toValue) => {
    Animated.timing(modalAnimatedValue, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const backendURL = "https://fingerprintenabled.onrender.com/api/auth/register"
  
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = 4;
  const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);

  const navigate = useNavigation();

  const handleNavigation = () => {
    navigate.navigate('Login');
  };

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)
  const [isEnrollmentDatePickerVisible, setIsEnrollmentDatePickerVisible] = useState(false);

  // Function to show the enrollment year date picker
  const showEnrollmentDatePicker = () => {
    setIsEnrollmentDatePickerVisible(true);
  };

  // Function to hide the enrollment year date picker
  const hideEnrollmentDatePicker = () => {
    setIsEnrollmentDatePickerVisible(false);
  };

  // Function to handle the selection of enrollment year
  const handleEnrollmentConfirm = (selectedDate) => {
    const dateObject = new Date(selectedDate);
    const date = dateObject.toLocaleDateString();
    setUser({ ...user, enrollmentYear: date.toString() });
    hideEnrollmentDatePicker();
  };

  const [isYearOfCompletionDatePickerVisible, setIsYearOfCompletionDatePickerVisible] = useState(false);
  // Function to show the year of completion date picker
  const showYearOfCompletionDatePicker = () => {
    setIsYearOfCompletionDatePickerVisible(true);
  };

  // Function to hide the year of completion date picker
  const hideYearOfCompletionPicker = () => {
    setIsYearOfCompletionDatePickerVisible(false);
  };

  // Function to handle the selection of year of completion
  const handleYearOfCompletionDateConfirm = (selectedDate) => {
    const dateObject = new Date(selectedDate);
    const date = dateObject.toLocaleDateString();
    setUser({ ...user, yearOfCompletion: date.toString() });
    hideYearOfCompletionPicker();
  };

  const showDatePicker = () => {
    setIsDatePickerVisible(true)
  }
  
  const hideDatePicker = () => {
    setIsDatePickerVisible(false)
  }
  
  
  const handleConfirm = (selectedDate) => {
    
    const dateObject = new Date(selectedDate); 
    const formattedDate = dateObject.toLocaleDateString(); 
    setUser({ ...user, dateOfBirth: formattedDate });
    hideDatePicker();
  };

  const pickImage = async () => {
    Alert.alert(
      'Select Image Source',
      'Choose the source of the image',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Camera',
          onPress: async () => {
            let result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.5,
            });
  
            console.log(result)
            handleImagePickerResult(result);
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });
            
            handleImagePickerResult(result);
          },
        },
      ],
      { cancelable: false }
    );
  };

  
  const handleImagePickerResult = async (result) => {
    if (!result.cancelled) {
      const imageUri = result.assets[0].uri;
      console.log(`Original Image uri: ${imageUri}`);
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (fileInfo.exists && fileInfo.isDirectory === false) {
        setUser({ ...user, profile: imageUri });
      } else {
        console.log('Selected image is not a file');
        setErrorMessage('Please select a valid image file');
        setErrorVisible(true)
      }
    } else {
      console.log('Failed to setUserProfile');
    }
  };

  
  const submitData = async () => {
    try {
        setIsLoading(true);

        // Check if fingerprint authentication is supported and enrolled
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (!hasHardware) {
          setErrorMessage('Fingerprint authentication is not supported on this device');
          setErrorVisible(true)
          setIsLoading(false);
          return;
        }

        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!isEnrolled) {
          setErrorMessage('No fingerprint enrolled on this device.');
          setErrorVisible(true)
          setIsLoading(false);
          return;
        }

        // Authenticate user with fingerprint
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate with your fingerprint',
        });


        if (result.success) {
            const fingerPrint = result.success.toString();
            const formData = new FormData();
            const localUri = user.profile;
            const filename = localUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image';
            formData.append('image', { uri: localUri, name: filename, type });

            formData.append('name', user.name);
            formData.append('gender', user.gender);
            formData.append('dateOfBirth', user.dateOfBirth);
            formData.append('studentID', user.studentID);
            formData.append('email', user.email);
            formData.append('password', user.password);
            formData.append('phoneNumber', user.phoneNumber);
            formData.append('department', user.department);
            formData.append('faculty', user.faculty);
            formData.append('program', user.program);
            formData.append('level', user.level);
            formData.append('yearOfEnrollment', user.enrollmentYear);
            formData.append('yearOfCompletion', user.yearOfCompletion);
            formData.append('fingerprint', fingerPrint);

            console.log('Form Data', formData)

            // Making POST request with authorization header
            const response = await axios.post(backendURL, formData, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Handling response
            if (response.data.error) {
              setErrorMessage(response.data.error)
              setErrorVisible(true)
            } 
            else {
              
              await AsyncStorage.setItem('token', token);
              setSuccessMessage(response.data.message)
              setSuccessVisible(true)
            }
        } else {
           setErrorMessage('Fingerprint authentication failed');
           setErrorVisible(true)
        }
    } catch (error) {
        setIsLoading(false);
        if (error.response) {
            setErrorMessage(error.response.data.error);
            setErrorVisible(true)
        } else if (error.request) {
          console.log('Request made but no response received.');
        } 
        else {
          console.log('Error:', error.message);
          setErrorMessage('An error occurred while registering');
          setErrorVisible(true)
        }
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    if (successVisible) {
      setTimeout(() => {
        setSuccessVisible(false);
        navigate.navigate('Login');
      }, 3000); 
    }
  }, [successVisible])
  
  const handleIsFocused = () => {
    setIsPasswordFieldFocused(true)
  }

  const handleOnBlur = () => {
    setIsPasswordFieldFocused(false)
  }
  const handleNext = () => {
    if (!isStepValid(currentStep)) {
      return;
    }
  
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      
    } else {
     
      submitData(); 
    }
  };
  
  
  

  const isStepValid = (step) => {
    switch (step) {
      
      case 1:
        if (user.profile === 'https://t3.ftcdn.net/jpg/02/43/51/48/360_F_243514868_XDIMJHNNJYKLRST05XnnTj0MBpC4hdT5.jpg'){
          setErrorMessage('Profile picture is required.');
          setErrorVisible(true)
          return false
        }
        return true
      case 2:
        if (!user.name || !user.gender || !user.dateOfBirth || !user.studentID) {
          setErrorMessage('Please fill in all required fields.');
          setErrorVisible(true)
          return false;
        }

        if (user.gender === 'Select gender'){
          setErrorMessage('Please select gender')
          setErrorVisible(true)
          return false
        }

        if(user.studentID.length !== 9 || !user.studentID.endsWith('D')){
          setErrorMessage('Invalid student ID')
          setErrorVisible(true)
          return false
        }
        return true;

      case 3:
        if (!user.department || !user.faculty || !user.program || !user.level || !user.enrollmentYear) {
          setErrorMessage('Please fill in all required fields.');
          setErrorVisible(true)
          return false;
        }

        if (user.level === 'Select level'){
          setErrorMessage('Please select your level')
          setErrorVisible(true)
          return false
        }

        if (user.faculty === 'Please select your faculty'){
          setErrorMessage('Please select your faculty')
          setErrorVisible(true)
          return false
        }

        if (user.department === 'Please select your department'){
          setErrorMessage('Please select your department')
          setErrorVisible(true)
          return false
        }

        return true;
        
      case 4:
        const passwordRegex  = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (!user.email || !user.phoneNumber || !user.password) {
          setErrorMessage('Please all fields are required')
          setErrorVisible(true)
          return false;
        }
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(user.email);
        if (!isValidEmail) {
          setErrorMessage('Invalid email format')
          setErrorVisible(true)
          return false;
        }
        // Phone number validation (assuming 10-digit numbers)
        const isValidPhone = phoneRegex.test(user.phoneNumber);
        if (!isValidPhone) {
          setErrorMessage('Invalid phone number format (10 digits expected)');
          setErrorVisible(true)
          return false;
        }

        if (user.password.length < 5 && passwordRegex.test(user.password)) {
          setErrorMessage('Password must be at least 6 characters long');
          setErrorVisible(true)
          return false;
        }


        return true;
      default:
        return true;
    }
  };

  const programSelect = () => {
    switch(departments){
      case '': 
    }
  }
  
  //rendering indicator / steps 
  const renderIndicator = () => {
    return (
      <>
        <View style={{ margin: 5, flexDirection: 'row', alignItems: 'center', gap: 25 }}>
          {steps.map((step) => (
            <TouchableOpacity
              key={step}
              onPress={() => {
                if (!isStepValid(step)) {
                  setErrorMessage('Error', 'Please fill in all required fields before proceeding.');
                  setErrorVisible(true)
                  return;
                }
                setCurrentStep(step);
              }}
              style={[
                styles.circle,
                {
                  borderColor: currentStep === step ? 'transparent' : '#f2f2f2',
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
            </TouchableOpacity>
          ))}
        </View>
      </>
    );
  };
  

  
  // Rendering inputs
  const renderInputs = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
          <View style = {{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.textMedium}>Choose a profile</Text>
            <LinearGradient
              colors={['#0CEEF2', '#fff', 'transparent']}
              start={{ x: 1, y: 0.1 }}
              end={{ x: 0.8, y: 1 }}
              style={styles.gradientBorder}
            >
              <Image source={{ uri: user.profile}} style={styles.image} />
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
          </View>
            
          </>
        );
      case 2:
        return (
          <>
            <View>
              <Text style={[styles.textMedium, { color: '#acadac', marginLeft: 20 }]}>Basic Information</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name eg. John Doe"
                placeholderTextColor="#acadac"
                value={user.name}
                onChangeText={(text) => setUser({ ...user, name: text })}
              />
              
              
              <View style = {[styles.input, {flexDirection: 'row', alignItems: 'center', justifyContent: 'center',}]}>
                <Text style = {{color: '#acadac', fontSize: 15, textAlign: 'center', marginLeft: -8}}></Text>
                <Picker
                  ref={pickerRef}
                  style = {styles.input}
                  selectedValue={user.gender}
                  onValueChange={(itemValue, itemIndex) =>
                   
                    setUser({...user, gender: itemValue})
                  }>
                  {genders.map(item => (
                      <Picker.Item label={item} value={item} key={item} />
                  ))}
                </Picker>
              </View>
              

              {Platform.OS === 'ios' ? (
                <Pressable onPress={showDatePicker} style = {[styles.input, {alignItems: 'flex-start'}]}> 
                  <View  style = {{marginTop: 7}}>
                    <Text style={{color: '#acadac'}}>{user.dateOfBirth ? user.dateOfBirth : 'Date of Birth'}</Text>
                  </View>
                  {isDatePickerVisible && (
                    <DateTimePickerModal 
                      isVisible = {isDatePickerVisible}
                      mode='date'
                      maximumDate={currentDate}
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                    />
                  )}
                </Pressable>
              ) : (
                <Pressable onPress={showDatePicker} style = {[styles.input, {alignItems: 'flex-start'}]}> 
                  <View  style = {{marginTop: 7}}>
                    <Text style={{color: '#acadac'}}>{user.dateOfBirth ? user.dateOfBirth : 'Date of Birth'}</Text>
                  </View>
                  {isDatePickerVisible && (
                    <DateTimePickerModal 
                      isVisible = {isDatePickerVisible}
                      mode='date'
                      maximumDate={currentDate}
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                    />
                  )}
                </Pressable>
              )}

              <TextInput
                style={styles.input}
                placeholder="Student ID eg. 0121*******D"
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
            <View>
              <Text style={[styles.textMedium, { color: '#acadac'}]}>Academic Details</Text>
             
              <View style = {[styles.input, {flexDirection: 'row', alignItems: 'center', justifyContent: 'center',}]}>
                <Text style = {{color: '#acadac', fontSize: 15, textAlign: 'center', marginLeft: 10}}></Text>
                <Picker
                  ref={pickerRef}
                  style = {[styles.input, {marginLeft: -10}]}
                  selectedValue={user.faculty}
                  onValueChange={(itemValue, itemIndex) =>
                      setUser({...user, faculty: itemValue}) 
                  }>
                  {faculties.map(item => (
                      <Picker.Item label={item} value={item} key={item} />
                  ))}
                </Picker>
              </View>
          
              <Pressable onPress={() => setModalVisible(true)}  style={[styles.input, {justifyContent: 'center'}]}>
                <Text style = {{color: '#acadac', justifyContent: 'center'}}> {user.department}</Text>
              </Pressable>

              <Modal
                transparent
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <Animated.View
                    style={[
                      styles.modalContent, {paddingBottom: 15, paddingRight: 5},
                      {
                        transform: [
                          {
                            translateY: modalAnimatedValue.interpolate({
                              inputRange: [0, 1],
                              outputRange: [500, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                     <ScrollView showsVerticalScrollIndicator={false}>
                      <View style = {{margin: 15}}>
                        {departments.map((department) => (
                          <Pressable
                            key={department}
                            style = {{marginVertical: 5}}
                            onPress={() => handleDepartmentSelect(department)}
                          >
                            <RadioButton
                              label={department}
                              selected={department === user.department}
                              onPress={() => handleDepartmentSelect(department)}
                            />
                          </Pressable> 
                        ))}
                      </View>
                      
                    </ScrollView>
                  </Animated.View>
                </View>
              </Modal>

              <TextInput
                style={styles.input}
                placeholder= "Program of study eg. HND - Computer Science"
                placeholderTextColor="#acadac"
                value={user.program}
                onChangeText={(text) => setUser({ ...user, program: text })}
              />
              <View style = {[styles.input, {flexDirection: 'row', alignItems: 'center', justifyContent: 'center',}]}>
                <Text style = {{color: '#acadac', fontSize: 15, textAlign: 'center', marginLeft: -8}}></Text>
                <Picker
                  ref={pickerRef}
                  style = {styles.input}
                  selectedValue={user.level}
                  onValueChange={(itemValue, itemIndex) =>
                      setUser({...user, level: itemValue})
                  }>
                  {levels.map(item => (
                      <Picker.Item label={item} value={item} key={item} />
                  ))}
                </Picker>
              </View>

              {Platform.OS === 'ios' ? (
                <Pressable onPress={showEnrollmentDatePicker} style={[styles.input, { justifyContent: 'center' }]}>
                  <Text style={{ color: '#acadac' }}>{user.enrollmentYear ? user.enrollmentYear : 'Date of enrollment'}</Text>
                </Pressable>
              ) : (
                <Pressable onPress={showEnrollmentDatePicker} style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <View  style={[styles.input, { justifyContent: 'center' }]}>
                    <Text style={{ color: '#acadac' }}>{user.enrollmentYear ? user.enrollmentYear : 'Date of enrollment'}</Text>
                  </View>
                  {isEnrollmentDatePickerVisible && (
                    <DateTimePickerModal
                      isVisible={isEnrollmentDatePickerVisible}
                      mode="date"
                      maximumDate={currentDate}
                      onConfirm={handleEnrollmentConfirm}
                      onCancel={hideEnrollmentDatePicker}
                    />
                  )}
                </Pressable>
              )}

              {Platform.OS === 'ios' ? (
                <Pressable onPress={showYearOfCompletionDatePicker} style={[styles.input, { justifyContent: 'center' }]}>
                  <Text style={{ color: '#acadac' }}>{user.yearOfCompletion ? user.yearOfCompletion : 'Date of completion'}</Text>
                </Pressable>
              ) : (
                <Pressable onPress={showYearOfCompletionDatePicker} style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <View  style={[styles.input, { justifyContent: 'center' }]}>
                  <Text style={{ color: '#acadac' }}>{user.yearOfCompletion ? user.yearOfCompletion : 'Date of completion'}</Text>
                  </View>
                  {isYearOfCompletionDatePickerVisible && (
                    <DateTimePickerModal
                      isVisible={isYearOfCompletionDatePickerVisible}
                      mode="date"
                      maximumDate={currentDate}
                      onConfirm={handleYearOfCompletionDateConfirm}
                      onCancel={hideYearOfCompletionPicker}
                    />
                  )}
                </Pressable>
              )}

            </View>
          </>
        );

        case 4:
        return (
          <>
            <View style={{ marginTop: 15 }}>
              <Text style={[styles.textMedium, { textAlign: 'left', marginLeft: 20 }]}>Contact Information</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#acadac"
                value={user.email}
                onChangeText={(text) => setUser({ ...user, email: text })}
              />
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry={!isVisible}
                  placeholderTextColor="#acadac"
                  value={user.password}
                  onBlur={handleOnBlur}
                  onFocus={handleIsFocused}
                  onChangeText={(text) => setUser({ ...user, password: text })}
                />
                <TouchableOpacity onPress={() => setIsVisible(!isVisible)} 
                  style = {{
                    position: 'absolute',
                    right: 18, top: 24,
                    height: 40, 
                    width: 40
                  }}
                >
                  <Feather name={isVisible ? 'eye' : 'eye-off'} size={24} color="#0CEEF2" />
                </TouchableOpacity>
                
                {isPasswordFieldFocused &&  <PasswordStrength  password={user.password}/>}
                
              </View>
              
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#acadac"
                value={user.phoneNumber}
                onChangeText={(text) => setUser({ ...user, phoneNumber: text })}
              />
            </View>
          </>
        );
      default:
        return null;
    }
  };

  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.innerContainer}>
        <Text style={styles.headerText}>Sign Up</Text>
        
        {renderIndicator()}
        <ScrollView showsVerticalScrollIndicator = {false}>
          {renderInputs()}
         <TouchableOpacity style={styles.button} onPress={handleNext} disabled = {isLoading}>
            {isLoading ? (
              <CircularLoader />
            ) : (
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
                {currentStep < totalSteps ? 'Next' : 'Authenticate fingerprint'}
              </Text>
            )
            }
          
          </TouchableOpacity>
          <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Text style={styles.textSmall}>Already have an account?</Text>
            <TouchableOpacity onPress={handleNavigation} >
                <Text style={[styles.textSmall, { color: '#0CEEF2', }]}> Click here</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
      </KeyboardAvoidingView>
      {errorMessage && (
          <ErrorMessages 
            errorMessage={errorMessage}
            visible={errorVisible}
            onClose={() => setErrorVisible(false)}
          />
        )}

        {successMessage && (
          <SuccessMessages 
            successMessage={successMessage} 
            visible={successVisible}
            onClose={() => setSuccessVisible(false)}
          
          />
        )}
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
    borderRadius: 70,
    borderWidth: 0.5,
    
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
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0CEEF2',
    borderRadius: 20,
    padding: 10,
  },
  modalContainer: {
    alignItems: 'center',
    top: 0,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
  modalContent: {
    backgroundColor: '#1c1c1c',
    marginVertical: 10,
    borderRadius: 10,
    elevation: 5,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('window').height/2,
  },
 
});

export default Register;
