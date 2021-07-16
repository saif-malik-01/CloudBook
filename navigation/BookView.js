
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, RefreshControl, StatusBar } from 'react-native';
import { Surface } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { db } from '../components/Firebase';
import CreateTopic from '../components/CreateTopic';
import RBSheet from "react-native-raw-bottom-sheet";
import TopicView from '../components/TopicView';


const BookView = ({ navigation, route }) => {

    const [topicNum, setTopicNum] = React.useState(0);
    const [topicGet, setTopicGet] = React.useState([])
    const [refreshing, setRefreshing] = React.useState(false);
    const refRBSheet = React.useRef();

    // ----------------- getting number of topic of book ----------------

    const getTopicNum = async () => {
         await db.collection('books').doc(`${route.params.id}`).get()
            .then((docs) => {
                setTopicNum(docs.data().topicNumber)
            }).catch((e) => {
                alert('check you internet connection')
            })
        }

    //---------- getting topic from specific book by book id getting from BookScreen or public-----------

    const getTopics = async () => {
        const querySnap = await db.collection('books').doc(`${route.params.id}`).collection('topic').get()
        const finalData = querySnap.docs.map(docSnap => { return ({ data: docSnap.data(), id: docSnap.id }) })
        setTopicGet(finalData);
    }

    React.useEffect(() => {
        getTopics();
        getTopicNum();
    }, [])

    //------------------- create topic  button at top left ------------------

    React.useEffect(() => {

        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => { refRBSheet.current.open() }}><Icon style={{ marginRight: 10 }} color='white' name='plus' size={26} /></TouchableOpacity>
            ),
            title: `${route.params.title}`,
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: "#4C4C6D",
                color: 'white',

            }
        })

    })


    // -------------- main render ---------------------

    return (<>
        <StatusBar barStyle='light-content' />
        <Surface style={styles.topSurface}>

        </Surface>

        <Surface style={styles.overTop}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{`Date: ${route.params.date}`}</Text>

            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{`: ${route.params.time}`}</Text>
            <View style={styles.bar}></View>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{`Topics: ${topicNum}`}</Text>
        </Surface>

        <FlatList
            data={topicGet}
            renderItem={(object) => <TopicView item={object} BookId={route.params.id} uid={route.params.uid} topicNumRefresh={getTopicNum} refresh={getTopics}/>}
            keyExtractor={item => item.id}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => { setRefreshing(true); getTopics(); setRefreshing(false) }}
                />}
        />

        <RBSheet
            ref={refRBSheet}
            height={420}
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
            <CreateTopic bookId={route.params.id} refresh={getTopics} topicNumRefresh={getTopicNum} />
        </RBSheet>

    </>
    )

}

export default BookView

const styles = StyleSheet.create({
    topSurface: {
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4C4C6D',
        height: '10%',
        width: '100%'
    },
    overTop: {
        elevation: 3,
        height: 80,
        marginTop: -50,
        flexDirection: 'row',
        borderRadius: 10,
        width: '90%',
        marginLeft: '5%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bar: {
        height: 40,
        borderRightWidth: 1,
        borderRightColor: 'black',
        marginHorizontal: 10,
    }

})

