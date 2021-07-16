import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {  StatusBar } from 'react-native'
import * as React from 'react';
import PublicList from '../screens/PublicList'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import BookScreen from '../screens/BookScreen'
import Profile from '../screens/Profile'
import { auth, db } from '../components/Firebase'



const Home = ({ navigation }) => {

  const [bookNumber,setBookNumber] = React.useState(0) 

   const getBookNumber = async()=>{
    const snap = await db.collection('User').doc(`${auth.currentUser.uid}`).get()
    setBookNumber(snap.data().BookNumber)
  }
  React.useEffect(()=>{
    getBookNumber();
    
  })


  const Tab = createMaterialBottomTabNavigator();
  

  return (<>

    <StatusBar translucent backgroundColor="transparent" />
    <Tab.Navigator
      initialRouteName="PublicList"
      activeColor="#293B5F"
      barStyle={{ backgroundColor: '#FFFFFF' }}
      shifting={true}
      lazy={false}
    >
      <Tab.Screen
        name="Feed"
        component={PublicList}
       
        options={{
          tabBarLabel: 'Public',
          tabBarIcon: ({ color }) => (
            <Icon name="book-open" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        children={()=><BookScreen nav={navigation} bookNumRefresh={getBookNumber}/>}
        options={{
          tabBarLabel: 'Private',

          tabBarIcon: ({ color }) => (
            <Icon name="book-lock" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        children={()=><Profile bookNumber={bookNumber} nav={navigation}/>}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Icon name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  </>

  );


}

export default Home;
