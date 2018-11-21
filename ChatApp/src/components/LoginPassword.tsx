import * as React from "react";
import Layout from '../constants/Layout';
import {Text, StyleSheet} from 'react-native';

export interface LoginPasswordProps {}
export interface LoginPasswordState {}

class LoginPassword extends React.Component<LoginPasswordProps, LoginPasswordState> {
  render() {
    return (
      <Text style={styles.loginPassword }>
        Login Password
      </Text>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  loginPassword: {
    flex: 1,
  },
});

export default LoginPassword;
