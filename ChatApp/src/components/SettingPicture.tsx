import * as React from "react";
import Layout from "../constants/Layout";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Dialog from "react-native-dialog";
const default_image = require("../assets/images/robot-dev.png");

export interface SettingPictureProps {
  visible: boolean,
  image: string,
  handlePush: any,
  handleCancel: any,
  pickCamera: any,
  pickGallery: any,
}
export interface SettingPictureState {
  dialogVisible: boolean
}

class SettingPicture extends React.Component<SettingPictureProps, SettingPictureState> {

  constructor(props: SettingPictureProps) {
    super(props);
    this.state = {
      dialogVisible: false,
    };
  }

  render() {

    return (
      <View>
        <TouchableOpacity
          style={styles.container}
          onPress={this.props.handlePush}>
          {this.displayImage(this.props.image)}
        </TouchableOpacity>
        <Dialog.Container visible={this.props.visible}>
          <Dialog.Title>Pick new picture from</Dialog.Title>
          <Dialog.Button label="Gallery" onPress={this.props.pickGallery} />
          <Dialog.Button label="Camera" onPress={this.props.pickCamera} />
          <Dialog.Button label="Cancel" onPress={this.props.handleCancel} />
        </Dialog.Container>
      </View>
    );
  }

  displayImage(image: string) {
    
    if(image !== ""){
      console.log(image)
      return <Image source={{ uri: image }} style={styles.image} />;
    }
    return <View></View>
    
}

}
const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  container: {
    width: DEVICE_WIDTH,
  },
  image: {
    resizeMode: "cover",
    justifyContent: "center",
    alignSelf: "center",
    width: 150,
    height: 150,
  },
});

export default SettingPicture;
