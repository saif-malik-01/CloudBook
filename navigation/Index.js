import React from 'react';
import {  StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home'
import Login from './Login'
import Signup from './Signup'
import CreateBook from '../screens/CreateBook'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import OnBoarding from '../screens/OnBoarding'
import BookView from './BookView'
import PublicList from '../screens/PublicList'

      // ----- get firstPage from App to know which page have to open first------

export default function Index({firstPage}) {
    
  
  
    // -- react native paper theming ----

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#464D77',
    },
  };
  
  const Stack = createStackNavigator();


  return (<>
    <StatusBar barStyle="dark-content" />
    <PaperProvider theme={MyTheme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={firstPage}>
          <Stack.Screen name="OnBoarding" component={OnBoarding} />
          <Stack.Screen options={{ headerTitle: "CloudBook" }} name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="CreateBook" component={CreateBook} />
          <Stack.Screen name="BookView" component={BookView} />
          <Stack.Screen name="PublicList" component={PublicList} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  </>
  );

}
