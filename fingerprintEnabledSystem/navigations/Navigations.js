import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import Login from '../Screens/Login'
import Register from '../Screens/Register'
import Home from '../Screens/Home'

const Navigations = () => {
    const Stack = createStackNavigator()
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen name='Login' component={Login} options={{headerShown: false}}/>
            <Stack.Screen name='Register' component={Register} options={{headerShown: false}}/>
            <Stack.Screen name='Home' component={Home} options={{headerShown: false}}/>
        </Stack.Navigator>  
    </NavigationContainer>
  )
}

export default Navigations
