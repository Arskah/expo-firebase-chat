// import * as React from "react";
import { createSwitchNavigator, DrawerNavigator, createDrawerNavigator } from "react-navigation";

import LandingScreen from "./screens/LandingScreen";
import SignupScreen from "./screens/SignupScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import LoginScreen from "./screens/LoginScreen";
import ChatScreen from "./screens/ChatScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ActiveChatsScreen from "./screens/ActiveChatsScreen";
import GalleryScreen from "./screens/GalleryScreen";
import { init, chat_adduser } from "./Fire";

// Initialize Firebase
init();
// chat_adduser("-LTDf7OQytzJHwBkMw22","HdT0Yveg9xeqrOUw87hU9hSHZ9b2","JW1cyxWx78bs42IuDkES9eITdw73");

// create our app"s navigation stack
const App = createSwitchNavigator(
  {
    LandingScreen,
    SignupScreen,
    ForgotPasswordScreen,
    LoginScreen,
    ChatScreen,
    SettingsScreen,
    ActiveChatsScreen,
    GalleryScreen,
  },
  {
    initialRouteName: "LandingScreen",
  },
);

export default App;
