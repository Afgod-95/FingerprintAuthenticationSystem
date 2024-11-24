import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { adminInfo, isAuthenticated } = useSelector(state => state.admin)
   
    if(!isAuthenticated){
        return <Navigate to="/" />
    }
    
    if (adminInfo.role !== 'admin') {
        return <Navigate to="/" />;
    }

    if (adminInfo.role === 'admin') {
        return <Navigate to="/admin/dashboard" />;
    }
    
    if (adminInfo.role === 'student') {
        return <Navigate to="/student-details" />;
    }

    return children;
};

export default ProtectedRoute;
