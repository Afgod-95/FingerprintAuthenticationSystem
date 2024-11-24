import React, { useEffect } from 'react'
import { Avatar } from '@mui/material'
import { CiBellOn } from "react-icons/ci";
import { useSelector } from 'react-redux';
import AdminAvatar from './AdminAvatar';



const Header = () => {
      
    const { adminInfo }= useSelector(state => state.admin)
    return (
        <div style={styles.headerContainer}>
            <div 
                style={{width: '95%', margin: 'auto', display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div className="title">
                    <h4>Fingerprint Auth</h4>
                </div>
                <div className="admin-area" style = {styles.adminArea}>
                   
                    <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', cursor: 'pointer'}}> 
                        <CiBellOn style={{fontSize: '2rem', color: '#f2f2f2'}}/>
                        <div className="indication" style={{
                            position: 'absolute',
                            top: '2px',
                            right: '4px',
                            backgroundColor: '#06FD2E',
                            width: '12px',
                            height: '12px',
                            borderRadius: '10px',
                            border: `1px solid #242A4B`
                        }}></div>
                    </div>
                   
                    <div className="avatar" style={styles.adminAvatar}>  
                        <p style={{paddingLeft: '8px'}}>{adminInfo?.name}</p>
                        <AdminAvatar />
                    </div>
                    

                </div>
            </div>
        </div>
    )
}

const styles = {
    headerContainer: {
        padding: '.5rem',
        width: '100%',
    },

    adminArea: {
        display: 'flex',
        justifyContent: 'right',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'center'
    },

    adminAvatar: {
        display: 'flex',
        justifyContent: 'right',
        gap: '.3rem',
        alignItems: 'center',
        background: '#f2f2f2',
        borderTopLeftRadius: '30px',
        borderBottomLeftRadius: '30px',
        borderTopRightRadius: '30px',
        borderBottomRightRadius: '30px',
    }
}
export default Header