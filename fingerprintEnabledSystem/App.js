
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Login from './Screens/Login'
import Register from './Screens/Register'
import Home from './Screens/Home'
import { StatusBar } from 'expo-status-bar';
import ForgotPassword from './Screens/ForgotPassword';
import ResetPassword from './Screens/ResetPassword';

export default function App() {
  const Stack = createStackNavigator()
  return (
    <>
      <GestureHandlerRootView>
        <NavigationContainer>
            <StatusBar translucent backgroundColor="transparent" />
            <Stack.Navigator initialRouteName='Login'
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name='Login' component={Login} 
                options={{
                  headerShown: false,
                  presentation: "modal"
                }}
              />
              <Stack.Screen name='Register' component={Register} 
                options={{
                  headerShown: false,
                  presentation: "modal"
                }}
              />
              <Stack.Screen name='Home' component={Home} 
                options={{
                  headerShown: false,
                  presentation: 'card'
                }}
              />
              <Stack.Screen 
                name="Forgot-password" 
                component={ForgotPassword}
                options={{
                  headerShown: true,
                  presentation: 'modal',
                  headerStyle: {
                    backgroundColor: '#000',
                  },
                  headerTintColor: 'white', 
                  headerTitleStyle: {
                    color: 'white', 
                  },
                  headerTitleAlign: 'center', 
                  title: 'Forgot Password', 
                }}
              />

              <Stack.Screen 
                name="Reset-password" 
                component={ResetPassword}
                options={{
                  headerShown: true,
                  presentation: 'modal',
                  headerStyle: {
                    backgroundColor: '#000', 
                  },
                  headerTintColor: 'white', 
                  headerTitleStyle: {
                    color: 'white', 
                  },
                  headerTitleAlign: 'center', 
                  title: 'Reset Password', 
                }}
              />


            </Stack.Navigator>            
        </NavigationContainer>
       </GestureHandlerRootView> 
    </>
  );

}



