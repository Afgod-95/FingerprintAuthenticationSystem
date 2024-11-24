import React, { useState, useEffect } from "react";
import { FormControl, Button, Avatar, Box, TextField } from '@mui/material';
import { motion } from "framer-motion";
import { bgColor, buttonsBgColor } from "../constants/Colors";
import { useMediaQuery } from 'react-responsive';
import { useSelector, useDispatch } from "react-redux";
import CircularLoader from "./Loaders";
import { updateAdminProfile } from "../redux/reducers";
import { Buffer } from "buffer";
import { toast } from 'react-hot-toast'

const EditAdminModal = ({ onClose }) => {
  const { adminInfo, loading } = useSelector(state => state.admin);
  const dispatch = useDispatch();

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1023px)' });

  const [values, setValues] = useState({
    image: `data:${adminInfo.image.contentType};base64,${Buffer.from(adminInfo.image.data).toString('base64')}` || '',
    name: adminInfo?.name || '',
    email: adminInfo?.email || '',
  });


  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
 
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size exceeds 2MB. Please upload a smaller image.");
        return;
      }
  
      const reader = new FileReader();
  
      reader.onloadend = () => {
        setValues(prevValues => ({
          ...prevValues,
          image: reader.result // This should be a Data URL
        }));
      };
  
      reader.onerror = (error) => {
        console.error("Error reading file", error);
        toast.error("Error reading file.");
      };
  
      reader.readAsDataURL(file);
    } else {
      toast.error("No file selected.");
    }
  };
  
  
  

  const handleAdminUpdate = () => {
    console.log('Submitting with image:', values.image); // Add this line
    dispatch(updateAdminProfile({
      adminID: adminInfo._id,
      image: values.image,
      name: values.name,
      email: values.email,
    }));
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
          <h3 style={{alignSelf: 'center', paddingTop: '20px'}}>Update Profile</h3>
          
          <div style={{display: 'flex', justifyContent: 'center', gap: '1rem'}}>
            <Avatar
              src={values.image}
              alt={adminInfo.name}
              sx={{ width: 70, height: 70, alignSelf: 'center' }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
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

          <Box mt={2} textAlign="center">
            <Button variant="contained" 
              sx={{ backgroundColor: buttonsBgColor, width: '50%' }} 
              onClick={handleAdminUpdate}
              disabled={loading}
            >
              {loading ? (
                <CircularLoader size={10}/>
              ) : (
                "Submit"
              )}
            </Button>
          </Box>
        </div>
      </motion.div>
    </div>
  );
};

export default EditAdminModal;
