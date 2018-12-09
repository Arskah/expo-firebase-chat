import React, { Fragment } from "react";
import { View, Text, StyleSheet, BackHandler, Image, FlatList } from "react-native";
import { GalleryImage, get_user_by_email, get_gallery_images } from "../Fire";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import firebase from "firebase";

export interface GalleryScreenProps {
  navigation: any;
}
export interface GalleryScreenState {
  images: GalleryImage[];
  resolution: "full" | "high" | "low",
  sort: "recent" | "label" | "author",
}

export default class GalleryScreen extends React.Component<GalleryScreenProps, GalleryScreenState> {
  chat_id: string;
  constructor(props: GalleryScreenProps) {
    super(props);
    const chat_id = this.props.navigation.getParam("chat_id", undefined);
    this.chat_id = chat_id;
    this.state = {
      images: [],
      resolution: undefined,
      sort: "recent",
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.navigate("ChatScreen", {chat_id: this.chat_id});
      return true;
    });
    if (firebase.auth()) {
      const user = firebase.auth().currentUser;
      get_user_by_email(user.email)
        .then((response: firebase.database.DataSnapshot) => {
          return response.val().resolution;
        })
        .then((resolution) => {
          get_gallery_images(this.chat_id, resolution, user.uid)
          .then((images) => {
            this.setState({
              resolution: resolution,
              images: images,
            });
          });
        })
        .catch((err) => console.error(err));
      } else {
      this.props.navigation.navigate("LoginScreen");
    }
  }

  componentDidUnMount() {
    BackHandler.removeEventListener("hardwareBackPress", () => { return; });
  }

  renderItem({ item }) {
    const image_source = item.image;
    const text = item.text;
    return (
      <View style={styles.list_item}>
        <Image source={{uri: image_source}} style={styles.image}></Image>
        <Text style={styles.text}>{text}</Text>
      </View>
    );
  }

  render() {
    const { images, resolution, sort } = this.state;
    let image_text: Array<{
      key: string,
      image: string,
      text: string,
    }>;
    if (sort === "label") {
      image_text = images.map((elem, index) => {
        return {
          key: index.toString(),
          image: elem.image,
          text: elem.label,
        };
      });
    } else if (sort === "author") {
      image_text = images.map((elem, index) => {
        return {
          key: index.toString(),
          image: elem.image,
          text: elem.author,
        };
      });
    } else {
      image_text = images.map((elem, index) => {
        return  {
          key: index.toString(),
          image: elem.image,
          text: elem.created,
        };
      });
    }
    return (
      <FlatList
        contentContainerStyle={styles.list}
        data={image_text}
        renderItem={this.renderItem}
      />
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
// const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  list_item: {
    flex: 1,
    margin: 5,
    minWidth: 170,
    maxWidth: 223,
    height: 304,
    maxHeight: 304,
  },
  list: {
    justifyContent: "center",
    flexDirection: "row",
    // flexWrap: "wrap",
  },
  image: {
    width: 170,
    height: 304,
  },
  text: {
    padding: 20,
    color: Colors.black,
  },
});
