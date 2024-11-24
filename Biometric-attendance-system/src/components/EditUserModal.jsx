import React, { useEffect, useState } from "react";
import { 
  FormControl, 
  Button, Avatar, Select, Box,
  MenuItem,

  
  TextField, IconButton, InputLabel 

} from '@mui/material';
import { motion } from "framer-motion";
import { bgColor, buttonsBgColor } from "../constants/Colors";
import { useMediaQuery } from 'react-responsive';
import { GoEyeClosed, GoEye } from "react-icons/go";
import { FaRegArrowAltCircleUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { updateStudentBy_ID } from "../redux/reducers";
import CircularLoader from "./Loaders";
import { Buffer } from "buffer";

const EditUserModal = ({ onClose, user }) => {
  const [values, setValues] = useState({
    profilePicture: '',
    name: '',
    gender: '',
    dateOfBirth: '',
    studentID: '',
    email: '',
    password: '',
    showPassword: false,
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

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1023px)' });


  // date and time function
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    // Get the weekday and formatted date
    const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('en-US', optionsDate).format(date);
    return formattedDate;
  };
 

  useEffect(() => {
    //fecthign user when its selected by admin
    if (user) {
      setValues({
        profilePicture: `data:${user.image.contentType};base64,${Buffer.from(user.image.data).toString('base64')}` || '',
        name: user.name || '',
        gender: user.gender || '',
        dateOfBirth: formatDate(user.dateOfBirth) || '',
        studentID: user.studentID || '',
        email: user.email || '',
        password: user.password || '',
        showPassword: false,
        phoneNumber: user.phoneNumber || '',
        department: user.department || '',
        faculty: user.faculty || '',
        program: user.program || '',
        level: user.level || '',
        yearOfEnrollment: formatDate(user.yearOfEnrollment) || '',
        yearOfCompletion: formatDate(user.yearOfCompletion) || '',
        fingerPrintData: false,
      });
    }
  }, [user]);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValues({ ...values, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

 
  const [scrollVisible, setScrollVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 5) {
      setScrollVisible(true);
    } else {
      setScrollVisible(false);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', 
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);


  const dispatch = useDispatch()
  const { loading} = useSelector(state => state.admin)
 

  //student update submission
  const handleDataSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('image', values.profilePicture);
      formData.append('name', values.name);
      formData.append('gender', values.gender);
      formData.append('dateOfBirth', values.dateOfBirth);
      formData.append('studentID', values.studentID);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('phoneNumber', values.phoneNumber);
      formData.append('department', values.department);
      formData.append('faculty', values.faculty);
      formData.append('program', values.program);
      formData.append('level', values.level);
      formData.append('yearOfEnrollment', values.yearOfEnrollment);
      formData.append('yearOfCompletion', values.yearOfCompletion);
  
      // Dispatch the action to update student
      await dispatch(updateStudentBy_ID({ 
        studentID: user._id, 
        studentData: formData
      })).unwrap()
      .then(() => {
        setTimeout(() => {
          onClose() // close modal if update is successful
        }, 2000)
      });
    } catch (err) {
      // Notify error
      console.error('Update failed:', err);
    }
  }
  


  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
        <motion.div
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: "0%" }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ type: "spring", stiffness: 100 }}
          style={{
            maxHeight: '80vh',
            padding: '20px',
            width: isMobile ? '90%' : '50%', 
            margin: '0% auto',
            backgroundColor: bgColor,
            borderRadius: "10px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
        
            <h3 style={{alignSelf: 'center', padding: '20px'}}>Edit Student</h3>
          
          <div className="form-scroll"
            style={{
              display: "flex",
              flexWrap: 'wrap',
              gap: "10px",
              overflowY: 'scroll',  
              height: '50vh',
              width: '90%', 
              margin: 'auto',
              WebkitOverflowScrolling: 'touch', 
            }}
            
          >
            <div style={{ display: "flex", flexDirection: 'row', flexWrap: 'wrap', gap: "2rem", }}>
            <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', width: '100%', marginTop: '25px'}}>
              <Avatar
                alt="Profile Picture"
                src={values.profilePicture}
                sx={{ width: 100, height: 100, alignSelf: 'center' }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }} 
                id="profile-picture-input"
              />
              <label htmlFor="profile-picture-input" style={{ alignSelf: 'center' }}>
                <Button variant="contained" component="span" sx={{ backgroundColor: buttonsBgColor }}>
                  Edit Profile Picture
                </Button>
              </label>
            </div>

            <div>
              <TextField
                id="name"
                label="Name"
                variant="standard"
                value={values.name}
                onChange={handleChange('name')}
                InputLabelProps={{
                  style: { color: '#fff' },
                }}
                sx={{color: '#fff', width: '250px'}}
              />
            </div>
            
           
              <select name="gender" id="" value={values.gender}
                style={{ width: isMobile ? '100px' : '250px', color: '#fff',
                  outline: 'none', borderRadius: '10px', background: 'transparent'
                }}
                onChange={handleChange('gender')}
              >
                <option value="selectGender" style={{color: '#000'}}>Select Gender</option>
                <option value="male" style={{color: '#000'}}>Male</option>
                <option value="female" style={{color: '#000'}}>Female</option>
                <option value="female" style={{color: '#000'}}>Female</option>
                <option value="other" >Other</option>
              </select>
            
             
            
            <div>
              <TextField
                id="dateOfBirth"
                label="Date of Birth"
                variant="standard"
                type= {user ? 'text' : 'date'}
                value={values.dateOfBirth}
                onChange={handleChange('dateOfBirth')}
                InputLabelProps={{
                  style: { color: '#fff' },
                }}
                sx={{color: '#fff', width: '250px'}}
              />
            </div>
            
            <div>
              <TextField
                id="studentID"
                label="Student ID"
                variant="standard"
                type="text"
                value={values.studentID}
                onChange={handleChange('studentID')}
                InputLabelProps={{
                  style: { color: '#fff' },
                }}
                sx={{color: '#fff', width: '250px'}}
              />
            </div>
            
            <div>
              <TextField
                id="email"
                label="Email"
                variant="standard"
                type="email"
                value={values.email}
                onChange={handleChange('email')}
                InputLabelProps={{
                  style: { color: '#fff' },
                }}
                sx={{color: '#fff', width: '250px'}}
              />
            </div>
            
            <div>
              <FormControl sx={{color: '#fff', widows: '100%'}}>
                <TextField
                  id="password"
                  label="Password"
                  variant="standard"
                  type={values.showPassword ? 'password' : 'text'}
                  value={values.password}
                  onChange={handleChange('password')}
                  InputLabelProps={{
                    style: { color: '#fff' },
                  }}

                  sx={{color: '#fff', width: '250px'}}
                />
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  style={{ color: '#fff', position: 'absolute', right: '10px', bottom: '-5px' }}
                >
                  {values.showPassword ? <GoEyeClosed /> : <GoEye />}
                </IconButton>
              </FormControl>

            </div>
            
            <div>
              <TextField
                id="phoneNumber"
                label="Phone Number"
                variant="standard"
                type="tel"
                value={values.phoneNumber}
                onChange={handleChange('phoneNumber')}
                InputLabelProps={{
                  style: { color: '#fff' },
                }}
                sx={{color: '#fff', width: '250px'}}
              />
            </div>
          
            <div>
              <TextField
                id="department"
                label="Department"
                variant="standard"
                type="text"
                value={values.department}
                onChange={handleChange('department')}
                InputLabelProps={{
                  style: { color: '#fff' },
                }}
                sx={{color: '#fff', width: '250px'}}
              />
            </div>
            
            <div>
              <TextField
                id="faculty"
                label="Faculty"
                variant="standard"
                type="text"
                value={values.faculty}
                onChange={handleChange('faculty')}
                InputLabelProps={{
                  style: { color: '#fff' },
                }}
                sx={{color: '#fff', width: '250px'}}
              />
            </div>
              
            <div>
              <TextField
                id="program"
                label="Program"
                variant="standard"
                type="text"
                value={values.program}
                onChange={handleChange('program')}
                InputLabelProps={{
                  style: { color: '#fff' },
                }}
                sx={{color: '#fff', width: '250px'}}
              />
            </div>
              
            <div>
              <TextField
                id="level"
                label="Level"
                variant="standard"
                type="text"
                value={values.level}
                onChange={handleChange('level')}
                InputLabelProps={{
                  style: { color: '#fff' },
                }} 
                sx={{color: '#fff', width: '250px'}}
              />

            </div>
          
              <div>
                <TextField
                  id="yearOfEnrollment"
                  label="Year of Enrollment"
                  variant="standard"
                  type={user ? 'text' : 'date'}
                  value={values.yearOfEnrollment}
                  onChange={handleChange('yearOfEnrollment')}
                  InputLabelProps={{
                    style: { color: '#fff' },
                  }}
                  sx={{color: '#fff', width: '250px'}}
                />

              </div>
              
              <div>
                <TextField
                  id="yearOfCompletion"
                  label="Year of Completion"
                  variant="standard"
                  type={user ? 'text' : 'date'}
                  value={values.yearOfCompletion}
                  onChange={handleChange('yearOfCompletion')}
                  InputLabelProps={{
                    style: { color: '#fff' },
                  }}
                  sx={{color: '#fff', width: '250px'}}
                />
              </div>
          </div>
                
          {scrollVisible && (
              <motion.div className="scroll-to-top"
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: "0%" }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ type: "spring", stiffness: 100 }}
                onClick={() => scrollToTop()}
                style={{
                  position: 'absolute',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bottom: 15,
                  right: 18,
                  zIndex: 1000,
                  backgroundColor: '#fff',
                  color: '#000',
                  borderRadius: '50%',
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  width: '50px',
                  height: '50px',
                  cursor: 'pointer'
                }}
            >
  
              <FaRegArrowAltCircleUp style = {{fontSize: '2rem'}} />
            </motion.div>
  
          )}
          
        </div>
        
       
        <Box mt={2} textAlign="center" sx={{ display: 'flex', justifyContent: 'center', gap: '2rem'}}>
          <Button variant="contained" sx={{ backgroundColor: 'red', flex: 1}} onClick={() => onClose()}>
            Close
          </Button>

          <Button variant="contained" sx={{ backgroundColor: buttonsBgColor, flex: 1}} onClick={() => handleDataSubmit()} disabled = {loading}>
            {loading ? <CircularLoader size={10}/> : "Submit"}
          </Button>
        </Box>
      </motion.div>
    </div>
  );
};

export default EditUserModal;







