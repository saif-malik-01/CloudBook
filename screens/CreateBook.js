import * as React from 'react';
import { Text, View, StyleSheet, Image, StatusBar, Keyboard, Alert, TextInput } from 'react-native';
import { Button, Snackbar, RadioButton, Surface } from 'react-native-paper'
import { auth, db } from '../components/Firebase';
import  firebase from 'firebase';



export default function CreateBook({refresh,sheetRef,bookNumRefresh}) {

  const [bookName, setBookName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [snack, setSnack] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [security, setSecurity] = React.useState('public');
  const [text,setText] = React.useState('')
  const [finald,setFinald] = React.useState({})

  // ----------- add +1 on no of book on creation of book ---------------------
  
  const updateBookNumber =()=>{
    db.collection('User').doc(`${auth.currentUser.uid}`)
   .update({
     BookNumber:firebase.firestore.FieldValue.increment(1)
   }).catch((err)=>{
     Alert.alert(err.message)
   })
  }
  
  
  //---- getting system date and time -----
  const localDate = new Date().toLocaleDateString();
  const localTime = new Date().toLocaleTimeString();
  const [date, setDate] = React.useState(localDate);
  const [time, setTime] = React.useState(localTime);

  // ------ posting new book data --------

  const postBook = async () => {
    Keyboard.dismiss();
    updateBookNumber();
    setLoading(true);
    await db.collection('books')
      .add({
        BookName: bookName,
        Description: description,
        user: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
        security: security,
        date: date,
        topicNumber:0,
        time:time,
      }).then(() => {
        setSnack(true);
        bookNumRefresh();
        setLoading(false);
        sheetRef.current.close();
        refresh();
      }).catch((err) => {
        setLoading(false);
        Alert.alert(err.message);
      })

  }


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff"
      }}
    >
      
  
      <>
    <View style={styles.container}>
      <Surface style={styles.surface}  >
        
        <TextInput placeholder="BookName" label="BookName"
          value={bookName} onChangeText={(text) => { setBookName(text) }} style={styles.input} />
        <TextInput placeholder="Description" label="Description" value={description}
          onChangeText={(text) => { setDescription(text) }} style={styles.input} />
        <RadioButton.Group onValueChange={newValue => setSecurity(newValue)} value={security} >
          <View style={styles.radioBtn}>
            <View style={styles.btnTitle} >
              <Text style={{ paddingTop: 7 }}>Public</Text>
              <RadioButton value="public" color='#293B5F' />
            </View>
            <View style={styles.btnTitle} >
              <Text style={{ paddingTop: 7 }}>Private</Text>
              <RadioButton value="private" color='#293B5F' />
            </View>
          </View>
        </RadioButton.Group>
        <Button mode="contained" onPress={() => { if (bookName !== '' && description !== '') { postBook(); } else { alert('Please check your fills') } }} style={styles.button}
          loading={loading}>Post</Button>
      </Surface>
    </View>

    <Snackbar style={styles.snack} visible={snack} onDismiss={() => { setSnack(false) }} >Post Successfull</Snackbar>

  </>
 
    </View>

  );
}


const styles = StyleSheet.create({
  input: {
    marginVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: "black",
    width: '70%'
  },
  button: {
    margin: 10,
    width: '80%',
    marginBottom: 80,
    backgroundColor: '#293B5F'
  },
  snack: {
    marginBottom: 10
  },
  radioBtn: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  btnTitle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#293B5F",
    alignItems: "center",
  },
  surface: {
    justifyContent: "flex-end",
    alignItems: "center",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: "white",
    height: "90%",
    width: "100%",
    elevation: 4
  },
  image: {
    width: '75%',
    height: '40%',
    marginBottom: 40,
  }
});
