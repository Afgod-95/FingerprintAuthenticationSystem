import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buttonsBgColor } from '../constants/Colors';
import { useMediaQuery } from 'react-responsive';
import { Avatar } from "@mui/material";
import EditAdminModal from "../components/EditAdminModal";
import { useSelector } from "react-redux";
import { Buffer } from 'buffer'



const Profile = () => {
    
    const [updateModalVisible, setUpdateModalVisible] = useState(false)

    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1023px)' });
    const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

    const { adminInfo } = useSelector(state => state.admin)

    const handleAdminEditModal = () => {
        setUpdateModalVisible(true)
    }
    

    return (
        <motion.div>
            <motion.div
                className="middle"
                style={{...styles.middle, }}
                
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
                        <h4>Profile</h4>

                    </motion.div>
                    <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '15px'}}>
                        <Card 
                            delay = {1.0}
                            title={adminInfo.name} 
                            name = {'View Profile'}
                            icon={ <Avatar sx={{ width: 50, height: 50 }} src ={`data:${adminInfo.image.contentType};base64,${Buffer.from(adminInfo.image.data).toString('base64')}` || ''} alt= {adminInfo.name}/>}
                          
                        />

                        <Card 
                            delay = {1.0}
                            title={"Update Profile"} 
                            name={adminInfo?.name}
                            email = {adminInfo?.email}
                            icon={ <Avatar sx={{ width: 50, height: 50 }} src ={`data:${adminInfo.image.contentType};base64,${Buffer.from(adminInfo.image.data).toString('base64')}` || ''} alt= {adminInfo.name}/>}
                            onClick={() => handleAdminEditModal()}
                        />
                    </div>
                </motion.div>
                {updateModalVisible && (
                    <EditAdminModal onClose={() => {
                        setUpdateModalVisible(false) 
                    }}/>
                )}
            </motion.div>
        </motion.div>
    );
};


    const Card = ({ icon, title, onClick, delay, name, email }) => {
    return(
    <motion.button 
        initial={{ opacity: 0, x: '-100%' }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay, type: 'spring', stiffness: 100, damping: 20 }} 
        style={{
        minWidth: '300px',
        height: '100px',
        background: buttonsBgColor,
        borderRadius: '20px',
        display: 'flex', 
        paddingLeft: '1rem',
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
            <p style={{color: '#acadac'}}>{name}</p>
            <p style={{color: '#acadac'}}>{email}</p>
        </div>
        
    </motion.button>
    )
}



const styles = {
    middle: {
      backgroundColor: '#242A4B',
      borderTopLeftRadius: '50px',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    middleMain: {
      width: '90%',
      margin: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
};

export default Profile;
