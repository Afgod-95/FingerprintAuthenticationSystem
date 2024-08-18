import * as React from 'react';
import { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, TextField, Grid, InputLabel, MenuItem, Select, FormControl } from '@mui/material';
import { HomeBgColor, bgColor, bookPlaceHolder, buttonsBgColor, userPlaceHolder } from '../constants/Colors';
import { wrap } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';

const steps = ['Personal Information', 'Academic Information', 'Fingerprint Registration'];

const CreateStudent = () => {

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1023px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
  const [activeStep, setActiveStep] = useState(0);
  const [studentData, setStudentData] = useState({
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
    fingerPrintData: false,
    fingerprint: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setStudentData({
      ...studentData,
      [name]: value,
    });
  };

  const handleProfilePictureChange = (event) => {
    setStudentData({
      ...studentData,
      profilePicture: URL.createObjectURL(event.target.files[0]),
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
      fingerPrintData: false,
      fingerprint: '',
    });
  };

  // Function to handle fingerprint scanning
  const handleFingerprintScan = async () => {
    // Call the fingerprint scanner SDK method to capture the fingerprint image
    const scannedFingerprint = await fingerprintScanner.capture();

    // Convert to base64 or handle as needed
    const fingerprintImage = URL.createObjectURL(scannedFingerprint);

    // Update the state with the scanned fingerprint image
    setStudentData({
      ...studentData,
      fingerprint,
    });
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
                    borderRadius: '50%',
                    border: 'thin solid #fff',
                    position: 'relative'
                  }}
                >
                  {studentData.profilePicture ? (
                    <img
                        src={studentData.profilePicture}
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
                    sx={{ color: 'white', backgroundColor: buttonsBgColor, width: '200px'}}
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
                    required
                    sx={{ input: 
                      { color: 'white', 
                        width: isMobile ? 300 : 500
                      }, label: { color: 'white' } 
                    }}
                  />
    
              
                  <FormControl   variant="standard" 
                    sx={{ input: 
                      { color: 'white', 
                        width: isMobile ? 300 : 500
                      }, label: { color: 'white' } 
                    }}
                  >
                    <InputLabel sx={{ input: 
                      { color: 'white', 
                        width: isMobile ? 300 : 500
                      }, label: { color: 'white' } 
                    }}>Gender</InputLabel>
                    <Select
                      variant="standard"
                      name="gender"
                      value={studentData.gender}
                      onChange={handleChange}
                      sx={{ input: 
                        { color: 'white', 
                          width: isMobile ? 300 : 500
                        }, label: { color: 'white' } 
                      }}
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
                    type="date"
                    value={studentData.dateOfBirth}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                      style: { color: 'white' },
                    }}
                    sx={{ input: 
                      { color: 'white', 
                        width: isMobile ? 300 : 500
                      }, label: { color: 'white' } 
                    }}
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
                        width: isMobile ? 300 : 500
                      }, label: { color: 'white' } 
                    }}
                  />
            
                
                  <TextField
                    variant="standard"
                    label="Password"
                    name="password"
                    type="password"
                    value={studentData.password}
                    onChange={handleChange}
                    required
                    sx={{ input: 
                      { color: 'white', 
                        width: isMobile ? 300 : 500
                      }, label: { color: 'white' } 
                    }}
                  />
              
                
                  <TextField
                    variant="standard"
                    label="Phone Number"
                    name="phoneNumber"
                    value={studentData.phoneNumber}
                    onChange={handleChange}
                    required
                    sx={{ input: 
                      { color: 'white', 
                        width: isMobile ? 300 : 500
                      }, label: { color: 'white' } 
                    }}
                  />
                </div>
             
              </>
            );
      case 1:
        return (
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
              label="Department"
              name="department"
              value={studentData.department}
              onChange={handleChange}
              required
              sx={{ input: 
                { color: 'white', 
                  width: isMobile ? 300 : 500
                }, label: { color: 'white' } 
              }}
            />

              
            <TextField
              variant="standard"
              label="Faculty"
              name="faculty"
              
              value={studentData.faculty}
              onChange={handleChange}
              sx={{ input: 
                { color: 'white', 
                  width: isMobile ? 300 : 500
                }, label: { color: 'white' } 
              }}
            />
        
            <TextField
              variant="standard"
              label="Program"
              name="program"
              type="text"
              value={studentData.program}
              onChange={handleChange}
              sx={{ input: 
                { color: 'white', 
                  width: isMobile ? 300 : 500
                }, label: { color: 'white' } 
              }}
            />
      
          
            <FormControl   variant="standard" 
              sx={{ input: 
                { color: 'white', 
                  width: isMobile ? 300 : 500
                }, label: { color: 'white' } 
              }}
            >
              <InputLabel sx={{ input: 
                { color: 'white', 
                  width: isMobile ? 300 : 500
                }, label: { color: 'white' } 
              }}>Level</InputLabel>
              <Select
                variant="standard"
                name="level"
                value={studentData.gender}
                onChange={handleChange}
                sx={{ input: 
                  { color: 'white', 
                    width: isMobile ? 300 : 500
                  }, label: { color: 'white' } 
                }}
              >
                <MenuItem value="L100">Level 100</MenuItem>
                <MenuItem value="L200">Level 200</MenuItem>
                <MenuItem value="Other">Level 300</MenuItem>
                <MenuItem value="Other">Level 400</MenuItem>
              </Select>
            </FormControl>
        
        
          
            <TextField
              variant="standard"
              label="Phone Number"
              name="phoneNumber"
              value={studentData.yearOfEnrollment}
              onChange={handleChange}
              required
              sx={{ input: 
                { color: 'white', 
                  width: isMobile ? 300 : 500
                }, label: { color: 'white' } 
              }}
            />
          </div>
        );
      case 2:
      return (
        <Grid container spacing={2} sx={{marginTop: 5}}>
          <Grid item xs={12} >
            <Typography variant="h6" color="white">Fingerprint Registration</Typography>
            
            {/* Display the scanned fingerprint image */}
            {studentData.fingerprint ? (
              <Box sx={{ textAlign: 'center', marginBottom: '20px', margin: '10px' }}>
                <img
                  src={studentData.fingerprint}
                  alt="Scanned Fingerprint"
                  style={{ maxWidth: '100%', height: 'auto',}}
                />
              </Box>
            ) : (
              <Typography variant="body2" color="white" align="center">
                No Fingerprint Scanned
              </Typography>
            )}

            {/* Trigger fingerprint scanning */}
            <Button
              variant="contained"
              sx={{ color: 'white', backgroundColor: buttonsBgColor, margin: '20px' }}
              onClick={handleFingerprintScan}
            >
              Scan Fingerprint
            </Button>
          </Grid>
        </Grid>
      );

      default:
        return <Typography color="white">Unknown step</Typography>;
    }
  };

  return (
    <Box sx={{ bgcolor: HomeBgColor, padding: '20px', color: 'white', borderTopLeftRadius: '50px', width: '100%', }}>
      <Box sx={{ bgcolor: HomeBgColor, padding: '20px', color: 'white', height: '100vh', borderTopLeftRadius: '50px', width: '100%', margin: 'auto',}}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
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
                <Button onClick={handleReset} sx={{ color: 'white', width: 200, backgroundColor: buttonsBgColor }}>
                  Reset
                </Button>
              </Box>
            </div>
          ) : (
            <div>
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
                <Button onClick={handleNext} sx={{ color: 'white', backgroundColor: buttonsBgColor, width: 300 }}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Box>
            </div>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default CreateStudent;
