import React from 'react';
import { View, Text, Dimensions, FlatList, StyleSheet, StatusBar } from 'react-native';
import { List, Colors, ProgressBar, Button, Chip } from 'react-native-paper';
import { auth, db } from '../components/Firebase';
import Cards from './Cards';

const PublicList = ({navigation}) => {

  
	let windowWidth = Dimensions.get('screen').width;
	const [expanded, setExpanded] = React.useState(false);
	const [status, setStatus] = React.useState("unchecked");
	
	const [likeIcon, setLikeIcon] = React.useState("heart-outline");
	const [itemFetch, setItemFetch] = React.useState([])


    React.useEffect(()=>{
		navigation.setOptions({
			headerStyle:{
				title:'blacv'
			}
		})
	},[])


	// ---------- getting book data from firebase -----------  


	const getBooks = async () => {
		const querySnap = await db.collection('books').where('security','==','public').get()
		const finalData = querySnap.docs.map(docSnap => { return ({data:docSnap.data(),id:docSnap.id})})
		setItemFetch(finalData);
	}


    
	React.useEffect(() => {
		getBooks();
	
	}, [])


  

	return (
		<Cards data={itemFetch} refresh={getBooks} nav={navigation} security={true}/>
	)
}


export default PublicList;

