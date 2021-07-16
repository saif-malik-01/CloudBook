import * as React from 'react';
import { Text, View, StyleSheet, Image, StatusBar, Keyboard, Alert, TextInput } from 'react-native';
import { Button, Snackbar, Surface } from 'react-native-paper'
import { auth, db } from '../components/Firebase'
import firebase from 'firebase';



export default function Signup({ navigation }) {

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [snack, setSnack] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [number, setNumber] = React.useState('');

  React.useEffect(() => {
    navigation.setOptions({
      headerTransparent: "true",
      headerShown: "false",
      headerTintColor: "white",
    })
  })



  const postBookNumber = async ()=>{
    await db.collection('User').doc(`${auth.currentUser.uid}`)
   .set({
     BookNumber:0
   }).catch((err)=>{
     Alert.alert(err.message)
   })
  }
  
  const postUserNumber = async ()=>{
    await db.collection('User').doc('NumberOfUser')
   .update({
     UserNumber:firebase.firestore.FieldValue.increment(1)
   }).catch((err)=>{
     Alert.alert(err.message)
   })
  }


  React.useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  const [keyboardStatus, setKeyboardStatus] = React.useState(undefined);
  const _keyboardDidShow = () => setKeyboardStatus("Keyboard Shown");
  const _keyboardDidHide = () => setKeyboardStatus("Keyboard Hidden");



  const getSignUp = async () => {

    Keyboard.dismiss();
    setLoading(true);
    await auth.createUserWithEmailAndPassword(email.trim(), password)
      .then(async () => {
        await auth.currentUser.updateProfile({ displayName: name })
        await auth.currentUser.sendEmailVerification()
          .then(() => {
            postUserNumber();
            postBookNumber();
            setSnack(true);
            setLoading(false);

          })
          .catch(() => {
            Alert.alert("Email id is not valid");
            setLoading(false);
          })

      }).catch((err) => {
        Alert.alert(err.message);
        setLoading(false);
      })

  }



  return (<View style={{ flex: 1, backgroundColor: "#877666", justifyContent: "flex-end", alignItems: "center" }}>
    {keyboardStatus === 'Keyboard Shown' ? null : <Text style={{ color: "white", fontSize: 18, marginBottom: 20 }} >Glad to see you !</Text>}
    <Surface style={styles.surface}>
      {keyboardStatus === 'Keyboard Shown' ? null : <Image source={require('../assets/signup1.png')} style={{ height: '35%', width: '60%', marginRight: 35 }} />}
      <TextInput placeholder="Name" mode="outlined"
        value={name} onChangeText={(text) => { setName(text) }} style={styles.input} />
      <TextInput placeholder="Email" value={email} mode="outlined"
        onChangeText={(text) => { setEmail(text) }} style={styles.input} />
      <TextInput placeholder="Password" value={password} mode="outlined"
        onChangeText={(text) => { setPassword(text) }} style={styles.input} secureTextEntry={true} />
      <TextInput placeholder="Number (optional)" value={number} keyboardType="numeric"
        onChangeText={(text) => { setNumber(text) }} style={styles.input} />
      <Button mode="contained" onPress={getSignUp} style={styles.button}
        loading={loading}> Signup</Button>
    </Surface>
    <Snackbar style={styles.snack} visible={snack} onDismiss={() => { setSnack(false) }} >Verification Mail Send</Snackbar>
  </View>
  );
}


const styles = StyleSheet.create({
  input: {
    margin: 15,
    borderBottomWidth: 2,
    borderBottomColor: "black",
    height: 40,
    width: 300
  },
  button: {
    width: 250,
    marginTop: 20,
    backgroundColor: "#877666"
  },
  snack: {
    marginBottom: 10
  },
  surface: {
    justifyContent: "flex-end",
    alignItems: "center",
    height: "80%",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingBottom: 40,
    width: "100%"
  }
});


