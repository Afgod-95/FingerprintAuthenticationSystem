import React, { useState } from "react";
import { Button, Box, TextField, FormControl, IconButton } from '@mui/material';
import { motion } from "framer-motion";
import { buttonsBgColor, bgColor } from "../../constants/Colors";
import { GoEyeClosed, GoEye } from "react-icons/go"; // Add these if you plan to use them for password visibility
import axios from 'axios'
import { toast } from 'react-hot-toast'
import CircularLoader from "../../components/Loaders";

const AdminForgotPassword = ({ onClose }) => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    showPassword: false,
  });

  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [loading, setLoading] = useState(false)

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      setLoading(true)
      if (!emailSubmitted) {
        const response = await axios.post('/api/admin/forgot-password', {
          email: values.email
        }) 
        if (response.status === 200) {
          setTimeout(() => {
            setEmailSubmitted(true)
          }, 2000)
          toast.success(response.data.message)
          
        }
        else {
          toast.error(response.data.message)
        }
      } 
      
      else {
        const response = await axios.patch('/api/admin/reset-password',{
          email: values.email,
          newPassword: values.password
        });
        if (response.status === 200) {
          toast.success(response.data.message)
          setTimeout(() => {
            onClose()
          }, 2000)
          
        } 
      }
    }
    catch (error){
      console.log(error.message)
      toast.error(error.message)
    }
    finally{
      setLoading(false)
    }
  };
  

  return (
    <motion.div style={{ width: '90%', margin: 'auto' }}>
      <div style={{ display: "flex", flexDirection: 'column', gap: "1.3rem", justifyContent: 'center' }}>
        
        <div style={{alignSelf: 'center'}}>
          <h3 style={{ alignSelf: 'center', paddingTop: '20px' }}>
            {emailSubmitted ? 'Reset Password' : 'Forgot Password'}
          </h3>

          <p style={{ alignSelf: 'center', paddingTop: '10px', color: '#f2f2f2' }}>
            {!emailSubmitted ? 'Please enter the email used registration' : 'Updated Password will be used for your next login'}
          </p>
        </div>
        

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
          <Button variant="contained" sx={{ backgroundColor: loading ? '#acadac' : buttonsBgColor, width: '70%' }} 
            onClick={handleSubmit} disabled = {loading}
          >
            { loading ? (
              <CircularLoader size={10} />
            ) : emailSubmitted ? 'Reset Password' : 'Submit'}
          </Button>
        </Box>
      </div>
    </motion.div>
  );
};

export default AdminForgotPassword;
