import * as React from "react";
import { TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView } from "react-native";
import Layout from "../constants/Layout";
import Colors from "../constants/Colors";
import { withNavigation } from "react-navigation";
import { user_state_change, user_login, user_login_email } from "../Fire";

export interface LoginFormProps {
  navigation: any;
}
export interface LoginFormState {
  login: string;
  password: string;
}

class LoginForm extends React.Component<LoginFormProps, LoginFormState> {
  constructor(props: LoginFormProps) {
    super(props);
    this.state = {
      login: "",
      password: "",
    };
  }

  componentDidMount = () => {
    user_state_change((user) => {
      if (user) {
        this.props.navigation.navigate("SettingsScreen");
      }
    });
  }

  handleOnPress = () => {
    const { login, password } = this.state;
    // Node validator package's validator for email.
    const regex = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;   // tslint:disable:max-line-length
    if (regex.test(login)) {
      user_login_email(login, password);
    } else {
      user_login(login, password);
    }
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <TextInput
          onChangeText={(text) => this.setState({ login: text })}
          style={styles.loginUsername}
          autoFocus={true}
          placeholder={"Username or email"} />
        <TextInput
          onChangeText={(text) => this.setState({ password: text })}
          secureTextEntry={true}
          placeholder={"Password"}
          style={styles.loginPassword} />
        <TouchableOpacity
          style={styles.loginButton}
          onPress={this.handleOnPress}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
// const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  container: {
    flex: 3,
    top: 30,
    width: DEVICE_WIDTH,
    padding: 20,
    justifyContent: "space-around",
  },
  loginUsername: {
    fontSize: 20,
    color: Colors.white,
    padding: 0,
    backgroundColor: "transparent",
  },
  loginPassword: {
    fontSize: 20,
    color: Colors.white,
    padding: 0,
    backgroundColor: "transparent",
  },
  loginButton: {
    backgroundColor: Colors.darkBlue,
    padding: 20,
  },
  loginText: {
    color: Colors.white,
    textAlign: "center",
  },
});

export default withNavigation(LoginForm);
