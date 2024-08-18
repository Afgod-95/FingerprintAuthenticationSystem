import React, { useState } from "react";
import { Button, Box, TextField, FormControl, IconButton } from '@mui/material';
import { motion } from "framer-motion";
import { buttonsBgColor, bgColor } from "../../constants/Colors";
import { GoEyeClosed, GoEye } from "react-icons/go"; // Add these if you plan to use them for password visibility

const AdminForgotPassword = ({ onClose }) => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    showPassword: false,
  });

  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!emailSubmitted) {
      // Submit email for authentication
      console.log('Email submitted:', values.email);
      // After successful email submission
      setEmailSubmitted(true);
    } else {
      // Submit new password
      console.log('New password submitted:', values.password);
      // Handle password submission here
      onClose();
    }
  };

  return (
    <motion.div style={{ width: '90%', margin: 'auto' }}>
      <div style={{ display: "flex", flexDirection: 'column', gap: "1.3rem", justifyContent: 'center' }}>
        <h3 style={{ alignSelf: 'center', paddingTop: '20px' }}>
          {emailSubmitted ? 'Reset Password' : 'Forgot Password'}
        </h3>

        {!emailSubmitted ? (
          <TextField
            id="email"
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
            sx={{
              marginBottom: '1rem',
              borderBottom: 'thin solid #acadac',
            }}
          />
        ) : (
          <FormControl sx={{ color: '#fff', width: '100%' }}>
            <TextField
              id="password"
              label="New Password"
              variant="standard"
              type={values.showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={handleChange('password')}
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
              {values.showPassword ? <GoEye /> : <GoEyeClosed />}
            </IconButton>
          </FormControl>
        )}

        <Box mt={2} textAlign="center">
          <Button variant="contained" sx={{ backgroundColor: buttonsBgColor, width: '70%' }} onClick={handleSubmit}>
            {emailSubmitted ? 'Reset Password' : 'Submit'}
          </Button>
        </Box>
      </div>
    </motion.div>
  );
};

export default AdminForgotPassword;
