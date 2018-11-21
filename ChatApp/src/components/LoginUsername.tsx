import * as React from "react";
import Layout from '../constants/Layout';
import {Text, StyleSheet} from 'react-native';

export interface LoginUsernameProps {}
export interface LoginUsernameState {}

class LoginUsername extends React.Component<LoginUsernameProps, LoginUsernameState> {
  render() {
    return (
      <Text style={styles.loginUsername }>
        Login Username
      </Text>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  loginUsername: {
    flex: 1,
  },
});

export default LoginUsername;
