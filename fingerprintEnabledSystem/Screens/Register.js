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
const Register = () => {
  const [user, setUser] = useState({
    profile: null,
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
  });

  const [currentDate, setCurrentDate] = useState(new Date())

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
            
            handleImagePickerResult(result); // Pass the result to handleImagePickerResult
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Function to upload profile image
  const uploadProfileImage = async (imageUri) => {
    try {
      const formData = new FormData()
      formData.append('profile', imageUri)
      const response = await axios.post('https://fingerprintenabled.onrender.com/uploadImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        console.log(response.data);
      } else if (response.error) {
        console.log(response.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  // Function to convert image to base64
  const convertImageToBase64 = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const base64String = await blobToBase64(blob);
      return base64String;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };

  // Function to convert blob to base64
  const blobToBase64 = async (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  };


  
  // Move the profile image upload logic inside handleImagePickerResult
  const handleImagePickerResult = async (result) => {
    if (!result.cancelled) {
      const fileUri = result.assets[0].uri;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        const newPath = FileSystem.cacheDirectory + 'profileImage.jpg';
        await FileSystem.copyAsync({ from: fileUri, to: newPath });
        setUser({ ...user, profile: newPath });
        console.log(`Image uri: ${newPath}`);
        const base64Image = convertImageToBase64(newPath)
        console.log(base64Image)
        // Upload the image here
        uploadProfileImage(base64Image);
      } else {
        console.log('File does not exist:', fileUri);
      }
    }
  };



  const submitData = async () => {
    try {
      setIsLoading(true);
  
      // Check if fingerprint authentication is supported and enrolled
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert('Error', 'Fingerprint authentication is not supported on this device');
        setIsLoading(false);
        return;
      }
  
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert('Error', 'No fingerprint enrolled on this device.');
        setIsLoading(false);
        return;
      }
  
      // Authenticate user with fingerprint
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with your fingerprint',
      });
  
      console.log('Fingerprint result:', JSON.stringify(result));
  
      if (result.success) {
        const fingerPrint = result.success.toString();
  
       
        const userData = {
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
          level: user.level,
          yearOfEnrollment: user.enrollmentYear,
          fingerprint: fingerPrint,
        };
  
        // Making POST request with authorization header
        const token = await AsyncStorage.getItem('token');
        const response = await axios.post(backendURL, userData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Handle response
        if (response.data.error) {
          Alert.alert('Error', response.data.error);
          console.log(`Error: ${response.data.error}`);
        } else if (response.status === 200) {
          console.log("Navigating to home screen");
          const { token } = response.data;
          console.log(`token: ${token}`);
          if (token) {
            await AsyncStorage.setItem('token', token);
            console.log(response.data.newStudent)
            navigate.navigate('Login');
          } else {
            console.log('Error: Token is undefined or null');
            Alert.alert('Error', 'Token is undefined or null');
          }
        }
      } else {
        Alert.alert('Error', 'Fingerprint authentication failed');
      }
    } catch (error) {
      // Handle error
      setIsLoading(false);
      Alert.alert('Error', error.message);
      console.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
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

        if (user.gender === 'Select gender'){
          Alert.alert('Error', 'Please select gender')
          return false
        }

        if(user.studentID.length !== 9 || !user.studentID.endsWith('D')){
          Alert.alert('Error','Invalid student ID')
          return false
        }
        return true;

      case 3:
        if (!user.department || !user.faculty || !user.program || !user.level || !user.enrollmentYear) {
          console.log(user.department, user.faculty, user.program, user.level);
          Alert.alert('Error', 'Please fill in all required fields.');
          return false;
        }

        if (user.level === 'Select level'){
          Alert.alert('Error', 'Please select your level')
          return false
        }

        if (user.faculty === 'Please select your faculty'){
          Alert.alert('Error', 'Please select your faculty')
          return false
        }

        if (user.department === 'Please select your department'){
          Alert.alert('Error', 'Please select your department')
          return false
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

        if (user.password.length < 5) {
          Alert.alert('Error', 'Password must be at least 6 characters long)');
          return false;
        }


        return true;
      default:
        return true;
    }
  };
  
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
                  Alert.alert('Error', 'Please fill in all required fields before proceeding.');
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
          
              <TouchableOpacity onPress={() => setModalVisible(true)}  style={[styles.input, {justifyContent: 'center'}]}>
                <Text style = {{color: '#acadac', justifyContent: 'center'}}> {user.department}</Text>
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
