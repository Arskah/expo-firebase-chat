import * as React from "react";
import Layout from '../constants/Layout';
import Colors from "../constants/Colors";
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

export interface SettingResolutionProps {
  resolution: string;
}
export interface SettingResolutionState {
  resolution: string;
}

class SettingResolution extends React.Component<SettingResolutionProps, SettingResolutionState> {
  constructor(props: any) {
    super(props);
    this.state = {
      resolution: props.resolution,
    };
  }
  render() {
    return (
      <TouchableOpacity
      style={styles.settingResolutionButton} 
      onPress={() => alert("Change resolution")}>
      <Text style={styles.settingResolutionText}>Resolution: {this.state.resolution}</Text>
    </TouchableOpacity> 
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
// const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  settingResolutionButton: {
    backgroundColor: Colors.darkBlue,
    padding: 20,    
    width: DEVICE_WIDTH,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  settingResolutionText: {
    color: Colors.white,
    textAlign: 'center',
  }
});

export default SettingResolution;
