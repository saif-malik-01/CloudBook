import * as React from 'react';
import { Text, View, StyleSheet, } from 'react-native';
import { Surface,  Avatar, Divider, List } from 'react-native-paper'
import { auth, db } from '../components/Firebase'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';

const Profile = ({ bookNumber,nav }) => {


  const [expanded, setExpanded] = React.useState(true);

  const handlePress = () => setExpanded(!expanded);



  const setIsLogined = async () => {
    await AsyncStorage.setItem('isLogined', 'false');
  }

  const getSignout = async () => {
    const unsubscribed = await auth.signOut()
      .then(() => {
        setIsLogined();
        nav.replace('Login')
      }).catch((error) => {
        alert(error.message)
      });
    return unsubscribed;
  }




  return (<View style={styles.container}>
    <Surface style={styles.surface}>
      <Avatar.Icon style={styles.avatar} size={65} icon="face" />
      <Text style={styles.name}>{auth.currentUser.displayName ?? 'anonymous'}</Text>
      <Text style={styles.email}>{auth.currentUser.email ?? 'anonymous'}</Text>
    </Surface>
    <Surface style={styles.bottomSurface}>
      <View>
        <Text style={{ fontSize: 20, color: 'white', marginTop: 15 }}>Verified</Text>
      </View>
      <View style={{ borderRightWidth: 1, borderRightColor: 'white', height: 50, marginHorizontal: 10, marginTop: 20 }}></View>
      <View>
        <Text style={{ fontSize: 20, color: 'white', marginTop: 15 }}>{`Books: ${bookNumber}`}</Text>
      </View>
    </Surface>

    <View style={{ justifyContent: 'flex-end', marginTop: '6%' }}>

      <List.Item
        title="Contact"
        description="Mail"
        onPress={() => { Linking.openURL('mailto: dev.saifmalik@gmail.com') }}
        left={(props) => <List.Icon {...props} icon="email-alert-outline" />} />
      <Divider style={{ height: 1 }} />
      <List.Item
        title="Feedback"
        description="Store"
        left={(props) => <List.Icon {...props} icon="comment-processing-outline" />} />
      <Divider style={{ height: 1 }} />
      <List.Item
        title="Sign out"
        description="Bye"
        onPress={getSignout}
        left={(props) => <List.Icon {...props} icon="logout" />} />

      <Divider style={{ height: 1 }} />
      <List.Item
        title="About"
        onPress={() => { Linking.openURL('https://dev-saif.ml') }}
        description="Portfolio"
        left={(props) => <List.Icon {...props} icon="information-variant" />} />
      <Divider style={{ height: 1 }} />
    </View>


  </View>)
}


export default Profile;

const styles = StyleSheet.create({
  surface: {

    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    height: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,

  },
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  avatar: {
    marginBottom: 10,
    backgroundColor: '#293B5F'
  },
  bottomSurface: {
    height: 100,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: '#293B5F',
    marginTop: -25,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold'
  },
  email: {
    fontSize: 15,
    marginVertical: 5
  }
});