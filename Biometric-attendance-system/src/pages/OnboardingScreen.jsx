import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buttonsBgColor } from '../constants/Colors';
import { useMediaQuery } from 'react-responsive';
import { MdAdminPanelSettings } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import axios from 'axios'



const OnLoadPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1023px)' });
    const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });


    const adminLogin = () => {
        navigate('/admin/login');
    }

    const studentLogin = () => {
        navigate('/student/login')
    }
    

    return (
        <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
            <motion.div
                className="middle"
                style={{...styles.middle, }}
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 100, damping: 20 }}
            >

                
                <motion.div
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem'}}
                >
                    <motion.div
                        style={{ alignItems: "center", margin: '20px', textAlign: "center"}}
                        initial={{ opacity: 0, x: '-100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1, type: 'spring', stiffness: 100, damping: 20 }} 
                    >
                        <h4>Biometric Atttendace System</h4>

                    </motion.div>
                    <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '15px'}}>
                        <Card 
                            delay = {1.0}
                            title={"Login as Admin"} 
                            icon={ <MdAdminPanelSettings  style = {{ height: 70, width: 70}}/>}
                            onClick={adminLogin}
                        />
                        
                        <Card title={"Login as Student"} 
                            delay = {1.2}
                            icon={<PiStudentFill  style = {{ height: 70, width: 70}}/>}
                            onClick={studentLogin}
                        />
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};


    const Card = ({ icon, title, onClick, delay }) => {
    return(
    <motion.button 
        initial={{ opacity: 0, x: '-100%' }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay, type: 'spring', stiffness: 100, damping: 20 }} 
        style={{
        minWidth: '250px',
        height: '100px',
        background: buttonsBgColor,
        borderRadius: '20px',
        display: 'flex', 
        justifyContent: 'center',
        gap: '1rem',
        alignItems: 'center',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '1.5rem' 
        }}
        onClick = { onClick }
    >

        
        {icon}

        <div style={{textAlign: 'left', fontSize: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '.2rem'}}>
            <h4>{title}</h4>
        </div>
        
    </motion.button>
    )
}



const styles = {
    middle: {
      backgroundColor: '#242A4B',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    middleMain: {
      width: '90%',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
};

export default OnLoadPage;
