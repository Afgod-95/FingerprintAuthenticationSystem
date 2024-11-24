import React, { useState, useEffect } from "react";
import { FormControl, Button, Avatar, Box, TextField, IconButton } from '@mui/material';
import { motion } from "framer-motion";
import { GoEyeClosed, GoEye } from "react-icons/go";
import { bgColor, buttonsBgColor } from "../../constants/Colors";
import { useMediaQuery } from 'react-responsive';
import CircularLoader from "../../components/Loaders";
import toast from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { nameRegex } from "../../constants/Validators";

const AdminRegister = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1023px)' });

  const [values, setValues] = useState({
    image: '',
    name: '',
    email: '',
    password: '',
    showPassword: false,
  });

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });


  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log(file)
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValues({ ...values, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async () => {
    try{
        setLoading(true)
        
        if (!nameRegex.test(values.name)){
          toast.error("Please enter a valid name");
          return;
        }
        const formData = new FormData()
        formData.append('image', values.image)
        formData.append('name', values.name)
        formData.append('email', values.email)
        formData.append('password', values.password)
        const response = await axios.post('/api/admin/register', formData)
        
        if(response.data.error){
            toast.error(response.data.error)
        }
        
        else {
            toast.success(response.data.message)
            setTimeout(() => {
                window.location.href = '/admin/login'
            }, 2000)
        }
    }
    catch(error){
        console.log(error.message)
        toast.error(error.message)
    }
    finally {
        setLoading(false)
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
          <h3 style={{alignSelf: 'center', paddingTop: '20px'}}>Admin Registration</h3>
          
          <div style={{display: 'flex', justifyContent: 'center', gap: '1rem'}}>
            <Avatar
              src={values.image}
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
              <Button variant="contained" component="span" 
                sx={{ backgroundColor: buttonsBgColor }}
              >
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
            InputProps={{
              style: { color: '#fff' }
            }}
            InputLabelProps={{
              style: { color: '#fff' }
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
            InputProps={{
              style: { color: '#fff' }
            }}
            InputLabelProps={{
              style: { color: '#fff' }
            }}
            sx={{color: '#fff'}}
          />


            <FormControl sx={{ color: '#fff', width: '100%', position: 'relative' }}>
            <TextField
              id="password"
              label="Password"
              variant="standard"
              type={values.showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={handleChange('password')}
              onFocus={handleFocus('password')}
              onBlur={handleBlur('password')}
              InputProps={{
                style: { color: '#fff' }
              }}
              InputLabelProps={{
                style: { color: '#fff' }
              }}
              sx={{
                marginBottom: '1rem',
                borderBottom: 'thin solid #acadac',
              }}
            />
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              style={{ color: '#fff', position: 'absolute', right: '10px', top: '5px' }}
            >
              {values.showPassword ? <GoEye style={{ top: '0px' }} /> : <GoEyeClosed />}
            </IconButton>
          </FormControl>


          <Box mt={2} textAlign="center">
            <Button variant="contained" 
              sx={{ backgroundColor: buttonsBgColor, width: '50%' }} 
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <CircularLoader size={10}/>
              ) : (
                "Register"
              )}
            </Button>
          </Box>
            <p style={{ color: '#fff', fontSize: '12px', textAlign: 'center'}}>
                Already have an account? <Link to="/admin/login" style={{ color: '#fff', textDecoration: 'underline' }}>Click here </Link>
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminRegister;
