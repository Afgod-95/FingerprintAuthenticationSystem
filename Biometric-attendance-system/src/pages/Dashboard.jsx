import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-web';
import Animation from '../assets/fingerprintAnimate1.json'; 
import { bgColor, buttonsBgColor, searchPlaceHolder } from '../constants/Colors';
import { useMediaQuery } from 'react-responsive';
import { PiStudent } from "react-icons/pi";
import axios from 'axios'


const Dashboard = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });


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
  return (
    <motion.div
      initial={{ opacity: 0, x: '-100%' }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      
    >
      <motion.div
        className="middle"
        style={{...styles.middle }}

        initial={{ opacity: 0, x: '-100%' }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 100, damping: 20 }}
      >
        <motion.div
          style={{...styles.middleMain, marginTop: isMobile ? '30px': '30px' }}
          initial={{ opacity: 0, x: '-100%' }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 100, damping: 20 }}
        >
          <div style={{overflowY: 'scroll', height: '100vh'}} >
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
                                gap: '1rem'
                            }}
                        >
                            <div className="circle" style={{ background: '#06FD2E'}}>
                                <PiStudent  style={{color: '#f2f2f2', fontSize: '2rem', fontWeight: 'bold'}}/>
                            </div>

                            <div>
                                <p style={{color: '#f2f2f2', fontSize: '1rem', marginBlock: '5px'}}>Active Students</p>
                                <h3>581</h3>
                            </div>
    
                        </div>


                        <div
                            style = {{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                gap: '1rem'
                            }}
                        >
                            <div className="circle" style={{ background: '#C7CFC8'}}>
                                <PiStudent  style={{color: '#f2f2f2', fontSize: '2rem', fontWeight: 'bold'}}/>
                            </div>

                            <div>
                                <p style={{color: '#f2f2f2', fontSize: '1rem', marginBlock: '5px'}}>Active Students</p>
                                <h3>581</h3>
                            </div>
    
                        </div>
                       

                    </div>
                </div>
              <div className="lottie" 
                style={{ width: isMobile ? '200px' : '300px', height: '200px', border: '0.1px solid rgba(255,288,255,0.1)', borderRadius: '10px' }} 
              />
            </motion.div>
           
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

const styles = {
  middle: {
    backgroundColor: '#242A4B',
    borderTopLeftRadius: '50px',
    maxHeight: '800vh'
  },
  middleMain: {
    width: '95%',
    margin: '3% auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
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
