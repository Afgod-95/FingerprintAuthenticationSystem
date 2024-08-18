import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import AdminLogin from '../pages/adminAuth/AdminLogin';
import AdminForgotPassword from '../pages/adminAuth/AdminForgotPassword';
import StudentLogin from '../pages/studentAuth/StudentLogin';
import OnboardingScreen from '../pages/OnboardingScreen';
import Sidebar from '../components/Sidebar';
import CreateStudent from '../pages/CreateStudent';
import TableComponent from '../pages/ManageStudents';


const PageNavigations = () => {
    const location = useLocation();
    const isLogin = location.pathname === '/admin-login' 
    const isWelcomeScreen = location.pathname === '/'

    return (
      <>
          
          {!isLogin && !isWelcomeScreen && (
            <>
                <Sidebar>
                    <Routes>
                        <Route path="/admin-login/dashboard" element = { <Dashboard /> } />
                        <Route path="/admin-login/student-registration" element = { <CreateStudent /> } />
                        <Route path = '/admin-login/manage-students' element = { <TableComponent />} />
                    </Routes>
                </Sidebar>
            </>
                
                
            )}
            
            <Routes>
                <Route path='/' element = { <OnboardingScreen />} />
                <Route path="/admin-login" element={< AdminLogin />} />
                <Route path = '/admin-forgot-password' element = { <AdminForgotPassword />} />
                <Route path = '/student-login' element = { <StudentLogin />} />
            </Routes>
      
      
      </>
      
    );
}

export default PageNavigations;
