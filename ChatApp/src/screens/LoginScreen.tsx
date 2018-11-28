import React, {Component} from 'react';
import LoginForm from '../components/LoginForm';
import Wallpaper from '../components/Wallpaper';
import SignupSection from '../components/SignupSection';

export default class LoginScreen extends Component {
  render() {
    return (
      <Wallpaper>
        <LoginForm />
        <SignupSection />
      </Wallpaper>
    );
  }
}
