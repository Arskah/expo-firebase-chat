import React, { Fragment } from "react";
import { View, Text, StyleSheet, BackHandler, Image, SectionList, Button } from "react-native";
import { GalleryImage, get_user_by_email, get_gallery_images, get_user } from "../Fire";
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
      sort: "author",
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.navigate("ChatScreen", {chat_id: this.chat_id});
      return true;
    });
    if (firebase.auth()) {
      const user = firebase.auth().currentUser;
      get_user(user.email, "email")
        .then((response: firebase.database.DataSnapshot) => {
          return response.val().resolution;
        })
        .then((resolution) => {
          get_gallery_images(this.chat_id, resolution)
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
    // const text = item.text;
    return (
      <View style={styles.list_item}>
        <Image source={{uri: image_source}} style={styles.image}></Image>
      </View>
    );
  }

  arrayToObject = (array, keyField) =>
    array.reduce((obj, item) => {
      obj[item[keyField]] = item
      return obj
    }, {})

  handleOnPress = (sort_by) => {
    this.setState({sort: sort_by});
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
          text: elem.created.split("T")[0],
        };
      });
    }

    let image_titles = image_text.map(element => {
       return element.text;
    });

    let sectionData = image_titles.map(element => {
      return {title: element, data: []};
    });

    let sectionDataObj = this.arrayToObject(sectionData, "title");
    image_text.forEach(element => {
      if (element){
        sectionDataObj[element.text].data.push(element);  
      }
    });
    let finalSections = [];
    Object.keys(sectionDataObj).forEach(function(key) {
      finalSections.push(sectionDataObj[key]);
    });

    console.log(finalSections);
    return (
      <View style={styles.container}>
        <View style={styles.sortButtons}>
          <Button 
            style={styles.sortButton}
            title= {"AUTHOR"}
            onPress={() => this.handleOnPress("author")}
          ></Button>
          <Button
            style={styles.sortButton}
            title= {"LABEL"}
            onPress={() => this.handleOnPress("label")}
          ></Button>
          <Button 
            style={styles.sortButton}
            title= {"CREATED"}
            onPress={() => this.handleOnPress("created")}
          ></Button>
        </View>
        <SectionList
          contentContainerStyle={styles.list}
          sections={finalSections}
          renderItem={this.renderItem}
          renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>
          {section.title} </Text>}
        />
        
      </View>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    flexDirection: "column",
  },
  list_item: {
    flex: 1,
    margin: 5,
    alignItems: "center",
    // minWidth: 170,
    // maxWidth: 223,
    // height: 304,
    // maxHeight: 304,
  },
  list: {
    // justifyContent: "flex-start",
    flexDirection: "row" ,
    alignItems: "stretch",
    flexWrap: "wrap",
    paddingTop: 20,
  },
  image: {
    width: 150,
    height: 150,
  },
  text: {
    padding: 20,
    color: Colors.black,
  },
  sectionHeader: {
    flex: 1,
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    width: DEVICE_WIDTH,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  sortButton: {
    width: DEVICE_WIDTH/3,
    alignSelf: "center",

  },
  sortButtons: {
    height: 25,
    flexDirection: "row",
    justifyContent: "center",
  }
});
