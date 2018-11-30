import firebase from "firebase";
import { Alert } from "react-native";
import { ENV } from "../environment";

/*
  - /chats/
    - chat_id
      - title
      - lastMessage
  - /users/
    - user_id
      - displayName
      - email
      - resolution
      - picture
  - /members/
    - chat_id
      - displayName1: false
      - dispalyName2: true
      - ... (TODO: decide what is the best way to handle users) displayNames are unique, but still...
  - /messages/
    - chat_id
      - message_id
        - author (displayName)
        - message
*/

let fb_app = undefined;
let fb_db = undefined;

const defaultPicture = undefined;
const defaultResolution = undefined;

export const init = () => {
  const config = {
    apiKey: ENV.APIKEY,
    authDomain: ENV.AUTH_DOMAIN,
    databaseURL: ENV.DB_URL,
    projectId: ENV.PID,
    storageBucket: ENV.SBUCKET,
    messagingSenderId: ENV.SEND_ID,
  };
  fb_app = firebase.initializeApp(config);
  fb_db = firebase.database();
};

// Create new chatroom
export const chat_create = (name) => {
  let postData = {
    title: name,
    lastMessage: "",
  };
  let new_key = fb_db.ref().child("chats").push().key;
  let updates = {};
};

// Add new user to chatroom
export const chat_adduser = (chat_id, user_id) => {
  return;
};

// Send a message in chat
// reference images with some funky syntax
export const chat_send = (chat_id, message, author) => {
  let postData = {
    author: author,
    message: message,
  };
  let new_key = fb_db.ref().child("messages").push().key;
  let updates = {};
  updates[`/chats/${chat_id}/lastMessage/`] = `${author}: ${message}`;
  updates[`/messages/${chat_id}/${new_key}/`] = postData;
  return fb_db.ref().update(updates);
};

// Leave chatroom
export const chat_leave = (chat_id) => {
  return;
};

export const get_chat_message = (chat_id) => {
  return;
};

// retrieve list of images on given chat
export const chat_images = (chat_id, sort?) => {
  return;
};

// get image with given resolution
export const image_get_raw = (image_url, resolution) => {
  return;
};

// same as above but with settings mandated resolution
export const image_get = (image_url) => {
  return;
};

// upload image to firebase => get image url
export const image_upload = (chat_id, image_path) => {
  return;
};

// params are the mandatory info, not sure yet
export const user_create = (username, email, password) => {
  user_search(username).then((user_profile) => {
    // Check if username is free
    if (!user_profile) {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch((error) => {
          const errorMessage = error.message;
          Alert.alert(errorMessage);
        })
        .then((user) => {
          if (user) {
            // Create userprofile on authentication success
            let postData = {
              displayName: username,
              email: email,
              resolution: defaultResolution,
              picture: defaultPicture,
            };
            // Also set user membership in all chats as false
            let new_key = fb_db.ref().child("users").push().key;
            let updates = {};
            updates[`/users/${new_key}`] = postData;
            // TODO: Not sure if .on() is the correct method...
            // If we see missing chatrooms after new chat room creation this may be the issue
            fb_db.ref().child("chats").on("value", (snapshot) => {
              updates["members/" + snapshot.key + `/${username}`] = false;
            });
            fb_db.ref().update(updates);
          }
        });
    } else {
      Alert.alert("Username is already in use!");
    }
  });

};

export const user_state_change = (callback) => {
  firebase.auth().onAuthStateChanged(callback);
};

// true on success + false on fail
// TODO: Possible need to add callback as parameter for redirections etc.
export const user_login = (username, passwd) => {
  user_search(username).then((user_profile) => {
    if (user_profile) {
      user_login_email(user_profile.email, passwd);
    }
  });
};

export const user_login_email = (email, passwd) => {
  firebase.auth().signInWithEmailAndPassword(email, passwd)
    .catch((error) => {
      // var errorCode = error.code;
      const errorMessage = error.message;
      Alert.alert(errorMessage);
    });
};

// results
export const user_search = async (search_term) => {
  const user = "";
  return user;
};

// value
export const settings_get = (key) => {
  return;
};

// value
export const settings_set = (key, value) => {
  return;
};

export const profile_picture_set = () => {
  return;
};

// SETTINGS_KEYS
// -------------
// DISPLAY_NAME
// RESOLUTION
