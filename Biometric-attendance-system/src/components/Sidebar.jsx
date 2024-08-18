import React, { useState } from 'react';
import { IoHomeOutline, IoSettingsOutline, IoSearch, IoCreateOutline } from "react-icons/io5";
import { NavLink } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { MdDashboard } from "react-icons/md";
import { useMediaQuery } from 'react-responsive';
import { motion, AnimatePresence, } from 'framer-motion';
import './Sidebar.css';
import { bgColor } from '../constants/Colors';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Avatar } from '@mui/material';
import { MdLogout } from "react-icons/md";
import { FaBarsStaggered } from "react-icons/fa6";

const Sidebar = ({ children }) => {
    const links = [
        { id: 0, name: 'Dashboard', path: '/admin/dashboard', icon: <MdDashboard /> },
        { id: 1, name: 'Manage Students', path: '/admin/manage-students', icon: <ManageAccountsIcon/> },
        { id: 2, name: 'Register Student', path: '/admin/student-registration', icon: <PersonAddIcon/> }
    ];

    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [menuExpanded, setMenuExpanded] = useState(false);

    const toggleDrawer = () => setDrawerOpen(!drawerOpen);
    const toggleMenuExpanded = () => setMenuExpanded(!menuExpanded);


    const user = {
        profileImage: 'https://png.pngtree.com/thumb_back/fh260/background/20230612/pngtree-man-wearing-glasses-is-wearing-colorful-background-image_2905240.jpg',
        username: 'Godwin',
        email: 'afgod98@gmail.com',
    }
    const DrawerList = (
        <List>
            {links.map((item) => (
                <ListItem key={item.id} disablePadding>
                    <ListItemButton
                        component={NavLink}
                        to={item.path}
                        onClick={() => setDrawerOpen(false)}
                        sx={{ color: 'white', display: 'flex', alignItems: 'center' }}
                    >
                        <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                        {menuExpanded && <ListItemText primary={item.name} />}
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );

    return (
        <>
            <div className="container">
                <motion.div
                    className={`sidebar-container ${menuExpanded ? 'expanded' : ''}`}
                    animate={{ width: menuExpanded ? '250px' : '60px' }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="side-bar">
                        {!menuExpanded && <div className="open-sidebar-toggle">
                            <IconButton
                                color="inherit"
                                onClick={toggleMenuExpanded}
                            >
                                <FaBarsStaggered style={{ color: '#fff', fontSize: '1.5rem', marginLeft: '10px' }} />
                            </IconButton>
                        </div>}
                       
                        <div className="link">
                            {links.map((item, index) => (
                                <NavLink to={item.path} key={index} className="links" activeClassName = 'active'>
                                    <div className="icons">{item.icon}</div>
                                </NavLink>
                            ))}

                            <NavLink path to = '/admin/profile' activeClassName = 'active'
                                style={{ 
                                    marginTop: '180px', 
                                    marginBottom: '20px',
                                    paddingLeft: '8px', 
                                    display: 'flex', 
                                    cursor: 'pointer',
                                    alignItems: 'center', 
                                    gap: '.5rem', 
                                    borderTop: 'thin solid rgba(255,255,255,0.1)'
                                }} className='icons'
                            >
                                <Avatar sx={{ width: 35, height: 35, marginTop: '10px', marginBottom: '10px'}} src= { user.profileImage}/>
                            </NavLink>
                            <div 
                                style={{ 
                                    paddingLeft: '12px', 
                                
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '.5rem',
                                    cursor: 'pointer',
                                }} className='icons' 
                            
                            >
                                <MdLogout style={{ color: '#fff', fontSize: '1.5rem' }} className='icons' />
                            </div>
                        </div> 
                    </div>

                    {menuExpanded && 
                        <motion.div
                            initial={{ opacity: 0, x: "-100%" }}
                            animate={{ opacity: 1, x: "0%" }}
                            exit={{ opacity: 0, x: "-100%" }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 100, damping: 20 }}
                           
                            style={{
                                position: "absolute",
                                overflow: 'hidden',
                                bottom: 0,    
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                zIndex: 9998,
                            }}
                        >
                            <div className="sidebar-toggle" style={{width: isMobile ? '50%' : '15vw'}}  onClick = {(e) => e.stopPropagation()} >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    marginTop: '20px',
                                    padding: '15px',
                                    gap: '1rem'
                                    
                                }}>
                                    <IconButton
                                        color="inherit"
                                        onClick={toggleMenuExpanded}
                                    >
                                        <FaBarsStaggered style={{ color: '#fff', fontSize: '1.5rem' }} />
                                    </IconButton>

                                    <h2 style={ {color: '#fff'}}>Auth</h2>


                                </div>

                                <div   style={{ marginTop: '50px'}}>
                                    {links.map((item, index) => (
                                        
                                        <NavLink to={item.path} key={index} className="links" activeClassName = 'active'>
                                            <div className="icons">{item.icon}</div>
                                            <AnimatePresence>
                                                {menuExpanded && (
                                                    <motion.p
                                                        className="text"
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        {item.name}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </NavLink>
                                    ))}
                                </div>
                                

                                <NavLink activeClassName = 'active' path to = '/admin/profile'
                                    style={{ 
                                        marginTop: '120px', 
                                        marginBottom: '15px',
                                        paddingLeft: '8px', 
                                        display: 'flex', 
                                        cursor: 'pointer',
                                        alignItems: 'center', 
                                        gap: '1rem', 
                                        borderTop: 'thin solid rgba(255,255,255,0.1)'
                                    }} 
                                >
                                    <Avatar sx={{ width: 35, height: 35, marginTop: '10px', marginBottom: '10px'}} src= { user.profileImage}/>
                                    {menuExpanded && 
                                        <motion.p
                                            className="text"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.2 }}
                                            style={{color: '#fff'}}
                                        >
                                            User profile
                                        </motion.p>
                                    }
                                </NavLink>

                                <div style={{ paddingLeft: '12px', display: 'flex', alignItems: 'center', gap: '1rem'}} >
                                   
                                    <MdLogout style={{ color: '#fff', fontSize: '1.5rem' }} />
                                    {menuExpanded && 
                                        <motion.p
                                            className="text"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.2 }}
                                            style={{color: '#fff'}}
                                        >
                                            Logout
                                        </motion.p>
                                    }
                                </div>
                            </div>
                        </motion.div>
                    }
                </motion.div>

                <div className="content">
                    {children}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
