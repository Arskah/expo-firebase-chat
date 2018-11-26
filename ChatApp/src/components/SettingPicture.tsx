import * as React from "react";
import Layout from '../constants/Layout';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { Asset, ImagePicker, Permissions } from 'expo'
import default_image from '../../assets/images/robot-dev.png'
import Dialog from 'react-native-dialog';

export interface SettingPictureProps {
  image : string
}
export interface SettingPictureState {
  image : string,
  dialogVisible: boolean
}

class SettingPicture extends React.Component<SettingPictureProps, SettingPictureState> {

  constructor(props: any) {
    super(props);
    this.state = {
      image: props.image || "",
      dialogVisible: false
    };
  }

  showDialog = () => {
    this.setState({ dialogVisible: true });
  };

  handleCancel = () => {
    this.setState({ dialogVisible: false});
  };

  pickFromGallery = async () => {
    this.setState({ dialogVisible: false});
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);
    if(!result.cancelled){this.setState({image: result.uri})}
  };


  pickFromCamera = async () => {
    this.setState({ dialogVisible: false});
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
  
      console.log(result);
      if(!result.cancelled){this.setState({image: result.uri})}
    }

  };


  render() {

    return (
      <View>
        <TouchableOpacity
          style={styles.container} 
          onPress={() => this.showDialog()}>
          {this.displayImage()}
        </TouchableOpacity> 
        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>Pick new picture from</Dialog.Title>
          <Dialog.Button label="Gallery" onPress={this.pickFromGallery} />
          <Dialog.Button label="Camera" onPress={this.pickFromCamera} />
          <Dialog.Button label="Cancel" onPress={this.handleCancel} />
        </Dialog.Container>
      </View>
    );
  }

  displayImage() {
    if (this.state.image === "") {
      return <Image source={default_image} style={styles.image} />
    } else {
      return <Image source={{ uri: this.state.image }} style={styles.image} />
    }
}

}
const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  container: { 
    width: DEVICE_WIDTH,
  },
  image: {
    resizeMode: 'cover',
    justifyContent: 'center',
    alignSelf: "center",
    width: 150,
    height: 150
  },
});

export default SettingPicture;
