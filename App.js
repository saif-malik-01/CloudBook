import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Index from './navigation/Index'



export default function App() {

    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();
    const [isFirstTime, setIsFirstTime] = React.useState(null)


    // ---------- checking wheather the user open app first time  -------

    const checkIsFirst = async () => {
        await AsyncStorage.getItem('isOldUser')
            .then((data) => {
                if (data === 'true') {
                    setIsFirstTime(false)
                    if (initializing) setInitializing(false);
                } else {
                    setIsFirstTime(true)
                    AsyncStorage.setItem('isOldUser', 'true');
                    if (initializing) setInitializing(false);
                }
            })
    }
    checkIsFirst();

    // ----- if user is old check wheather is he authenticated or not ---------

    if (!isFirstTime) {
        checkIsAuthenticated();

    }


    async function checkIsAuthenticated() {
        await AsyncStorage.getItem('isLogined')
            .then((data) => {
                if (data === 'true') {
                    setUser(true)
                } else if (data === 'false') {
                    setUser(false)
                } else {
                    setUser(false)
                }
            })
        if (initializing) setInitializing(false);
    }


    // ------- navigate user as per check done above -------


    if (initializing) {
        return null
    }
    if (isFirstTime) {
        return (<Index firstPage='OnBoarding' />);
    } else if (user === false) {
        return (<Index firstPage='Login' />);
    } else if (user) {
        return (<Index firstPage='Home' />);
    }


    return (null)
}
