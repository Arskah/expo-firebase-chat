import React, { Component } from "react";
import {BackHandler, View} from "react-native";
import UserSearch from "../components/UserSearch";
import SignupForm from "../components/SignupForm";
import Wallpaper from "../components/Wallpaper";
import { Font, AppLoading } from 'expo'
import { MaterialIcons } from '@expo/vector-icons'
import CustomHeader from "../components/CustomHeader";

export interface SignupScreenProps {
  navigation: any
}
export interface SignupScreenState { 
  fonts: boolean
}
export default class SignupScreen extends Component<SignupScreenProps, SignupScreenState> {
  constructor(props){
    super(props);
    this.state = {
      fonts: false
    }
  }
  async componentWillMount() {
    await Font.loadAsync({'MaterialIcons': require('@expo/vector-icons/fonts/MaterialIcons.ttf')}) 
    this.setState({ fonts: true })
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.navigate("ActiveChatsScreen");
      return true;
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", () => { return; });
  }

  render() {
    return !this.state.fonts ? (<AppLoading/>) : (
      <Wallpaper>
        <CustomHeader text={"Search users and add them to chats"} navigation={this.props.navigation} />
        <UserSearch />
        <View style={
          {
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-around",
            top: 20,
            marginBottom: 300,
            alignItems: "center",
          }} />
      </Wallpaper>
    );
  }
}
