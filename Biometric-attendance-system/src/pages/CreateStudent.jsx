import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, TextField, Grid, InputLabel, MenuItem, Select, FormControl, IconButton } from '@mui/material';
import  CircularLoader  from '../components/Loaders'
import { GoEyeClosed, GoEye } from "react-icons/go";
import { HomeBgColor, buttonsBgColor } from '../constants/Colors';
import { useMediaQuery } from 'react-responsive';
import toast from 'react-hot-toast';
import axios from 'axios';
import { nameRegex, phoneNumberRegex } from '../constants/Validators';

const steps = ['Personal Information', 'Academic Information', 'Fingerprint Registration'];

const departments = [
  { id: 1, name: 'Computer Science', faculty: 'Faculty of Science and Technology', programs: ['BSc Computer Science', 'MSc Computer Science', 'PhD Computer Science', 'HND Computer Science'] },
  { id: 2, name: 'Electrical Engineering', faculty: 'Faculty of Engineering', programs: ['BSc Electrical Engineering', 'MSc Electrical Engineering', 'PhD Electrical Engineering', 'HND Electrical Engineering'] },
  { id: 3, name: 'Mathematics', faculty: 'Faculty of Science and Technology', programs: ['BSc Mathematics', 'MSc Mathematics', 'PhD Mathematics'] },
  { id: 4, name: 'Business Administration', faculty: 'Faculty of Business', programs: ['BBA Business Administration', 'MBA Business Administration', 'PhD Business Administration', 'HND Business Administration'] }
];

