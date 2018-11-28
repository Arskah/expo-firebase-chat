import * as React from 'react'
import { SwitchNavigator } from 'react-navigation'

import LandingScreen from "./screens/LandingScreen"
import SignupScreen from "./screens/SignupScreen"
import LoginScreen from "./screens/LoginScreen"
// import ChatScreen from "./screens/ChatScreen"
import SettingsScreen from "./screens/SettingsScreen"

// import firebase from 'firebase';

// var config = {
//   apiKey: "<API_KEY>",
//   authDomain: "<PROJECT_ID>.firebaseapp.com",
//   databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
//   projectId: "<PROJECT_ID>",
//   storageBucket: "<BUCKET>.appspot.com",
//   messagingSenderId: "<SENDER_ID>",
// };

// firebase.initializeApp(config)

// create our app's navigation stack
const App = SwitchNavigator(
  {
    LandingScreen,
    SignupScreen,
    LoginScreen,
    // ChatScreen,
    SettingsScreen
  },
  {
    initialRouteName: 'LoginScreen'
  }
)

export default App