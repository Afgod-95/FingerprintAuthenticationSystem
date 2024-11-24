import React, { useEffect } from 'react'
import PageNavigations from './routes/PageNavigations'
import './App.css'
import { bgColor } from './constants/Colors'
import { Toaster } from 'react-hot-toast';
import axios from 'axios'
import { checkTokenExpiration } from './constants/checkTokenExpiration';
import { useDispatch } from 'react-redux';
import { fetchAllStudents } from './redux/reducers';

axios.defaults.baseURL = 'http://localhost:5031'
axios.defaults.withCredentials = true


const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const interval = setInterval(() => {
        checkTokenExpiration;
    }, 60000); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dispatch(fetchAllStudents())
  }, [dispatch])



  return (
      <div className='App'>
        <Toaster position='top-right'  
          toastOptions={{
            duration: 2000, 
            style: { 
              backgroundColor: bgColor, 
              color: '#fff',
              fontSize: '12px'
            }
          }}
        />
        <PageNavigations/>
      </div>
     )
}

export default App
