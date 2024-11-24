import React, { useState, useEffect } from "react";
import { FormControl, Button, Box, TextField, IconButton } from '@mui/material';
import { motion } from "framer-motion";
import { buttonsBgColor, bgColor } from "../../constants/Colors";
import { GoEyeClosed, GoEye } from "react-icons/go";
import BottomSheet from "../../components/BottomSheet";
import AdminForgotPassword from "./AdminForgotPassword";
import { useNavigate, Link } from "react-router-dom";
import CircularLoader from "../../components/Loaders";
import { useMediaQuery } from 'react-responsive';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin, refreshAccessToken, resetState, updateTokens } from "../../redux/reducers";


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

 
  const { loading, isAuthenticated } = useSelector(state => state.admin)
  const dispatch = useDispatch();

  
  useEffect(() => {
    dispatch(resetState())
  }, [dispatch])

  useEffect(() => {
    if(isAuthenticated){
      navigate('/admin/dashboard')
    }
  }, [isAuthenticated])


  console.log(`Auth: ${isAuthenticated}`)
  
  const adminLogin = async (e) => {
    e.preventDefault()
   
    const credentials = {
      email: values.email,
      password: values.password
    }

    dispatch(loginAdmin(credentials))
    .unwrap()
    .then(() => {
      navigate('/admin/dashboard');
    })
    .catch((error) => {
        console.error('Failed to login:', error);
    });
   
  }


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
          onClick={() => navigate('/')}
          style={{ color: '#acadac', alignItems: 'center', display: 'flex', gap: '1rem', cursor: 'pointer' }}
        >
        <IoIosArrowRoundBack style={{ fontSize: '1.5rem' }} />
          <h4>Back</h4>
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
              sx={{ backgroundColor: loading ? '#acadac' : buttonsBgColor, width: '70%', height: '50px' }}
              disabled={loading}
              onClick={adminLogin}
            >
              {loading ? <CircularLoader size={10} /> : 'Login'}
            </Button>
          </Box>
          <p style={{ color: '#fff', fontSize: '12px', textAlign: 'center'}}>
           Don't have an account? <Link to="/admin/register" style={{ color: '#fff', textDecoration: 'underline' }}>Click here </Link>
          </p>
        </div>
      </motion.div>

      {showForgotPasswordModal &&
        <BottomSheet
          onClose={() => setShowForgotPasswordModal(false)}
          isOpen={showForgotPasswordModal}
        >
          <AdminForgotPassword onClose = {() => setShowForgotPasswordModal(false)}/>
        </BottomSheet>
      }
    </div>
  );
};

export default AdminLogin;
