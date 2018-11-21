import React, {Component} from 'react';
import Layout from '../constants/Layout';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Colors from '../constants/Colors';

const pressCreateAccount = () => {

}

const pressForgotPassword = () => {

}

export default class SignupSection extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={pressCreateAccount}>
          <Text style={styles.text}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={pressForgotPassword}>
          <Text style={styles.text}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: DEVICE_WIDTH,
    top: 20,
    marginBottom: 300,
    alignItems: 'center',
  },
  text: {
    color: Colors.white,
  },
});
