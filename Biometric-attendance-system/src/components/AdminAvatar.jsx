import React from 'react'
import { Avatar } from '@mui/material';
import { Buffer } from 'buffer';
import { useSelector } from 'react-redux';


const AdminAvatar = ({ marginTop, marginBottom }) => {
  const { adminInfo } = useSelector(state => state.admin)
  
  return (
    <Avatar src ={`data:${adminInfo.image.contentType};base64,${Buffer.from(adminInfo.image.data).toString('base64')}` || ''}  
        alt = {adminInfo?.name || ''}
        sx={{width: '35px', height: '35px', border: '1px solid #d1d1d1', marginTop: `${marginTop}px`, marginBottom: `${marginBottom}px`}}
    />
  )
}

export default AdminAvatar