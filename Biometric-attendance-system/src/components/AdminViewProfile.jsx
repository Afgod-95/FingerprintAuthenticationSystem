import React, { useState } from "react";
import { FormControl, Button, Avatar, Box, TextField, IconButton, InputAdornment } from '@mui/material';
import { motion } from "framer-motion";
import { bgColor, buttonsBgColor } from "../constants/Colors";
import { GoEyeClosed, GoEye } from "react-icons/go";
import { useMediaQuery } from 'react-responsive';
import axios from "axios";
import { toast } from 'react-hot-toast'

const AdminViewProfile = ({ onClose, admin }) => {
  const [values, setValues] = useState({
    profilePicture: '',
    name: '',
    email: '',
    password: '',
    showPassword: false,
  });

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1023px)' });

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

  useEffect(() => {
      if (admin){
        setValues({
          profilePicture: admin.profilePicture || '' ,
          name: admin.name || '',
          email: admin.email || '',
          password: admin.password || '',
        })
      }
  }, [admin])

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      const { profilePicture, name, email, password } = values
      const formData = new FormData()
      formData.append('image', profilePicture)
      formData.append('name', name)
      formData.append('image', email)
      formData.append('image', password)

      const headers = {
        headers: {
          Accept: 'application/json',
         'Content-Type': 'multipart/form-data'
        }
      }

      const response = await axios.post('/api/admin-update', formData, headers)
      if(response.data.error){
        toast.error(response.data.error)
      }
      else {
        toast.success(response.data.message)
        onClose()
      }
    }
    catch(error){

    }
    
  };

  

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
          justifyContent: "flex-start",
          display: "flex",
          flexDirection: "column",
          flexWrap: 'wrap',
          gap: "10px",
          padding: '20px',
          width: isMobile ? '80%' : isTablet ? '60%' : '30%', 
          backgroundColor: bgColor,
          borderRadius: "10px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", flexDirection: 'column', gap: "1.3rem", justifyContent: 'center' }}>
          <h3 style={{alignSelf: 'center', paddingTop: '20px'}}>Add User</h3>
          
          <div style={{display: 'flex', justifyContent: 'center', gap: '1rem'}}>
            <Avatar
              alt="Profile Picture"
              src={values.profilePicture}
              sx={{ width: 70, height: 70, alignSelf: 'center' }}
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
                Upload Profile Picture
              </Button>
            </label>

          </div>

          <TextField
            id="standard-basic" 
            label="Name" 
            variant="standard"
            value={values.name}
            onChange={handleChange('name')}
            InputLabelProps={{
              style: { color: '#fff' },
            }}
            sx={{color: '#fff'}}
          />

          <TextField
            id="standard-basic" 
            label="Email" 
            variant="standard" 
            type="email"
            value={values.email}
            onChange={handleChange('email')}
            InputLabelProps={{
              style: { color: '#fff' }
            }}
            sx={{color: '#fff'}}
          />

          <FormControl sx={{color: '#fff', widows: '100%'}}>
            <TextField
              id="password"
              label="Password"
              variant="standard"
              type={values.showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={handleChange('password')}
              InputLabelProps={{
                style: { color: '#fff' },
              }}
            />
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              style={{ color: '#fff', position: 'absolute', right: '10px' }}
            >
              {!values.showPassword ? <GoEyeClosed /> : <GoEye />}
            </IconButton>
          </FormControl>


          <Box mt={2} textAlign="center">
            <Button variant="contained" sx={{ backgroundColor: buttonsBgColor, width: '50%' }} onClick={handleSubmit}>
              Update Profile
            </Button>
          </Box>
        
        </div>
        
      </motion.div>
    </div>
  );
};

export default AdminViewProfile;
