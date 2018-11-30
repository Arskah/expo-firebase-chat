import React, { Component } from "react";
import {BackHandler, View} from "react-native";
import Wallpaper from "../components/Wallpaper";
import SignupForm from "../components/SignupForm";

export interface SignupScreenProps {
  navigation: any
}
export interface SignupScreenState { }
export default class SignupScreen extends Component<SignupScreenProps, SignupScreenState> {
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.navigate("LoginScreen");
      return true;
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", () => { return; });
  }

  render() {
    return (
      <Wallpaper>
        <SignupForm />
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
