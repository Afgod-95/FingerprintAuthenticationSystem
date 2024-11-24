import React, { useState } from 'react'
import { Avatar } from '@mui/material'
import { HomeBgColor } from '../constants/Colors'
import { motion } from  'framer-motion'
import { useSelector } from 'react-redux'
import { Buffer } from 'buffer';

const StudentCard = ({ img, name, dept, logTime, status, onClick }) => {

  return (
    <motion.div
        style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            background: HomeBgColor,
            borderRadius: '20px',
            padding: '10px',
            
        }}
        initial={{ opacity: 0, x: '-100%' }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 100, damping: 20 }}

    >
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: '1rem',
                cursor: 'pointer',
            }}

            onClick={onClick}
        >
            <Avatar alt={name}  src={`data:${img.contentType};base64,${Buffer.from(img.data).toString('base64')}`}  />
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}>
               <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '.3rem'
                    }}
               >
                    <h1 style={{fontSize: '15px', textAlign: 'left', fontWeight: '600', color: '#fff'}}>{name}</h1>
                    <p>{dept}</p>
               </div>
                    
                <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '.3rem'
                }}>
                    <p style={{fontWeight: 'bold'}}>Login |</p>
                    <p>{logTime}</p>
                    <p>Logout - </p>
                </div>
                    
            </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '.5rem'}}>
            <div style={{width: '10px', height: '10px', borderRadius: '20px', background: status === 'Present' ? '#06FD2E' : '#acadac'}}></div>
            <p style={{color: '#acadac'}}>{status}</p>
        </div>
        
    </motion.div>
  )
}

export default StudentCard