import React from 'react'
import { StyleSheet, Text, View, RefreshControl } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import { Avatar, TouchableRipple, Button, Card,  Paragraph, Dialog, Portal } from 'react-native-paper';
import { SwipeRow } from 'react-native-swipe-list-view';
import EditBook from '../components/EditBook'
import RBSheet from "react-native-raw-bottom-sheet";
import {db,auth} from '../components/Firebase'
import firebase from 'firebase'

//  ----------------  card ui ---------------

const ShowCard = (props) => {

    const [visibility,setVisibility] =React.useState(false);
    const data = props.item.item.data;
    const refRBSheet2 = React.useRef();

    // ------------------ after deleting -1 number of books from user ----------------

    const updateBookNumber =()=>{
        db.collection('User').doc(`${auth.currentUser.uid}`)
       .update({
         BookNumber:firebase.firestore.FieldValue.increment(-1)
       }).catch((err)=>{
         Alert.alert(err.message)
       })
      }
 

    // --------------------- delete book from firebase ----------------------

    const deleteBook = async() => {
      await db.collection('books').doc(`${props.BookId}`).delete()
            .then(() => {
                props.refresh();
                props.bookNumRefresh();
                updateBookNumber();
                alert('Done')
            }).catch((e) => {
                alert(e.message);
            })
    }
   

   
    return (
        <View >
            <SwipeRow leftOpenValue={85} rightOpenValue={-85} disableRightSwipe={props.security}  disableLeftSwipe={props.security}>
                <View style={styles.standaloneRowBack}>
                    <TouchableRipple onPress={() => {refRBSheet2.current.open(); }} rippleColor="rgba(0, 0, 0, .32)" style={styles.backLeftBtn}>
                        <View><Text style={styles.backTextWhite}>Edit</Text></View>
                    </TouchableRipple>
                    <TouchableRipple onPress={() => { setVisibility(true)}} rippleColor="rgba(0, 0, 0, .32)" style={styles.backRightBtn}>
                        <View><Text style={styles.backTextWhite}>Delete</Text></View>
                    </TouchableRipple>
                </View>
                <TouchableRipple
                    onPress={() => {props.nav.navigate('BookView',
                    {id:props.BookId,date:data.date,time:data.time,uid:data.uid,title:data.BookName,refresh:props.refresh})}}
                    rippleColor="rgba(0, 0, 0, .32)"
                    style={styles.standaloneRowFront}
                >
                    <Card.Title
                        title={props.item.item.data.BookName}
                        subtitle={props.item.item.data.Description}
                        left={(props) => <Avatar.Icon {...props} icon="book" />}

                    />
                </TouchableRipple>
            </SwipeRow>
            {/* <Divider style={{marginTop:5}} /> */}

            <RBSheet
                ref={refRBSheet2}
                height={480}
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
                <EditBook bookId={props.BookId} refresh={props.refresh} sheetRef={refRBSheet2} />
            </RBSheet>
            <Portal>
                <Dialog visible={visibility} onDismiss={() => { setVisibilty(false) }}>
                    <Dialog.Title>Are you sure ?</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>After deleting, you can't retrieve it back</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => { setVisibility(false) }}>No</Button>
                        <Button onPress={() => { deleteBook(); setVisibility(false); }}>Yes</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    )
}


// dataget from publist or bookscreen ------------


const Cards = (dataGet) => {
  
    const [refreshing, setRefreshing] = React.useState(false);

    return (
        <FlatList
            data={dataGet.data}
            renderItem={(object) => <ShowCard item={object} 
            BookId={object.item.id} nav={dataGet.nav} 
            refresh={dataGet.refresh} 
            security={dataGet.security} 
            bookNumRefresh={dataGet.bookNumRefresh}/>}
            keyExtractor={item => item.BookName}
            refreshing={true}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => { setRefreshing(true); dataGet.refresh(); setRefreshing(false) }}
                />}

        />
    )
}

export default Cards

const styles = StyleSheet.create({
    standaloneRowFront: {
        alignItems: 'center',
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        marginTop: 10,
        borderRadius:5,
        marginHorizontal: 10
    },
    standaloneRowBack: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginHorizontal: 10,

    },
    backRightBtn: {
        height: "100%",
        width: '50%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        borderRadius: 5,
        paddingRight:30,
        backgroundColor: '#FF616D',
    },
    backLeftBtn: {
        height: "100%",
        width: '50%',
        justifyContent: 'center',
        paddingLeft:30,
        alignItems: 'flex-start',
        borderRadius: 5,
        backgroundColor: '#A19882',
    },
    backTextWhite: {
        color: '#fff',
    },

})
