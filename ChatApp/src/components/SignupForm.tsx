import * as React from "react";
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Layout from "../constants/Layout";
import Colors from "../constants/Colors";
import { withNavigation } from "react-navigation";
import { user_create, user_state_change } from "../Fire";

export interface SignupFormProps {
  navigation: any;
}
export interface SignupFormState {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

class SignupForm extends React.Component<SignupFormProps, SignupFormState> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password1: "",
      password2: "",
    };
  }

  componentDidMount() {
    user_state_change((user) => {
      if (user) {
        this.props.navigation.navigate("SettingsScreen");
      }
    });
  }

  createAccount = () => {
    const { username, email, password1, password2 } = this.state;
    if (password1 === password2) {
      user_create(username, email, password1);
    } else {
      Alert.alert("Passwords do not match");
    }
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.signupForm}>
        <TextInput
          onChangeText={(text) => this.setState({ username: text })}
          style={styles.signupUsername} autoFocus={true}
          returnKeyType={"next"}
          // onSubmitEditing={() => { this.InputRef2.focus(); } }
          placeholder={"Username"} />
        <TextInput
          onChangeText={(text) => this.setState({ email: text })}
          style={styles.signupUsername}
          returnKeyType={"next"}
          // onSubmitEditing={() => { this.InputRef3.focus(); }}
          // ref={ (input) => { this.InputRef2 = input }}
          placeholder={"Email"} />
        <TextInput
          onChangeText={(text) => this.setState({ password1: text })}
          secureTextEntry={true}
          returnKeyType={"next"}
          // onSubmitEditing={() => { this.InputRef4.focus(); }}
          // ref={(input) => { this.InputRef3 }}
          placeholder={"Password"}
          style={styles.signupPassword} />
        <TextInput
          onChangeText={(text) => this.setState({ password2: text })}
          secureTextEntry={true}
          returnKeyType={"next"}
          onSubmitEditing={this.createAccount}
          placeholder={"Re-type password"}
          style={styles.signupPassword} />
        <TouchableOpacity onPress={this.createAccount} style={styles.button}>
          <Text style={styles.text}>Create Account</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
// const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  signupForm: {
    flex: 3,
    flexDirection: "column",
    top: 30,
    width: DEVICE_WIDTH,
    padding: 20,
    justifyContent: "space-around",
  },
  signupUsername: {
    fontSize: 20,
    color: Colors.white,
    backgroundColor: "transparent",
  },
  signupPassword: {
    fontSize: 20,
    color: Colors.white,
    backgroundColor: "transparent",
  },
  button: {
    top: 50,
    backgroundColor: Colors.darkBlue,
    padding: 20,
  },
  text: {
    color: Colors.white,
    textAlign: "center",
  },
});

export default withNavigation(SignupForm);
