import React, { useState, useEffect } from 'react';
import { Image, StatusBar } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';




const OnBoarding = ({ navigation }) => {
  const [headerColor, setHeaderColor] = useState("Get Started")
  const [isFirstTime, setIsFirstTime] = React.useState(null)


  useEffect(() => {
    navigation.setOptions({
      title: "Get Started ",
      headerTintColor: 'white',
      headerTransparent: "true",
      headerStyle: { backgroundColor: "#464D77" }
    });
  })

  const goto = () => {
    navigation.replace("Login");
  }


  return (<>
    <StatusBar translucent backgroundColor="transparent" />
    <Onboarding
      onSkip={() => { goto() }}
      onDone={() => { goto() }}
      pages={[
        {
          backgroundColor: '#464D77',
          image: <Image source={require('../assets/onBoarding1.png')} style={{ height: 250, width: 300 }} />,
          title: 'Connect Everywhere , Anywhere',
          subtitle: 'Share your notes and codes all around with our fully encrypted data store ',
          containerStyle: { flex: 1, backgroundColor: "red" }
        }, {
          backgroundColor: '#36827F',
          image: <Image source={require('../assets/onBoarding2.png')} style={{ height: 250, width: 300 }} />,
          title: 'Browse multiple books',
          subtitle: 'Explore large number of public books with hundrends of topic or make your own one ',
        }, {
          backgroundColor: '#877666',
          image: <Image source={require('../assets/onBoarding3.png')} style={{ height: 300, width: 350 }} />,
          title: 'Save your ideas',
          subtitle: 'Write new code and notes with highlight text block',
        },

      ]} />
  </>
  )
}


export default OnBoarding;