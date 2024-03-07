import { StatusBar } from 'expo-status-bar';
import Navigations from './navigations/Navigations';
import 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';

export default function App() {
  return (
   
    <>
     
        <StatusBar style="light" backgroundColor='#000' />
        <Navigations />
      
      
    </>
      
  
  );

}

