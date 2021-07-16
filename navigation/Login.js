import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet,
  Image, KeyboardAvoidingView, TextInput, ImageBackground, Keyboard, StatusBar
} from 'react-native';
import { Button, Text, Heading, Surface, configureFonts } from 'react-native-paper'
import { auth } from '../components/Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Login({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(undefined);

// ---------- header ui configuration -----------

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: "true",
      headerShown: "false",
      headerTintColor: "white",
      headerTitle: "CLOUDBOOK",
    })
  })

// --------- checking wheather keyboard is open or not -------

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);


  const _keyboardDidShow = () => setKeyboardStatus("Keyboard Shown");
  const _keyboardDidHide = () => setKeyboardStatus("Keyboard Hidden");
  

  // --- store data in storage about user login  ----

  const setIsLogined = async()=>{
    await AsyncStorage.setItem('isLogined', 'true');
  }
 
  const getSignin = () => {
    Keyboard.dismiss();
    setLoading(true);
    const unsubscribed = auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        if (userCredential.user.emailVerified) {
          setIsLogined();
          navigation.replace("Home")
          setLoading(false);
        }
        else {
          alert("please verify your email")
          setLoading(false);
        }
      })
      .catch((error) => {
        alert(error.message);
        setLoading(false);
      });
    return unsubscribed;
  }
  

  return (<View style={styles.container}>
    <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
    {keyboardStatus === 'Keyboard Shown' ? null : <Text style={{ color: "white", fontSize: 18, marginBottom: 20 }} >Welcome back !</Text>}
    <Surface style={styles.surface}  >
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-80} >
        <View style={{ justifyContent: "flex-end" }} >
          {keyboardStatus === 'Keyboard Shown' ? null : <Image source={require('../assets/loginBackground1.png')} style={styles.image} />}
          <Text style={{ fontSize: 30 }}>Login</Text >
          <TextInput placeholder="Email" mode="outlined" value={email}
            onChangeText={(text) => { setEmail(text) }}
            style={styles.input} autoCompleteType="email" />
          <TextInput placeholder="Password" mode="outlined" value={password}
            onChangeText={(text) => { setPassword(text) }}
            style={styles.input} autoCompleteType="password" secureTextEntry={true} />
          <Button style={styles.button} mode="contained" loading={loading}
            onPress={getSignin} >Login</Button>
          <Button style={styles.button}
            onPress={() => { navigation.navigate('Signup') }} >Register</Button>
        </View>
        {keyboardStatus === 'Keyboard Shown' ? null : <View style={{ height: 70 }}></View>}
      </KeyboardAvoidingView>
    </Surface>
  </View>
  );

  
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#464D77",
    alignItems: "center",
  },
  surface: {
    justifyContent: "flex-end",
    alignItems: "center",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: "white",
    height: "80%",
    width: "100%",
    elevation: 4
  },
  input: {
    marginVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: "black",
    width: 300,
  },
  button: {
    margin: 10,
    marginHorizontal: 40
  },
  image: {
    width: '80%',
    height: '28%',
    marginBottom: 60,
  }

});
