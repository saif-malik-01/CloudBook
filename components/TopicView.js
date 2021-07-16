import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import { gruvboxDark } from 'react-syntax-highlighter/styles/hljs';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { Surface, Paragraph, Dialog, Portal, Button } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import EditTopic from './EditTopic'
import { db,auth } from './Firebase'
import firebase from 'firebase';

const TopicView = ({ item, BookId,uid,topicNumRefresh ,refresh}) => {

    const refRBSheet2 = React.useRef();
    const [visibility, setVisibility] = React.useState(false);
    const [authEdit,setAuthEdit] = React.useState(false);

    const checkAuthEdit =()=>{
        if (uid == auth.currentUser.uid){
            setAuthEdit(true)
        }
      
    }

    React.useEffect(()=>{
        checkAuthEdit();
    },[])

    const deleteTopic = () => {
        db.collection('books').doc(`${BookId}`).collection('topic').doc(`${item.item.id}`).delete()
            .then(() => {
                updateTopicNumber();
                refresh();
                topicNumRefresh();
            }).catch((e) => {
                alert(e.message);
            })
    }


    const updateTopicNumber = async () => {
       await db.collection('books').doc(`${BookId}`)
            .update({
                topicNumber:  firebase.firestore.FieldValue.increment(-1)
            }).catch((err) => {
                Alert.alert(err.message)
            })
    }


    return (
        <>
            <View style={styles.container}>

                <Surface style={styles.bottomSurface}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.topicHeading}>{item.item.data.topicTitle}</Text>
                        { !authEdit ? null :<TouchableOpacity
                            onPress={() => { refRBSheet2.current.open(); }} >
                            <Icon style={{ marginTop: 10, marginRight: 5 }} name='pencil-box-outline' size={26} />
                        </TouchableOpacity>}
                        { !authEdit ? null :<TouchableOpacity
                            onPress={() => { setVisibility(true); }}>
                            <Icon style={{ marginTop: 10 }} name='delete-alert-outline' size={26} />
                        </TouchableOpacity>}
                    </View>
                    <View style={{ width: '95%', padding: 10, backgroundColor: '#1D2327', borderRadius: 15, marginBottom: 10 }}>
                        <SyntaxHighlighter
                            style={gruvboxDark}
                            language='javascript'
                            highlighter={"hljs"}>
                            {item.item.data.topicData}
                        </SyntaxHighlighter>
                    </View>
                </Surface>
            </View>
            <Portal>
                <Dialog visible={visibility} onDismiss={() => { setVisibilty(false) }}>
                    <Dialog.Title>Are you sure ?</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>After deleting, you can't retrieve it back</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => { setVisibility(false) }}>No</Button>
                        <Button onPress={() => { deleteTopic(); setVisibility(false) }}>Yes</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <RBSheet
                ref={refRBSheet2}
                height={400}
                closeOnDragDown={true}
                closeOnPressMask={false}
                customStyles={{
                    wrapper: {
                        backgroundColor: "transparent"
                    },
                    draggableIcon: {
                        backgroundColor: "#000"
                    }
                }}
            >
                <EditTopic bookId={BookId} TopicId={item.item.id} />
            </RBSheet>

        </>
    )
}

export default TopicView

const styles = StyleSheet.create({
    bottomSurface: {
        elevation: 4,
        borderRadius: 15,
        alignItems: 'center',
        backgroundColor: '#ffff',

        width: '95%',
        marginVertical: 10,

    },
    container: {
        flex: 1,
        alignItems: 'center',
    },
    topicHeading: {
        backgroundColor: '#ffffff',
        width: '75%',
        marginTop: 10,
        fontSize: 15,
        padding: 5,
        paddingLeft: 20
    }
})
