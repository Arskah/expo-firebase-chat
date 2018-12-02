// import * as React from "react";
import { createSwitchNavigator } from "react-navigation";

import LandingScreen from "./screens/LandingScreen";
import SignupScreen from "./screens/SignupScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import LoginScreen from "./screens/LoginScreen";
import ChatScreen from "./screens/ChatScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { init } from "./Fire";
// import {
//   init, chat_create, chat_adduser, chat_send, chat_leave, get_chat_message, chat_images,
//   image_get_raw, image_get, image_upload, image_upload_chat, image_upload_profile,
//   user_create, user_state_change, user_login, user_login_email,
//   get_user_by_name, user_search, settings_get, settings_set, profile_picture_set
// } from "./Fire";

init();
// chat_create("Test", "Arska");
// chat_send("-LSbVSWNMpzDZFF_j01_", "Testiviesti", "Arska").then(() => {
//   chat_adduser("-LSbVSWNMpzDZFF_j01_", "Tommi", "Arska");
// });
// chat_leave("-LSbVSWNMpzDZFF_j01_", "Tommi");

// create our app"s navigation stack
const App = createSwitchNavigator(
  {
    LandingScreen,
    SignupScreen,
    ForgotPasswordScreen,
    LoginScreen,
    ChatScreen,
    SettingsScreen,
  },
  {
    initialRouteName: "LandingScreen",
  },
);

export default App;
