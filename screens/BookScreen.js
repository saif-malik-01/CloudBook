import React from 'react';
import { View, Text, Dimensions, FlatList, StyleSheet, StatusBar } from 'react-native';
import { List, Colors, ProgressBar, Button, Chip, FAB, Portal, Provider } from 'react-native-paper';
import { auth, db } from '../components/Firebase'
import Cards from './Cards'
import CreateBook from './CreateBook'
import RBSheet from "react-native-raw-bottom-sheet";

const BookScreen = ({nav,bookNumRefresh}) => {

 
  const [expanded, setExpanded] = React.useState(false);
  const [status, setStatus] = React.useState("unchecked");
  const [refreshing, setRefreshing] = React.useState(false);
  const [likeIcon, setLikeIcon] = React.useState("heart-outline");
  const [itemFetch, setItemFetch] = React.useState([])
  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;
  const refRBSheet = React.useRef();

  // ------ getting book data from firebase with some queries -----

  const getBooks = async () => {
    console.log('update run ')
    const querySnap = await db.collection('books').where('uid', '==', auth.currentUser.uid).get()
    const finalData = querySnap.docs.map(docSnap => { return ({ data: docSnap.data(), id: docSnap.id }) })
    setItemFetch(finalData);
    return querySnap;
  }

  React.useEffect(() => { getBooks() ; }, []);

  
  
    
  console.log(itemFetch)


  return (<>
    <Cards data={itemFetch} refresh={getBooks} nav={nav} security={false} bookNumRefresh={bookNumRefresh}/>

    <RBSheet
      ref={refRBSheet}
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
    <CreateBook refresh={getBooks} sheetRef={refRBSheet} bookNumRefresh={bookNumRefresh}/>
    </RBSheet>

    <FAB
    style={styles.fab}
    
    icon="plus"
    onPress={() => {refRBSheet.current.open();}}
  />
  </>
  )
}

export default BookScreen;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor:'#293B5F'
  },
})
