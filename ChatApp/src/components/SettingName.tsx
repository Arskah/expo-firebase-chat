import * as React from "react";
import Layout from '../constants/Layout';
import Colors from "../constants/Colors";
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';

export interface SettingNameProps {}
export interface SettingNameState {
  username: string
}

const onPressLogin = (state) => {
  const {username} = state;
  alert("Change "+username)
}


class SettingName extends React.Component<SettingNameProps, SettingNameState> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: props.username,
    };
  }
  render() {
    return (
      <TouchableOpacity
      style={styles.settingNameButton} 
      onPress={() => onPressLogin(this.state)}>
      <Text style={styles.settingNameText}>Username: {this.state.username}</Text>
    </TouchableOpacity> 
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  settingNameButton: {
    backgroundColor: Colors.darkBlue,
    padding: 20,    
    width: DEVICE_WIDTH,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  settingNameText: {
    color: Colors.white,
    textAlign: 'center',
  }
  
});

export default SettingName;
