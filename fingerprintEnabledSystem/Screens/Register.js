import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, KeyboardAvoidingView,
   StyleSheet, Image, TextInput, TouchableOpacity, 
   Platform, Alert, Animated, Modal, Dimensions, ScrollView
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

const Register = () => {
  const [user, setUser] = useState({
    profile: '',
    name: '',
    gender: 'Male',
    dateOfBirth: '',
    studentID: '',
    email: '',
    password: '',
    phoneNumber: '',
    department: 'Dept. of Computer Science',
    faculty: 'Faculty of Applied Science',
    program: '',
    level: 'L100',
    enrollmentYear: '',
  });

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
    console.log(`Enrollment Year selected: ${date}`);
    setUser({ ...user, enrollmentYear: date.toString() });
    hideEnrollmentDatePicker();
  };

  const showDatePicker = () => {
    setIsDatePickerVisible(true)
  }
  
  const hideDatePicker = () => {
    setIsDatePickerVisible(false)
  }
  
  const handleConfirm = (selectedDate) => {
    
    const dateObject = new Date(selectedDate); // Convert selectedDate to a Date object
    const formattedDate = dateObject.toLocaleDateString(); // Extract date part only
    console.log(`A date has been picked: ${formattedDate}`);
    setUser({ ...user, dateOfBirth: formattedDate });
    hideDatePicker();
  };


  
  
  
  



  // Image Picker
const pickImage = async () => {
  // Show options for selecting image from camera or file system
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
            quality: 1,
          });

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

