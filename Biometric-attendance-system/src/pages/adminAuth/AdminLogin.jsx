import React, { useState } from "react";
import { FormControl, Button, Box, TextField, IconButton } from '@mui/material';
import { motion } from "framer-motion";
import { buttonsBgColor, bgColor } from "../../constants/Colors";
import { GoEyeClosed, GoEye } from "react-icons/go";
import BottomSheet from "../../components/BottomSheet";
import AdminForgotPassword from "./AdminForgotPassword";
import { useNavigate } from "react-router-dom";
import CircularLoader from "../../components/Loaders";
import { useMediaQuery } from 'react-responsive';
import { IoIosArrowRoundBack } from "react-icons/io";
import { ErrorMessages, SuccessMessages } from "../../components/Messages.jsx";
import axios from "axios";

const AdminLogin = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    showPassword: false,
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });

  const navigate = useNavigate();
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
 
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

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1023px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
 
  const adminLogin = async () => {
    try {
      const { email, password } = values;
      if (!emailRegex.test(email)) {
        return setErrorMessage('Oops! Please enter a valid email');
      }

      setIsLoading(true);
     
      const response = await axios.post('http://localhost:5031/api/admin/login', {
        email: email,
        password: password
      }); 

      if (response.status !== 200) {
        setErrorMessage(response.data.message || 'Login failed');
        setErrorVisible(true);
      } else {
        setSuccessMessage(response.data.message);
        setSuccessVisible(true);
        navigate('/admin-login/dashboard');
      }
    } catch (error) {
      console.log(`Error: ${error.message}`);
      if (error.response) {
        setErrorMessage(error.response.data.error || 'An error occurred');
      } else if (error.request) {
        setErrorMessage('Network error');
      } else {
        setErrorMessage(error.message);
      }
      setErrorVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: 'wrap'
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
          flexWrap: 'wrap',
          gap: "10px",
          padding: '20px',
          width: isMobile ? '80%' : isTablet ? '60%' : '30%', 
          backgroundColor: bgColor,
          borderRadius: "10px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div 
          onClick={() => window.history.back()}
          style={{ color: '#acadac', alignItems: 'center', display: 'flex', gap: '1rem', cursor: 'pointer' }}
        >
          <IoIosArrowRoundBack style={{ fontSize: '1.5rem' }} />
          <h4>Go back</h4>
        </div>

        <div style={{ display: "flex", flexDirection: 'column', gap: "1.3rem", justifyContent: 'center' }}>
          <h3 style={{ alignSelf: 'center', paddingTop: '20px' }}>Admin Login</h3>

          <TextField
            id="email"
            label="Email"
            variant="standard"
            type="email"
            value={values.email}
            onChange={handleChange('email')}
            onFocus={handleFocus('email')}
            onBlur={handleBlur('email')}
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

          <div style={{ cursor: 'pointer', color: '#fff' }} onClick={() => setShowForgotPasswordModal(true)}>
            <p style={{ color: '#fff', textAlign: 'right' }}>Forgot Password?</p>
          </div>

          <Box mt={2} textAlign="center">
            <Button
              variant="contained"
              sx={{ backgroundColor: isLoading ? '#acadac' : buttonsBgColor, width: '70%', height: '50px' }}
              disabled={isLoading}
              onClick={adminLogin}
            >
              {isLoading ? <CircularLoader size={10} /> : 'Login'}
            </Button>
          </Box>
        </div>
      </motion.div>

      {showForgotPasswordModal &&
        <BottomSheet
          onClose={() => setShowForgotPasswordModal(false)}
          isOpen={showForgotPasswordModal}
        >
          <AdminForgotPassword />
        </BottomSheet>
      }

      <ErrorMessages 
        errorMessage={errorMessage}
        visible={errorVisible}
        onClose={() => setErrorVisible(false)}
      />
      <SuccessMessages 
        successMessage={successMessage}
        visible={successVisible}
        onClose={() => setSuccessVisible(false)}
      />
    </div>
  );
};

export default AdminLogin;
