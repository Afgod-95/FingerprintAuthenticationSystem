import React, { useEffect, useState } from "react";
import { 
  Button, Avatar,  Box,

} from '@mui/material';
import { motion } from "framer-motion";
import { bgColor } from "../constants/Colors";
import { useMediaQuery } from 'react-responsive';
import { Buffer } from "buffer";


const ViewStudentDetails = ({ onClose, user }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1023px)' });


  // date and time function
  const formattedDate = (isoDate) => {
    const date = new Date(isoDate);
    // Get the weekday and formatted date
    const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('en-US', optionsDate).format(date);
    return formattedDate;
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
            maxHeight: '95vh',
            padding: '10px',
            width: isMobile ? '90%' : '50%', 
            margin: '0% auto',
            backgroundColor: bgColor,
            borderRadius: "10px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
            <Box mt={.5} textAlign="center" sx={{ display: 'flex', justifyContent: 'flex-start', gap: '2rem'}}>
                <Button variant="contained" sx={{ backgroundColor: 'red',}} onClick={() => onClose()}>
                    Close
                </Button>
            </Box>
        <h4 style={{alignSelf: 'center', textAlign: 'center', padding: '10px'}}>Student Details</h4>
          
          <div className="form-scroll"
            style={{
              display: "flex",
              flexWrap: 'wrap',
              gap: "2rem",
              width: isMobile ? '100%' : '90%', 
              margin: 'auto',
            }}
            
          >
            <div style={{ position: 'relative', height: isMobile ? '150px': '350px', width: isMobile ? '120px' : '250px', display: 'flex', justifyContent:'center'}}>
                <img src = {`data:${user.image.contentType};base64,${Buffer.from(user.image.data).toString('base64')}`}
                    style = {{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                
                />
            </div>
            

            <div>
                <div>
                    <h4 style={{marginBottom: '10px'}}>Personal Information</h4>
                    <p style={{marginBottom: '10px'}}>Name: {user.name}</p>
                    <p style={{marginBottom: '10px'}}>Gender: {user.gender}</p>
                    <p style={{marginBottom: '10px'}}>Email: {user.email}</p>
                    <p style={{marginBottom: '10px'}}>Phone: {user.phoneNumber}</p>
                </div>

                <div style = {{marginTop: '15px'}}>
                    <h4 style={{marginBottom: '10px'}}>Academic Details</h4>
                    <p style={{marginBottom: '10px'}}>Student ID: {user.studentID}</p>
                    <p style={{marginBottom: '10px'}}>Faculty: {user.faculty}</p>
                    <p style={{marginBottom: '10px'}}>Department: {user.department}</p>
                    <p style={{marginBottom: '10px'}}>Program: {user.program}</p>
                    <p style={{marginBottom: '10px'}}>Level: {user.level}</p>
                    <p style={{marginBottom: '10px'}}>Exam Status: {user.examStatus}</p>
                    <p style={{marginBottom: '10px'}}>Year of Enrollment: {formattedDate(user.yearOfEnrollment)}</p>
                    <p style={{marginBottom: '10px'}}>Year of Completion: {formattedDate(user.yearOfCompletion)}</p>

                </div>

            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewStudentDetails;







