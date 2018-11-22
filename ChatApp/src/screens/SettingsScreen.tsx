import React, {Component} from 'react';
import {KeyboardAvoidingView, StyleSheet} from 'react-native';
import Wallpaper from '../components/Wallpaper';
import SettingPicture from '../components/SettingPicture';
import SettingName from '../components/SettingName';
import SettingResolution from '../components/SettingResolution';
import Layout from '../constants/Layout';

export default class SettingsScreen extends Component {

  public static navigationOptions = {
    title: 'Settings'
  }

  render() {
    return (
    <Wallpaper>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <SettingPicture/>
        <SettingName username="Erkki Erkkilä"/>
        <SettingResolution resolution="low"/>
      </KeyboardAvoidingView>
    </Wallpaper>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  container: {
    top: 30,
    width: DEVICE_WIDTH,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center"
  }
});

