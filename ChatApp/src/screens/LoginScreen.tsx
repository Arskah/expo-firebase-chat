import React, {Component} from 'react';
// import Logo from '../components/Login/Logo';
import LoginUsername from '../components/LoginUsername';
import LoginPassword from '../components/LoginPassword';
import Wallpaper from '../components/Wallpaper';
// import ButtonLogin from '../components/LoginButton';
import SignupSection from '../components/SignupSection';

export default class LoginScreen extends Component {
  render() {
    return (
      <Wallpaper>
        {/* <Logo /> */}
        <LoginUsername />
        <LoginPassword />
			  {/* <ButtonLogin /> */}
        <SignupSection />
      </Wallpaper>
    );
  }
}
