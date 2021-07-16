import React from 'react'
import { StyleSheet, Text, View,TextInput} from 'react-native'
import {Surface,RadioButton,Button} from 'react-native-paper'
import {db} from './Firebase'

const EditBook = (props) => {



    const[bookName, setBookName] = React.useState('')
    const[description, setDescription] = React.useState('')
    const[security, setSecurity] = React.useState('public')
    const [loading ,setLoading] = React.useState(false)
    
  
  
    const getBook = async () => {
      const Snap = await db.collection('books').doc(`${props.bookId}`).get()
      .then((doc)=>{setSecurity(doc.data().security);setBookName(doc.data().BookName);setDescription(doc.data().Description)})
      
    }


    React.useEffect(()=>{
        getBook();
    },[])


    const UpdateBook = async () => {
        await db.collection('books').doc(`${props.bookId}`)
          .update({
            BookName: bookName,
            Description: description,
            security:security,
          }).then(() => {
            props.sheetRef.current.close();  
            props.refresh();
            alert('Updated')
          }).catch((e) => {
            alert(e.message)
          })
      }




    return (
        <View style={styles.container}>
            <Surface style={styles.surface}  >

                <TextInput placeholder="BookName" label="BookName"
                    value={bookName} 
                    onChangeText={(text) => { setBookName(text) }} 
                    style={styles.input} 
                    />
                <TextInput placeholder="Description" label="Description" 
                value={description}
                    onChangeText={(text) => { setDescription(text) }} 
                    style={styles.input} 
                    />
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
                <Button mode="contained" onPress={() => { if (bookName !== '' && description !== '') {UpdateBook(); } else { alert('Please check your fills') } }} style={styles.button}
                    loading={loading}>Update</Button>
            </Surface>
        </View>
    )
}

export default EditBook


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
