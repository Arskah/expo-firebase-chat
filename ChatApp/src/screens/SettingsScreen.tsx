import React, {Component} from "react";
import {KeyboardAvoidingView, StyleSheet, Button} from "react-native";
import Wallpaper from "../components/Wallpaper";
import SettingPicture from "../components/SettingPicture";
import SettingName from "../components/SettingName";
import SettingResolution from "../components/SettingResolution";
import Layout from "../constants/Layout";
import firebase from "firebase";

export interface SettingsScreenProps {
  navigation: any
}
export interface SettingsScreenState {}

export default class SettingsScreen extends Component<SettingsScreenProps, SettingsScreenState> {

  public static navigationOptions = {
    title: "Settings",
  };

  logOutButton = () => {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
    }).catch(function (error) {
      // An error happened.
    });
  }

  render() {
    return (
    <Wallpaper>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <SettingPicture/>
        <SettingName username={firebase.auth().currentUser.email}/>
        <SettingResolution resolution="low"/>
      </KeyboardAvoidingView>
      <Button title="Sign out"
              onPress={this.logOutButton}
      >
      </Button>
    </Wallpaper>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
// const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  container: {
    top: 30,
    width: DEVICE_WIDTH,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
