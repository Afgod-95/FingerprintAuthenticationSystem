import React, { useState, useEffect } from "react";
import { Button, Typography } from '@mui/material';
import { motion } from "framer-motion";
import { buttonsBgColor, bgColor } from "../../constants/Colors";
import CircularLoader from "../../components/Loaders";
import { useMediaQuery } from 'react-responsive';
import { IoIosArrowRoundBack } from "react-icons/io";
import axios from 'axios';
import { toast } from 'react-hot-toast'
import StudentDetails  from '../student/StudentDetails'
import { useNavigate } from "react-router-dom";



const StudentLogin = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    showPassword: false,
  });


  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1023px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const [studentData, setStudentData] = useState({
    fingerprintID: null,
    fingerprintImg: null,
    score: null
  })

  const [studentDet, setStudentDet] = useState(null)
  const [openModal, setOpenModal] = useState(false)
 


   //fingerprint fingerprintUrl
  const fingerprintUrl = 'http://localhost:5036'
  const [devLoading, setDevLoading] = useState({
    init: false,
    open: false,
    captureFin: false,
    enrollFin: false,
    enrollComp: false,
    close: false,
    cancel: false,
  })

   //initialize fingerprint device 
   const initiateDevice = async () => {
 
     await axios.post(`${fingerprintUrl}/api/fingerprint/init`)
     .then (res => {
       console.log(res.data);
       toast.success(res.data)
     }).catch(error => {
      if (error?.response && error?.response?.data?.error){
        toast.error(error.response.data.error)
      }
     })
 
   }
 


    //open fingerprint device
    const openDevice = async () => {
      try{
        setDevLoading({ ...devLoading, open: true });
        const response = await axios.post(`${fingerprintUrl}/api/fingerprint/open`)
        toast.success(response.data)
      }
      catch (error){
        if (error?.response && error?.response?.data?.error){
          toast.error(error.response.data.error)
        }
      }
      
      finally {
        setDevLoading({ ...devLoading, open: false });
      }  
    }
  
    //capture fingerprint 
    const captureFingerprint = async () => {
      try {
        setDevLoading({ ...devLoading, captureFin: true });
    
        const response = await axios.post(`${fingerprintUrl}/api/fingerprint/capture`);
        const { image, message } = response.data;
    
        if (image) {
          // Format the image as a data URL
          const base64Image = `data:image/png;base64,${image}`;
          setStudentData({ ...studentData, fingerprintImg: base64Image });
          toast.success(message);
  
        } else {
          toast.error("Fingerprint capture failed.");
        }
      } catch (error) {
        if (error?.response && error?.response?.data?.error){
          toast.error(error.response.data.error)
        }
      } 
      finally {
        setDevLoading({ ...devLoading, captureFin: false });
      }
    };


    // verify fingerprint match 
    const verifyFingerprint = async () => {
      try{
        setDevLoading({ ...devLoading, enrollFin: true });
        const response = await axios.post(`${fingerprintUrl}/api/fingerprint/identify`)
        const { message, id, score } = response.data;
        console.log(id, score)
        setStudentData({...studentData, fingerprintID: id, score: score});
        toast.success(message)
      }
      catch (error){
        if (error?.response && error?.response?.data?.error){
          toast.error(error.response.data.error)
        }
      }
      finally {
        setDevLoading({ ...devLoading, enrollFin: false });
      }
    }
  

    //close device 
    const closeDevice = async () => {
      try{
        setDevLoading({ ...devLoading, closeFin: true });
        const response = await axios.post(`${fingerprintUrl}/api/fingerprint/close`)
        toast.success(response.data)
      }
      catch (error){
        if (error?.response && error?.response?.data?.error){
          toast.error(error.response.data.error)
        }
        else {
          toast.error('Failed to close device')
        }
      }
      finally {
        setDevLoading({ ...devLoading, closeFin: false });
      }
    }
    
    

    //data submission to the server
    const handleSubmit = async () => {
      try {
        setIsLoading(true)
        //converting fingerpring to string
        const fingerprint = studentData.fingerprintID.toString();
        console.log(typeof fingerprint, fingerprint)
        if (!fingerprint){
          toast.error('Please enroll fingerprint first');
          return
        }
        const response = await axios.post('/api/student/login', {
          fingerprintId: fingerprint
        })
        if( response.data.error){
          toast.error(response.data.error)
        }
        else{
          toast.success(response.data.message)
          const { student } = response.data
          setStudentDet(student)
          setStudentData({ 
            ...studentData,
            fingerprintID: null,
          })
          
          setOpenModal(true)
          
        }
      }
      catch (error){
        console.log(error)
        toast.error("Failed to verify fingerprint")
      }

      finally {
        setIsLoading(false)
      }
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
          padding: '20px',
          width: '80%', 
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
          <h3 style={{ alignSelf: 'center', paddingTop: '20px' }}>Student Login</h3>
          <h4 style={{ alignSelf: 'center' }}>Authenticate using your fingerprint</h4>
            
            
            
          <div
              style = {{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2rem',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '90%',
                margin: '0% auto'
              }}
            >
              {/* Display the scanned fingerprint image */}
              <div 
                style = {{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: isMobile ? 250 : 250,
                  height: 300,
                  position: 'relative',
                  borderRadius: '8px',
                  border: 'thin solid #fff'
                }}
              > 

                {studentData.fingerprintImg ? (
                  <img
                    src={studentData.fingerprintImg}
                    alt="Fingerprint Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                  />
                ) : (
                  <Typography variant="body2" color="white">
                    No Fingerprint Captured
                  </Typography>
                )}
              </div>

              
              
              <div style={{ width: isMobile ? '100%'  : '70%'}}>
                <div style={{ textAlign: 'center', padding: '1.5rem'}}>
                  <h3>Fingerprint Sensor Controller</h3>
                </div>

                <div style = {{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem'}}>
                  <Button variant="contained" 
                    sx={{ backgroundColor: buttonsBgColor, width: '25%' }} 
                    onClick={initiateDevice}
                    disabled={devLoading.init}
                  >
                    {devLoading.init ? (
                        <CircularLoader  size={10}/>
                    ) : (
                      "Connect Device"
                    )}
                  </Button>

                  <Button variant="contained" 
                    sx={{ backgroundColor: buttonsBgColor, width: '25%' }} 
                    onClick={openDevice}
                    disabled={devLoading.open}
                  >
                    {devLoading.open? (
                       <CircularLoader  size={10}/>
                    ) : (
                      "Open"
                    )}
                  </Button>


                  <Button variant="contained" 
                    sx={{ backgroundColor: buttonsBgColor, width: '25%' }} 
                    onClick={captureFingerprint}
                    disabled={devLoading.captureFin}
                  >
                    {devLoading.captureFin ? (
                       <CircularLoader  size={10}/>
                    ) : (
                      "Capture"
                    )}
                  </Button>

                  

                  <Button variant="contained" 
                    sx={{ backgroundColor: buttonsBgColor, width: '35%' }} 
                    onClick={verifyFingerprint}
                    disabled={devLoading.enrollFin}
                  >
                    {devLoading.enrollFin ? (
                        <CircularLoader  size={10}/>
                    ) : (
                      "Verify Fingerprint"
                    )}
                  </Button>

                  <Button variant="contained" 
                    sx={{ backgroundColor: buttonsBgColor, width: '25%' }} 
                    onClick={closeDevice}
                    disabled={devLoading.close}
                  >
                    {devLoading.close ? (
                        <CircularLoader  size={10}/>
                    ) : (
                      "Disconnect"
                    )}
                  </Button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center'}} >
                <Button variant="contained" 
                  sx={{ backgroundColor: isLoading ? '#f2f2f2' : 'green', width: '50%', marginTop: '2rem', justifyContent: 'center', alignItems: 'center' }} 
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularLoader  size={10}/>
                  ) : (
                    "Sign In"
                  )}
                </Button> 
                </div>
              </div>
            </div>
        </div> 
      </motion.div>

      { openModal && 
        <StudentDetails 
          user = { studentDet }
          onClose = {() => setOpenModal(false)}
        />
      }

    </div>
  );
};

export default StudentLogin;