const CreateStudent = () => {

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1023px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

  const [isFinishDisabled, setIsFinishDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false)
  const [disableRegister, setDisableRegister] = useState(false)

  const [studentData, setStudentData] = useState({
    profilePicture: {
      file: null,
      url: null
    },
    name: '',
    gender: '',
    dateOfBirth: '',
    studentID: '',
    email: '',
    password: '',
    phoneNumber: '',
    department: '',
    faculty: '',
    program: '',
    level: '',
    yearOfEnrollment: '',
    yearOfCompletion: '',
    fingerprintImg: null,
    fingerprintID: null,
    showPassword: false,
  });

  const [dateType, setDateType] = useState(false)


  const [devLoading, setDevLoading] = useState({
    init: false,
    open: false,
    captureFin: false,
    enroll: false,
    enrollComp: false,
    close: false,
    cancel: false,
  })


 /* this is to track the device when connected in order to 
 * 1. capture fingerprint
 * 2. enroll fingerprint
 * 3.  close the device
 */


  //fingerprint fingerprintUrl
  const fingerprintUrl = 'http://localhost:5036'

  //initialize fingerprint device 
  const initiateDevice = async () => {

    await axios.post(`${fingerprintUrl}/api/fingerprint/init`)
    .then (res => {
      console.log(res.data);
      toast.success(res.data)
    }).catch(error => {
      if (error?.response && error?.response?.data?.error){
        toast.error(error.response.data.error)
      }
      else{
        toast.error('Failed to initiate device')
      }
    })

  }

  //open fingerprint device
  const openDevice = async () => {
    try{
      setDevLoading({ ...devLoading, open: true });
      const response = await axios.post(`${fingerprintUrl}/api/fingerprint/open`)
      toast.success(response.data)
    }
    catch (error){
      if (error?.response && error?.response?.data?.error){
        toast.error(error.response.data.error)
      }

      else {
        toast.error('Failed to open device')
      }
    }
    
    finally {
      setDevLoading({ ...devLoading, open: false });
    }  
  }

  //capture fingerprint 
  const captureFingerprint = async () => {
    try {
      setDevLoading({ ...devLoading, captureFin: true });
  
      const response = await axios.post(`${fingerprintUrl}/api/fingerprint/capture`);
      const { image, message } = response.data;
  
      if (image) {
        // Format the image as a data URL
        const base64Image = `data:image/png;base64,${image}`;
        setStudentData({ ...studentData, fingerprintImg: base64Image });
        toast.success(message);

      } else {
        toast.error("Fingerprint capture failed.");
      }
    } catch (error) {
      if (error?.response && error?.response?.data?.error){
        toast.error(error.response.data.error)
      }

      else {
        toast.error('Failed to capture fingerprint')
      }
    } 
    finally {
      setDevLoading({ ...devLoading, captureFin: false });
    }
  };

  const cancelEnrollment = async () => {
    try{
      setDevLoading({ ...devLoading, enrollFin: true });
      const response = await axios.post(`${fingerprintUrl}/api/fingerprint/enroll/cancel`)
      toast.success(response.data)
    }
    catch (error){
      if (error?.response && error?.response?.data?.error){
        toast.error(error.response.data.error)
      }
      else {
        toast.error('Failed to cancel enrollment')
      }
    }

    finally {
      setDevLoading({ ...devLoading, enrollFin: false });
    }
  }

  //start the machine for enrollment 
  const startEnrollment = async () => {
    try{
      setDevLoading({ ...devLoading, enrollFin: false });
      const response = await axios.post(`${fingerprintUrl}/api/fingerprint/enroll/start`)
      toast.success(response.data)
    }

    catch (error){
      if (error?.response && error?.response?.data?.error){
        toast.error(error.response.data.error)
      }
      else {
        toast.error('Failed to start enrollment')
      }
    }
  }

  // Complete fingerprint enroll
  const completeEnroll = async () => {
    try {
      setDevLoading({ ...devLoading, completeFin: true });
      const response = await axios.post(`${fingerprintUrl}/api/fingerprint/enroll/complete`);
      const { id, message } = response.data;

      console.log(`Enroll ID: ${id}`);
      setStudentData({ ...studentData, fingerprintID: id });

      // Pass the message string to toast.success
      toast.success(`Enrollment successful! ID: ${id}`);
    } catch (error) {
      if (error?.response && error?.response?.data?.error){
        toast.error(error.response.data.error)
      } 
      else {
        toast.error('Failed to complete enrollment');
      }
    } finally {
      setDevLoading({ ...devLoading, completeFin: false });
    }
  };

  //close device 
  const closeDevice = async () => {
    try{
      setDevLoading({ ...devLoading, closeFin: true });
      const response = await axios.post(`${fingerprintUrl}/api/fingerprint/close`)
      toast.success(response.data)
    }
    catch (error){
      if (error?.response && error?.response?.data?.error){
        toast.error(error.response.data.error)
      }
      else {
        toast.error('Failed to close device')
      }
    }
    finally {
      setDevLoading({ ...devLoading, closeFin: false });
    }
  }
  
  

   
   


  const [isFocused, setIsFocused] = useState({
    password: false
  });

  const handleClickShowPassword = () => {
    setStudentData({ ...studentData, showPassword: !studentData.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleFocus = (field) => () => {
    setIsFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => () => {
    setIsFocused((prev) => ({ ...prev, [field]: false }));
  };



  const [filteredPrograms, setFilteredPrograms] = useState([]);
  
  const handleChange = (event) => {
    if (!event || !event.target) {
      console.error('Event or event.target is undefined');
      return;
    }

    const { name, value } = event.target;
    setStudentData({
      ...studentData,
      [name]: value,
    });

    // Filter programs when department or faculty changes
    if (name === 'department') {
      const selectedDepartment = departments.find(dep => dep.name === value);
      if (selectedDepartment) {
        setFilteredPrograms(selectedDepartment.programs);
      } else {
        setFilteredPrograms([]);
      }
    }
  };


  useEffect(() => {
    // Filter programs when faculty changes
    if (studentData.department) {
      const selectedDepartment = departments.find(dep => dep.name === studentData.department);
      if (selectedDepartment) {
        setFilteredPrograms(selectedDepartment.programs);
      }
    }
  }, [studentData.department]);


  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size exceeds 2MB. Please upload a smaller image.");
        return;
      }
  
      const imageUrl = URL.createObjectURL(file);
  
      setStudentData(prevData => ({
        ...prevData,
        profilePicture: {
          file: file,
          url: imageUrl
        }
      }));
    }
  };
  
  

 


  const handleReset = () => {
    setActiveStep(0);
    setStudentData({
      profilePicture: null,
      name: '',
      gender: '',
      dateOfBirth: '',
      studentID: '',
      email: '',
      password: '',
      phoneNumber: '',
      department: '',
      faculty: '',
      program: '',
      level: '',
      yearOfEnrollment: '',
      yearOfCompletion: '',
      fingerprintImg: null,
      fingerprintID: null,
    });
    setIsFinishDisabled(true)
  };

  
  

  

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      
      const formData = new FormData();
  
      // Append the profile picture if it exists
      if (studentData.profilePicture?.file) {
        formData.append('image', studentData.profilePicture.file, studentData.profilePicture.file.name);
        console.log('Profile picture appended:', studentData.profilePicture.file.name);
      } else {
        console.warn('No profile picture selected');
      }
  
      // Append other form fields
      const fieldsToAppend = [
        'name', 'gender', 'dateOfBirth', 'studentID', 'email', 'password', 'phoneNumber',
        'department', 'faculty', 'program', 'level', 'yearOfEnrollment', 'yearOfCompletion', 'fingerprintID'
      ];
  
      fieldsToAppend.forEach(field => {
        if (studentData[field] !== null && studentData[field] !== undefined) {
          formData.append(field, studentData[field]);
        }
      });
  
      // Log all form data
      for (const [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name}` : value);
      }
  
      // Send data
      const response = await axios.post('/api/admin/student/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data.error) {
        toast.error(response.data.error);
        console.log('Error:', response.data.error);
      } else {
        toast.success(response.data.message);
        setStudentData({
          profilePicture: { file: null, url: null },
          name: '',
          gender: '',
          dateOfBirth: '',
          studentID: '',
          email: '',
          password: '',
          phoneNumber: '',
          department: '',
          faculty: '',
          program: '',
          level: '',
          yearOfEnrollment: '',
          yearOfCompletion: '',
          fingerprintImg: null,
          fingerprintID: null,
          showPassword: false,
        });
        setActiveStep(0)
      }
      
    } catch (error) {
      console.error('Error during submission:', error);
      toast.error(error.response?.data?.error || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };
  
    

  const handleNext = () => {
    // Step 0 validation
    if (activeStep === 0) {
      if (!studentData.profilePicture) {
        toast.error("Please upload a profile picture");
        return; // Prevent advancing to the next step
      }
  
      if (!studentData.name) {
        toast.error("Please enter your name");
        return;
      }

      if (!nameRegex.test(studentData.name)){
        toast.error("Please enter a valid name format");
        return;
      }
  
      if (!studentData.gender) {
        toast.error("Please select your gender");
        return;
      }
  
      if (!studentData.dateOfBirth) {
        toast.error("Please enter your date of birth");
        return;
      }
  
     
      if (!studentData.email) {
        toast.error("Please enter your email address");
        return;
      }
  
      if (!studentData.password) {
        toast.error("Please enter a password");
        return;
      }
  
      if (!studentData.phoneNumber) {
        toast.error("Please enter your phone number");
        return;
      }
    }
  
    // Step 1 validation
    if (activeStep === 1) {

      if (!studentData.studentID) {
        toast.error("Please enter your student ID");
        return;
      }

      if(studentData.studentID.length !== 9 && !studentData.studentID.endsWith('D')){
        toast.error("Please enter a valid student ID");
        return;
      }

      if (!studentData.department) {
        toast.error("Please enter your department");
        return;
      }

  
      if (!studentData.faculty) {
        toast.error("Please enter your faculty");
        return;
      }
  
      if (!studentData.program) {
        toast.error("Please enter your program");
        return;
      }
  
      if (!studentData.level) {
        toast.error("Please enter your level");
        return;
      }
  
      if (!studentData.yearOfEnrollment) {
        toast.error("Please enter your year of enrollment");
        return;
      }
  
      if (!studentData.yearOfCompletion) {
        toast.error("Please enter your year of completion");
        return;
      }
    }
  
    // Step 2 validation
    if (activeStep === 2) {
      if (!studentData.fingerprintID) {
        setDisableRegister(true)
        toast.error("Please scan fingerprint");
        return;
      }
    }
  
    // Move to the next step
    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  
    // Call handleSubmit if on the final step
    if (activeStep === steps.length - 1) {
      handleSubmit();
    }
  };
  

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <div 
              style={{ display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '2rem',
                flexWrap: 'wrap',
                marginTop: '1rem'
              }}
            >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    height: isMobile ? '100px': '150px',
                    width: isMobile ? '100px': '150px',
                    borderRadius: '25%',
                    border: 'thin solid #fff',
                    position: 'relative'
                  }}
                >
                  {studentData.profilePicture.url ? (
                    <img
                    style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center'}}
                      src={studentData.profilePicture.url}
                      alt="Profile Preview"
                    />
                    ) : (
                    <Typography variant="body2" color="white" sx={{textAlign: 'center'}}>
                        No Image Selected
                    </Typography>
                  )}
                </div>
                <Button
                    variant="contained"
                    component="label"
                    sx={{ color: 'white', backgroundColor: buttonsBgColor, width: '300px'}}
                >
                    Upload Profile Picture
                    <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleProfilePictureChange}
                    />
                </Button>

              </div>
              
           
              <div 
                style={{
                  display: 'flex',
                  gap: '2rem',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginTop: '20px'
              
                }}
              >
                  <TextField
                    variant="standard"
                    label="Name"
                    name="name"
                    value={studentData.name}
                    onChange={handleChange}
                    sx={{ input: 
                      { color: 'white', 
                        width: isMobile ? 300 : 350
                      }, label: { color: 'white' } 
                    }}
                  />
    
              
                  <FormControl 
                    variant="standard" 
                    sx={{ 
                      width: isMobile ? '300px' : '150px', 
                      label: { color: 'white' } 
                    }}
                  >
                    <InputLabel sx={{ color: 'white' }}>Gender</InputLabel>
                    <Select
                      variant="standard"
                      name="gender"
                      value={studentData.gender}
                      onChange={handleChange}
                      sx={{ color: 'white' }}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>

              
                  <TextField
                    variant="standard"
                    label="Date of Birth"
                    name="dateOfBirth"
                    type= { dateType ? "text" : "date"}
                    value={studentData.dateOfBirth}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true, 
                      style: { color: 'white' },
                      sx: {
                        icon: {
                          color: 'white',
                        }
                      },
                    }}
                    sx={{ input: { color: 'white', width: isMobile ? 300 : 350 }, label: { color: 'white' } }}
                  />

              
              
                  <TextField
                    variant="standard"
                    label="Email"
                    name="email"
                    type="email"
                    value={studentData.email}
                    onChange={handleChange}
                    sx={{ input: 
                      { color: 'white', 
                        width: isMobile ? 300 : 350
                      }, label: { color: 'white' } 
                    }}
                  />
            
                
                  <FormControl sx={{ color: '#fff', width: isMobile ? 300 : 350, position: 'relative' }}>
                    <TextField
                      id="password"
                      label="Password"
                      variant="standard"
                      name="password"
                      type={studentData.showPassword ? 'text' : 'password'}
                      value={studentData.password}
                      onChange={handleChange}
                      onFocus={handleFocus('password')}
                      onBlur={handleBlur('password')}
                      InputProps={{
                        style: { color: '#fff' }
                      }}
                      InputLabelProps={{
                        style: { color: '#fff' }
                      }}
                    />
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      style={{ color: '#fff', position: 'absolute', right: '10px', top: '5px' }}
                    >
                      {studentData.showPassword ? <GoEye style={{ top: '0px' }} /> : <GoEyeClosed />}
                    </IconButton>
                  </FormControl>
              
                
                  <TextField
                    variant="standard"
                    label="Phone Number"
                    name="phoneNumber"
                    value={studentData.phoneNumber}
                    onChange={handleChange}
                    
                    sx={{ input: 
                      { color: 'white', 
                        width: isMobile ? 300 : 350
                      }, label: { color: 'white' } 
                    }}
                  />
                </div>
             
              </>
            );
      case 1:
        return (
          <>
          <div 
            style={{
              display: 'flex',
              gap: '2rem',
              flexWrap: 'wrap',
              alignItems: 'center',
              marginTop: '20px'
          
            }}
          >

            <TextField
              variant="standard"
              label="Student ID"
              name="studentID"
              type='text'
              value={studentData.studentID}
              onChange={handleChange}
              sx={{ input: 
                { color: 'white', 
                  width: isMobile ? 300 : 200
                }, label: { color: 'white' } 
              }}
            />


            <FormControl variant="standard" sx={{ width: isMobile ? '300px' : '400px', label: { color: 'white' } }}>
            <InputLabel sx={{ color: 'white' }}>Faculty</InputLabel>
            <Select variant="standard" name="faculty" value={studentData.faculty} onChange={handleChange} sx={{ color: 'white' }}>
              {departments.map((dep) => (
                <MenuItem key={dep.id} value={dep.faculty}>{dep.faculty}</MenuItem>
              ))}
            </Select>
            </FormControl>

            <FormControl variant="standard" sx={{ width: isMobile ? '300px' : '400px', label: { color: 'white' } }}>
              <InputLabel sx={{ color: 'white' }}>Department</InputLabel>
              <Select variant="standard" name="department" value={studentData.department} onChange={handleChange} sx={{ color: 'white' }}>
                {departments.map((dep) => (
                  <MenuItem key={dep.id} value={dep.name}>{dep.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="standard" sx={{ width: isMobile ? '300px' : '400px', label: { color: 'white' } }}>
              <InputLabel sx={{ color: 'white' }}>Program</InputLabel>
              <Select variant="standard" name="program" value={studentData.program} onChange={(e) => setStudentData({ ...studentData, program: e.target.value })} sx={{ color: 'white' }}>
                {filteredPrograms.map((prog, index) => (
                  <MenuItem key={index} value={prog}>{prog}</MenuItem>
                ))}
              </Select>
            </FormControl>

            
            <FormControl
              variant="standard"
              sx={{
                 width: isMobile ? '300px': '250px',
                input: {
                  color: 'white',
                },
                label: { color: 'white' }
              }}
            >
              <InputLabel
                InputLabelProps={{
                  shrink: true, 
                  style: { color: 'white' },
                  sx: {
                    icon: {
                      color: 'white',
                    }
                  },
                }}
              >
                Level
              </InputLabel>
              <Select
                variant="standard"
                name="level"
                value={studentData.level} // Bind to studentData.level
                onChange={handleChange}
                sx={{ color: 'white' }}
              >
                <MenuItem value="L100">Level 100</MenuItem>
                <MenuItem value="L200">Level 200</MenuItem>
                <MenuItem value="L300">Level 300</MenuItem> {/* Changed value to L300 */}
                <MenuItem value="L400">Level 400</MenuItem> {/* Changed value to L400 */}
              </Select>
              </FormControl>

            
              
              <TextField
                variant="standard"
                label="Year of Enrollment"
                name="yearOfEnrollment"
                type='date'
                value={studentData.yearOfEnrollment}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true, 
                  style: { color: 'white' },
                  sx: {
                    icon: {
                      color: 'white',
                    }
                  },
                }}
                sx={{ input: { color: 'white', width: isMobile ? 300 : 350 }, label: { color: 'white' } }}
              />


              <TextField
                variant="standard"
                label="Year of Completion"
                name="yearOfCompletion"
                type='date'
                value={studentData.yearOfCompletion}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true, 
                  style: { color: 'white' },
                  sx: {
                    icon: {
                      color: 'white',
                    }
                  },
                }}
                sx={{ input: { color: 'white', width: isMobile ? 300 : 350 }, label: { color: 'white' } }}
              />

            </div>
          </>
        );
      case 2:
      return (
        <Grid container spacing={2}>
          <Grid item xs={12} >
            <Typography variant="h6" color="white">Fingerprint Registration</Typography>
            
            <div
              style = {{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2rem',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '90%',
                margin: 'auto'
              }}
            >
              {/* Display the scanned fingerprint image */}
              <div 
                style = {{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: isMobile ? 250 : 250,
                  height: 300,
                  position: 'relative',
                  borderRadius: '8px',
                  border: 'thin solid #fff'
                }}
              > 

                {studentData.fingerprintImg ? (
                  <img
                    src={studentData.fingerprintImg}
                    alt="Fingerprint Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                  />
                ) : (
                  <Typography variant="body2" color="white">
                    No Fingerprint Captured
                  </Typography>
                )}
              </div>

              
              
              <div style={{ width: isMobile ? '100%'  : '70%'}}>
                <div style={{ textAlign: 'center', padding: '1.5rem'}}>
                  <h3>Fingerprint Sensor Controller</h3>
                </div>

                <div style = {{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem'}}>
                  <Button variant="contained" 
                    sx={{ backgroundColor: buttonsBgColor, width: '25%' }} 
                    onClick={initiateDevice}
                    disabled={devLoading.init}
                  >
                    {devLoading.init ? (
                      "Connecting..."
                    ) : (
                      "Connect Device"
                    )}
                  </Button>

                  <Button variant="contained" 
                    sx={{ backgroundColor: buttonsBgColor, width: '25%' }} 
                    onClick={openDevice}
                    disabled={devLoading.open}
                  >
                    {devLoading.open? (
                      "Opening..."
                    ) : (
                      "Open"
                    )}
                  </Button>


                  <Button variant="contained" 
                    sx={{ backgroundColor: buttonsBgColor, width: '25%' }} 
                    onClick={captureFingerprint}
                    disabled={devLoading.captureFin}
                  >
                    {devLoading.captureFin ? (
                      "Capturing..."
                    ) : (
                      "Capture"
                    )}
                  </Button>

                  <Button variant="contained" 
                    sx={{ backgroundColor: buttonsBgColor, width: '25%' }} 
                    onClick={startEnrollment}
                    disabled={devLoading.enroll}
                  >
                    {devLoading.enroll ? (
                      "Starting..."
                    ) : (
                      "Start Enroll"
                    )}
                  </Button>
                  
                  <Button variant="contained" 
                    sx={{ backgroundColor: buttonsBgColor, width: '25%' }} 
                    onClick={completeEnroll}
                    disabled={devLoading.enrollComp}
                  >
                    {devLoading.enrollComp ? (
                      "Completing..."
                    ) : (
                      "Complete Enroll"
                    )}
                  </Button>

                  <Button variant="contained" 
                    sx={{ backgroundColor: buttonsBgColor, width: '25%' }} 
                    onClick={cancelEnrollment}
                    disabled={devLoading.cancel}
                  >
                    {devLoading.cancel ? (
                      "Enrolling..."
                    ) : (
                      "Cancel Enroll"
                    )}
                  </Button>

                  <Button variant="contained" 
                    sx={{ backgroundColor: buttonsBgColor, width: '25%' }} 
                    onClick={closeDevice}
                    disabled={devLoading.close}
                  >
                    {devLoading.close ? (
                      "Disconnecting..."
                    ) : (
                      "Disconnect"
                    )}
                  </Button>
                </div>

                 
                <Button variant="contained" 
                  sx={{ backgroundColor: isLoading ? '#f2f2f2': 'green', width: '50%', marginTop: '2rem' }} 
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularLoader  size={10}/>
                  ) : (
                    "Register Student"
                  )}
                </Button> 

              </div>
            </div>
           
          </Grid>
        </Grid>
      );

      default:
        return <Typography color="white">Unknown step</Typography>;
    }
  };

  return (
    <Box sx={{ bgcolor: HomeBgColor, padding: '20px', color: 'white', borderTopLeftRadius: '50px', width: '100%', }}>
      <Box sx={{ bgcolor: HomeBgColor, height: '100vh', borderTopLeftRadius: '50px', width: isMobile ? '90%' : '100%', margin: 'auto',}}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{margin: '20px' }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              sx={{ 
                color: 'white',
                '& .MuiStepLabel-label': { 
                  color: 'white' 
                }
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

        <div style={{overflowY: 'scroll', height: '90vh', paddingBottom: '100px'}}>
          {activeStep === steps.length ? (
            <div>
              <Typography sx={{ mt: 2, mb: 1 }} color="white">
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleReset} sx={{ color: 'white', width: 300, backgroundColor: buttonsBgColor }}>
                  Reset
                </Button>
              </Box>
            </div>
          ) : (
            <form encType='multipart/form-data'>
              {renderStepContent(activeStep)}
              <Box sx={{ display: 'flex', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1, color: 'white', width: 300, background: '#1C213E' }}
                >
                  Back
                </Button>
                <Box sx={{flex: 1, margin: 2}} />
                <Button onClick={handleNext} sx={{ color: 'white', backgroundColor: buttonsBgColor, width: 300 }}
                   disabled={activeStep === steps.length - 1 && isFinishDisabled}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Box>
            </form>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default CreateStudent;
