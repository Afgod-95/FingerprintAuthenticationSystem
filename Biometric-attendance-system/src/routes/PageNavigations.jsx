import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from '../pages/Dashboard';
import AdminLogin from '../pages/adminAuth/AdminLogin';
import AdminForgotPassword from '../pages/adminAuth/AdminForgotPassword';
import StudentLogin from '../pages/studentAuth/StudentLogin';
import OnboardingScreen from '../pages/OnboardingScreen';
import Sidebar from '../components/Sidebar';
import CreateStudent from '../pages/CreateStudent';
import TableComponent from '../pages/ManageStudents';
import Profile from '../pages/Profile';
import AdminRegister from '../pages/adminAuth/AdminRegister';


const PageNavigations = () => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.admin);

  const isLogin = location.pathname === '/admin/login' || location.pathname === '/student/login';
  const isWelcomeScreen = location.pathname === '/';

  return (
    <>
      {isAuthenticated && !isLogin && !isWelcomeScreen ? (
        <Sidebar>
          <Routes>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/student-registration" element={<CreateStudent />} />
            <Route path="/admin/manage-students" element={<TableComponent />} />
            <Route path="/admin-profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" />} />
          </Routes>
        </Sidebar>
      ) : (
        <Routes>
          <Route path="/" element={<OnboardingScreen />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="*" element={<Navigate to="/" />} /> 
        </Routes>
      )}
    </>
  );
};

export default PageNavigations;
