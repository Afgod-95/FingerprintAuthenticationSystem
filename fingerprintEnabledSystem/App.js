import { StatusBar } from 'expo-status-bar';
import Navigations from './navigations/Navigations';
import 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { NetInfo } from '@react-native-community/netinfo';
import { useEffect } from 'react';


export default function App() {

  useEffect(()=>{
    const checkInternetConnection = async () => {
      try {
        const connection = await NetInfo.fetch();
        if (connection.isConnected) {
          console.log('You are connected to the internet.');
          return true;
        } else {
          console.log('You are not connected to the internet.');
          return false;
        }
      } catch (error) {
        console.error('Error checking internet connection:', error);
        return false; // Handle errors by assuming no connection
      }
    };
    checkInternetConnection()
  }, []) 
  return (
   
    <>
      
        <StatusBar style="light" backgroundColor='#000' />
        <Navigations />
      
      
    </>
      
  
  );

}

