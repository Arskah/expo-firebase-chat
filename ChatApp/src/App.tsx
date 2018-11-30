// import * as React from "react";
import { createSwitchNavigator } from "react-navigation";

import LandingScreen from "./screens/LandingScreen";
import SignupScreen from "./screens/SignupScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import LoginScreen from "./screens/LoginScreen";
// import ChatScreen from "./screens/ChatScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { init } from "./Fire";

init();

// create our app"s navigation stack
const App = createSwitchNavigator(
  {
    LandingScreen,
    SignupScreen,
    ForgotPasswordScreen,
    LoginScreen,
    // ChatScreen,
    SettingsScreen,
  },
  {
    initialRouteName: "LandingScreen",
  },
);

export default App;
