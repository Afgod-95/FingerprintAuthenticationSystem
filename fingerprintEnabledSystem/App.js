
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Login from './Screens/Login'
import Register from './Screens/Register'
import Home from './Screens/Home'
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const Stack = createStackNavigator()
  return (
    <>
    
        <NavigationContainer>
            <StatusBar translucent backgroundColor="transparent" />
            <Stack.Navigator initialRouteName='Login'
              screenOptions={{
                headerShown: false,
                cardStyle: {backgroundColor: '#000'}
              }}
            >
              <Stack.Screen name='Login' component={Login} options={{headerShown: false}}/>
              <Stack.Screen name='Register' component={Register} options={{headerShown: false}}/>
              <Stack.Screen name='Home' component={Home} options={{headerShown: false}}/>
            </Stack.Navigator>            
        </NavigationContainer>
    </>
  );

}



