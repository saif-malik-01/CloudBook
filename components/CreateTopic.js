import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Surface, Button, Snackbar } from 'react-native-paper'
import { db } from './Firebase';
import firebase from 'firebase';

// --------------  getting book id from BookScreen ---------

const CreateTopic = ({ bookId,refresh,topicNumRefresh }) => {

  const [topicName, setTopicName] = React.useState('')
  const [topicData, setTopicData] = React.useState('')
  const [onData, setOnData] = React.useState(false)
  const refBtnDone = React.useRef();

  
  // ---------  increase number of book for login user -------------------

  const updateTopicNumber = async () => { 
    await db.collection('books').doc(`${bookId}`)
       .update({
         topicNumber: firebase.firestore.FieldValue.increment(1) 
       }).then(() => {
         console.log('updated');
       }).catch((err) => {
         
         Alert.alert(err.message)
       })
   }

  // ---------- posting topic filled data to firestore ------------

  const postTopic = async () => {
    await db.collection('books').doc(`${bookId}`).collection('topic')
      .add({
        topicTitle: topicName,
        topicData: `${topicData}  `,
      }).then(() => {
        refresh();
        updateTopicNumber();
        topicNumRefresh();
      }).catch((e) => {
        alert(e.message)
      }) 
  }



  // -------- main render ----------------

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff"
      }}
    >

      <View style={styles.container}>
        <Surface style={styles.surface}  >

          {onData ? null : <TextInput placeholder="Title" label="title"
            value={topicName}
            onChangeText={(text) => { setTopicName(text) }}
            style={styles.input}

          />}
          <TextInput placeholder="Data" label="data"
            value={topicData}
            ref={refBtnDone}
            onChangeText={(text) => { setTopicData(text) }}
            style={{ ...styles.input2 , height: onData ? '70%' : 90}}
            autoCapitalize='none'
            autoCorrect={false}
            onFocus={() => { setOnData(true) }}
            onBlur={() => { setOnData(false) }}
            multiline={true}
          />


          {onData ? <Button onPress={() => { refBtnDone.current.blur() }} mode="contained" style={{ marginBottom: 10, width: '70%' }} >Done</Button> : <Button mode="contained"
            onPress={() => { if (topicName !== '' && topicData !== '') { postTopic(); } else { alert('Please check your fills') } }}
            style={styles.button}
            loading={false}>Post
          </Button>}

        </Surface>
      </View>

      <Snackbar style={styles.snack} visible={false} onDismiss={() => { setSnack(false) }} >Post Successfull</Snackbar>

    </View>
  )
}

export default CreateTopic

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
    marginBottom: 60,
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
  },
  input2: {
    marginVertical: 20,
    marginBottom: 40,
    borderBottomWidth: 2,
    borderBottomColor: "black",
    width: '70%',

  },
});

