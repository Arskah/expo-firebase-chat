import * as React from "react";
import Layout from '../constants/Layout';
import Colors from "../constants/Colors";
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from "react-native";
import Dialog from "react-native-dialog";

export interface SettingNameProps {
  displayname: string,
  dialogVisible: boolean,
  showDialog: any,
  handleCancel: any,
  handleSubmit: any,
  handleChange: any
}
export interface SettingNameState {}

class SettingName extends React.Component<SettingNameProps, SettingNameState> {
  render() {
    return (
      <View>
        <TouchableOpacity style={styles.settingNameButton} onPress={this.props.showDialog}>
          <Text style={styles.settingNameText}>Display name: {this.props.displayname}</Text>
        </TouchableOpacity>
        <Dialog.Container visible={this.props.dialogVisible}>
          <Dialog.Title>Change Display name</Dialog.Title>
          <Dialog.Input label="Display name:" defaultValue={this.props.displayname} onChangeText={(name: string) => this.props.handleChange(name)} />
          <Dialog.Button label="Cancel" onPress={this.props.handleCancel} />
          <Dialog.Button label="Submit" onPress={this.props.handleSubmit} />
        </Dialog.Container>
      </View>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
// const DEVICE_HEIGHT = Layout.window.height;

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
  },
});

export default SettingName;
