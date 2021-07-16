import React from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import { Surface, RadioButton, Button } from 'react-native-paper'
import { db } from './Firebase'

const EditTopic = (props) => {

  const[topicTitle, setTopicTitle] = React.useState('')
  const[topicData, setTopicData] = React.useState('')
  const [loading ,setLoading] = React.useState(false)
  const [focus,setFocus] = React.useState(false)
  const refText = React.useRef();


  const getTopic = async () => {
    const Snap = await db.collection('books').doc(`${props.bookId}`).collection('topic').doc(`${props.TopicId}`).get()
    .then((doc)=>{setTopicTitle(doc.data().topicTitle);setTopicData(doc.data().topicData)})
    
  }

  React.useEffect(() => {
    getTopic();
  },[])

  
   

  // ---------- posting topic filled data to firestore ------------

  const UpdateTopic = async () => {
    await db.collection('books').doc(`${props.bookId}`).collection('topic').doc(`${props.TopicId}`)
      .update({
        topicTitle: topicTitle,
        topicData: topicData,
      }).then(() => {
        alert('done')
      }).catch((e) => {
        alert(e.message)
      })
  }

  

  return (
      <View style={styles.container}>
        <Surface style={styles.surface} >

          {focus ? null :<TextInput placeholder="Topic" label="TopicTitle"
            value={topicTitle} 
            onChangeText={(text) => { setTopicTitle(text) }} 
            style={styles.input} 
            />}
          <TextInput placeholder="Description" label="Description" 
          ref={refText}
          value={topicData}
          onChangeText={(text) => { setTopicData(text) }} 
          style={{ ...styles.input ,height : focus ? 160 : 90}} 
          multiline={true}
          autoCapitalize='none'
          autoCorrect={false}
          onBlur={()=>{setFocus(false)}}
          onFocus={()=>{setFocus(true)}}
          />
      
          {focus? <Button onPress={()=>{refText.current.blur();}} mode='contained' style={styles.button}>Done</Button> :
          <Button mode="contained" 
          onPress={() => { if (topicTitle !== '' && topicData !== '') {UpdateTopic(); } 
          else { alert('Please check your fills') } }} style={styles.button}
            loading={loading}>Update</Button>}
        </Surface>
      </View>
   
  )
}

export default EditTopic

const styles = StyleSheet.create({
  input: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "black",
    width: '70%'
  },
  button: {
    margin: 10,
    width: '80%',
    marginBottom: 40,
    backgroundColor: '#293B5F'
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
    height: "80%",
    width: "100%",
    elevation: 4
  }, 
 
});

