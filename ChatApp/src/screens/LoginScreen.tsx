import React, {Component} from "react";
import LoginForm from "../components/LoginForm";
import Wallpaper from "../components/Wallpaper";
import SignupSection from "../components/SignupSection";

export interface LoginScreenProps {
  navigation: any
}
export interface LoginScreenState {}

export default class LoginScreen extends Component<LoginScreenProps, LoginScreenState> {

  render() {
    return (
      <Wallpaper>
        <LoginForm />
        <SignupSection />
      </Wallpaper>
    );
  }
}
