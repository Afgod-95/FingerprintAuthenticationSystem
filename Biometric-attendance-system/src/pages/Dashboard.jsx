import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-web';
import Animation from '../assets/fingerprintAnimate1.json'; 
import { bgColor, buttonsBgColor, searchPlaceHolder } from '../constants/Colors';
import { useMediaQuery } from 'react-responsive';
import { PiStudent } from "react-icons/pi";
import axios from 'axios'
import RightDashboard from '../components/RightDashboard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminBy_ID, refreshAccessToken, updateTokens } from '../redux/reducers';
import MaterialBarChart from '../components/MaterialBarChart';
import { Box, Button, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import CircularLoader from '../components/Loaders.jsx'
import { toast } from 'react-hot-toast'
import { LiaUserCheckSolid } from "react-icons/lia";


const Dashboard = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const dispatch = useDispatch()
  const { id } = useParams()
  const {adminInfo, students, token, refreshToken, loading, error } = useSelector(state => state.admin)
  const [isLoading, setIsLoading] = useState(false)

  
  
  console.log(`Admin info: ${adminInfo}`)
  console.log(`Admin token: ${token}`)
  console.log(`Admin ref token: ${refreshToken}}`)
  
  // Fetch admin by ID
  useEffect(() => {
    if (id) {
      dispatch(fetchAdminBy_ID({ adminID: id }));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (loading) {
      console.log("Loading admin data...");
    } else if (error) {
      console.error("Error fetching admin data:", error);
    } else if (adminInfo) {
      console.log("Admin data fetched successfully:", JSON.stringify(adminInfo, null, 2)); 
    }
  }, [loading, error, adminInfo]);


  useEffect(() => {
    dispatch(refreshAccessToken())
  }, dispatch)

  const [fileType, setFileType] = useState('xlsx');

  const handleDownload = async () => {
      try {
          setIsLoading(true);
          const response = await axios.get('/api/admin/student/generate-report', {
              params: { fileType },
              responseType: 'blob', // Expect binary data from the server
          });

          const blob = new Blob([response.data], { type: response.headers['content-type'] });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = `student_report.${fileType}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(link.href);

          toast.success('Report downloaded successfully!');
      } catch (error) {
          console.error('Error downloading the report:', error);
          toast.error('Failed to download the report. Please try again.');
      } finally {
          setIsLoading(false);
      }
  };






  useEffect(() => {
    // Load Lottie animation
    const animationContainer = document.querySelector('.lottie');
    if (animationContainer) {
      Lottie.loadAnimation({
        container: animationContainer,
        animationData: Animation,
        loop: true,
        autoplay: true,
      });
    }
  }, []);

  //filtering status of students 
  const onlineStudents = students.filter(student => student.status === 'Absent')

  return (
    <motion.div
      style={{ 
        display: 'grid',
        gridTemplateColumns: 'auto 30vw'
      }}
    >
      <motion.div
        className="middle"
        style={{...styles.middle }}
      >
        <motion.div
          style={{...styles.middleMain,
            margin: isMobile ? '20px': '15px' }}
          
            initial={{ opacity: 0, x: '-100%' }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 100, damping: 20 }}
        >
          <div >
            <motion.div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}
            >
              <div>
                <h1 style={{fontSize: '16px', color: 'white'}}>Dashboard</h1>
              </div>
              <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button
                  sx={{ color: '#fff', fontSize: '1rem'}}
                  variant="contained"
                  color="primary"
                  onClick={handleDownload}
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={24} /> : null}
                >
                  {isLoading ? 'Generating...' : 'Download Report'}
                </Button>
              </Box>
            </motion.div>
            <motion.div
                className="information-container"
                style={{...styles.informationContainer, 
                    flexDirection: isMobile ? 'column-reverse' : '',
                    padding: isMobile ? '15px' : '15px',
                }}
                initial={{ opacity: 0, x: '-100%' }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 100, damping: 20 }}
            >
                <div className="user-info"
                    style={{...styles.userInfo, 
                    width: isMobile ? '100%': '', 
                    marginTop: isMobile ? '20px' : ''}}
                >
                    <div>
                    <h3 style={{ fontSize: isMobile ? '20px' : '',width: '80%', textAlign: 'left'}}>Check your students activities  & live updates </h3>
                    <p style={{textAlign: 'left', color: '#acadac', marginTop: '10px'}}>Recent activities  of students who didn’t sit for exams today</p>      
                    </div>
                    
                    <div
                        style = {{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: isMobile ? '1rem' : '3rem'
                        }}
                    >
                        
                        <div
                          style = {{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              gap: '.5rem'
                          }}
                        >
                          <div className="circle" style={{ background: '#C7CFC8'}}>
                              <PiStudent  style={{color: '#f2f2f2', fontSize: '2rem', fontWeight: 'bold'}}/>
                          </div>

                          <div>
                              <p style={{color: '#f2f2f2', fontSize: '1rem', marginBlock: '5px'}}>Total Students</p>
                              <h3>{students.length}</h3>
                          </div>
                        </div>

                        <div
                          style = {{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '.5rem'
                          }}
                        >
                          <div className="circle" style={{ background: '#06FD2E'}}>
                            <LiaUserCheckSolid  style={{color: '#f2f2f2', fontSize: '2rem', fontWeight: 'bold'}}/>
                          </div>

                          <div>
                            <p style={{color: '#f2f2f2', fontSize: '1rem', marginBlock: '5px'}}>Authenticated Students</p>
                            {onlineStudents.length === 0 ? (
                              <p>No student found</p>
                              ) : (
                                <h3>{onlineStudents.length}</h3>
                              )
                            }
                          </div>
    
                        </div>
                    </div>
                </div>
              <div className="lottie" 
                style={{ width: isMobile ? '200px' : '300px', height: '200px', border: '0.1px solid rgba(255,288,255,0.1)', borderRadius: '10px' }} 
              />
            </motion.div>
            
            <h2 style={{ color: 'white', padding: '20px' }}>Exams Attendance Overview</h2>
           
            <div style = {{overflow: 'auto', height: '40vh', paddingBottom: '50px'}}>
              <MaterialBarChart />
            </div> 
          </div>
        </motion.div>
      </motion.div>

      <div className="right" style={styles.right}>
        <RightDashboard />
      </div>
    </motion.div>
  );
}

const styles = {
  middle: {
    backgroundColor: '#242A4B',
    borderTopLeftRadius: '50px',
    borderTopRightRadius: '30px',
  },
  right: {
    maxHeight: '800vh'
  },

  middleMain: {
    margin: '3% auto',
    width: '95%'
  },
  informationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: buttonsBgColor,
    borderRadius: '10px',
    padding: '25px',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },

};

export default Dashboard;
