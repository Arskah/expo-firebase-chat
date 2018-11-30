import React, {Component} from "react";
import {StyleSheet, ImageBackground} from "react-native";
const bgSrc = require("../assets/images/wallpaper.png");

export default class Wallpaper extends Component {
  render() {
    return (
      <ImageBackground style={styles.picture} source={bgSrc}>
        {this.props.children}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  picture: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: "cover",
  },
});