// Function to handle the result of image picker
const handleImagePickerResult = (result) => {
  if (!result.cancelled) {
    setUser({ ...user, profile: result.uri });
  }
};


  // Data submission
  const submitData = async () => {
    try {
      // Check if fingerprint authentication is supported and enrolled
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
  
      // Authenticate user with fingerprint
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with your fingerprint',
      });
  
      console.log('Fingerprint result:', JSON.stringify(result));
  
      if (result.success) {
        const fingerPrint = result.success.toString();
  
        // Create FormData object
        const formData = new FormData();
  
        // Append image file to FormData if user profile is not empty
        if (user.profile) {
          const localUri = user.profile;
          const filename = localUri.split('/').pop();
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image`;
  
          formData.append('profilePic', { uri: localUri, name: filename, type });
        }
  
        // Append other form data
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
        formData.append('level', parseInt(user.level));
        formData.append('yearOfEnrollment', parseInt(user.enrollmentYear));
        formData.append('fingerprint', fingerPrint);
  
        const requestData = {
          profilePic: user.profile,
          name: user.name,
          gender: user.gender,
          dateOfBirth: user.dateOfBirth,
          studentID: user.studentID,
          email: user.email,
          password: user.password,
          phoneNumber: user.phoneNumber,
          department: user.department,
          faculty: user.faculty,
          program: user.program,
          level: parseInt(user.level),
          yearOfEnrollment: user.enrollmentYear,
          fingerprint: fingerPrint,
        };
        // Make the POST request with axios
        const response = await axios.post(backendURL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.data.error) {
          Alert.alert('Error', response.data.error);
          console.log(`Error: ${response.data.error}`);
        } 
        else if (response.status === 200) {
          console.log("Navigating to home screen")
          const { token } = response.data;
          console.log(`Request data: ${JSON.stringify(requestData)}`);
          console.log(`token: ${token}`);
          if (token) {
            await AsyncStorage.setItem('userData', JSON.stringify(user));
            await AsyncStorage.setItem('token', token);  
            navigate.navigate('Home');
          } 
          else {
            console.log('Error: Token is undefined or null');
            Alert.alert('Error', 'Token is undefined or null');
          }
          Alert.alert('Message', response.data.message);
          console.log(response.data.message);
          await AsyncStorage.setItem('userData', JSON.stringify(user));
          await AsyncStorage.setItem('token', token);          
          navigate.navigate('Home');
        }
      } else {
        Alert.alert('Error', 'Fingerprint authentication failed');
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        Alert.alert('Error', error.response.data.error);
      } else if (error.request) {
        console.log('Request made but no response received.');
      } 
      else if (error.message){
        console.log(error.message);
      }
    }
  };
  
  


  const handleNext = () => {
    if (!isStepValid(currentStep)) {
      // Alert about the specific step's validation error
      return;
    }
  
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      
    } else {
      // Check if all steps are completed before triggering fingerprint authentication
      submitData(); // Trigger data submission when all steps are completed
    }
  };
  
  
  

  const isStepValid = (step) => {
    switch (step) {
      
      case 1:
        if (!user.profile){
          Alert.alert('Error', 'Profile picture is required.');
          return false
        }
        return true
      case 2:
        if (!user.name || !user.gender || !user.dateOfBirth || !user.studentID) {
          console.log(user.name, `Gender: ${user.gender}`, user.dateOfBirth, user.studentID);
          Alert.alert('Error', 'Please fill in all required fields.');
          return false;
        }
        return true;
      case 3:
        if (!user.department || !user.faculty || !user.program || !user.level || !user.enrollmentYear) {
          console.log(user.department, user.faculty, user.program, user.level);
          Alert.alert('Error', 'Please fill in all required fields.');
          return false;
        }
        return true;
      case 4:
        if (!user.email || !user.phoneNumber || !user.password) {
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
      default:
        return true;
    }
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
              <TouchableOpacity
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
              </TouchableOpacity>
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
              
              
              <View style = {[styles.input, {flexDirection: 'row', alignItems: 'center', justifyContent: 'center',}]}>
                <Text style = {{color: '#acadac', fontSize: 15, textAlign: 'center', marginLeft: 70}}>Gender:</Text>
                <Picker
                  ref={pickerRef}
                  style = {[styles.input, {marginLeft: -10}]}
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
              <DateTimePickerModal 
                isVisible = {isDatePickerVisible}
                mode='date'
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              
              />
              ) : (
                <View style = {{alignItems: 'center', justifyContent: 'center'}}> 
                  <TouchableOpacity onPress={showDatePicker}  style={[styles.input, { justifyContent: 'center'}]}>
                    <Text style={{color: '#acadac'}}>{user.dateOfBirth ? user.dateOfBirth : 'Date of Birth'}</Text>
                  </TouchableOpacity>
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
            <View>
              <Text style={[styles.textMedium, { color: '#acadac', marginLeft: 20 }]}>Academic Details</Text>
             
              <View style = {[styles.input, {flexDirection: 'row', alignItems: 'center', justifyContent: 'center',}]}>
                <Text style = {{color: '#acadac', fontSize: 15, textAlign: 'center', marginLeft: 70}}>Faculty:</Text>
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
          
              <TouchableOpacity onPress={() => setModalVisible(true)}  style={[styles.input, {justifyContent: 'center'}]}>
                <Text style = {{color: '#acadac', justifyContent: 'center'}}>{"Select department" ? `Department: ${user.department}` : null}</Text>
              </TouchableOpacity>

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
                          <TouchableOpacity
                          key={department}
                          style = {{marginVertical: 5}}
                          onPress={() => handleDepartmentSelect(department)}
                          >
                            <RadioButton
                              label={department}
                              selected={department === user.department}
                              onPress={() => handleDepartmentSelect(department)}
                            />
                          </TouchableOpacity> 
                        ))}
                      </View>
                      
                    </ScrollView>
                  </Animated.View>
                </View>
              </Modal>

              <TextInput
                style={styles.input}
                placeholder="Program"
                placeholderTextColor="#acadac"
                value={user.program}
                onChangeText={(text) => setUser({ ...user, program: text })}
              />
              <View style = {[styles.input, {flexDirection: 'row', alignItems: 'center', justifyContent: 'center',}]}>
                <Text style = {{color: '#acadac', fontSize: 15, textAlign: 'center', marginLeft: 70}}>Level:</Text>
                <Picker
                  ref={pickerRef}
                  style = {[styles.input, {marginLeft: -10}]}
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
                <TouchableOpacity onPress={showEnrollmentDatePicker} style={[styles.input, { justifyContent: 'center' }]}>
                  <Text style={{ color: '#acadac' }}>{user.enrollmentYear ? user.enrollmentYear : 'Date of enrollment'}</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <TouchableOpacity onPress={showEnrollmentDatePicker} style={[styles.input, { justifyContent: 'center' }]}>
                    <Text style={{ color: '#acadac' }}>{user.enrollmentYear ? user.enrollmentYear : 'Date of enrollment'}</Text>
                  </TouchableOpacity>
                  {isEnrollmentDatePickerVisible && (
                    <DateTimePickerModal
                      isVisible={isEnrollmentDatePickerVisible}
                      mode="date"
                      onConfirm={handleEnrollmentConfirm}
                      onCancel={hideEnrollmentDatePicker}
                    />
                  )}
                </View>
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
                style={[styles.input, { margin: 15 }]}
                placeholder="Email"
                placeholderTextColor="#acadac"
                value={user.email}
                onChangeText={(text) => setUser({ ...user, email: text })}
              />
              <View>
                <TextInput
                  style={[styles.input, { margin: 15 }]}
                  placeholder="Password"
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
      default:
        return null;
    }
  };

  const renderIndicator = () => {
    return (
      <>
        <View style={{ margin: 5, flexDirection: 'row', alignItems: 'center', gap: 25 }}>
          {steps.map((step) => (
            <TouchableOpacity
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
            </TouchableOpacity>
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
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
            {currentStep < totalSteps ? 'Next' : 'Authenticate fingerprint'}
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', margin: 15 }}>
          <Text style={styles.textSmall}>Haven't registered?</Text>
          <TouchableOpacity onPress={handleNavigation}>
            <Text style={[styles.textSmall, { color: '#0CEEF2' }]}>Click here</Text>
          </TouchableOpacity>
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
    borderColor: '#f2f2f2',
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
    color: '#acadac',
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
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
  modalContent: {
    backgroundColor: 'white',
    marginVertical: 10,
    borderRadius: 10,
    elevation: 5,
    position: 'absolute',
    width: '100%',
    height: Dimensions.get('window').height/2,
  },
 
});

export default Register;
