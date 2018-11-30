import firebase from "firebase";
import { Alert } from "react-native";
import { ENV } from "../environment";
import { FileSystem } from "expo";

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

const defaultPicture = "gs://mcc-fall-2018-g13.appspot.com/robot-prod.png";
const defaultResolution = "full";

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
export const chat_create = (name, username) => {
  let postData = {
    title: name,
    lastMessage: "",
  };
  let new_key = fb_db.ref().child("chats").push().key;
  let updates = {};
  // Add
  updates[`/chats/${new_key}/`] = postData;
  updates[`/members/${new_key}/${username}`] = true;
  return fb_db.ref().update(updates);
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
export const image_upload = async (image_path: string) => {

  const blob = await urlToBlob(image_path);
  let ref = firebase.storage().ref("pictures").child("my-image");
  return ref.put(blob).snapshot.downloadURL;

};

export const image_upload_chat = (chat_id, image_path) => {
  return;
};

export const image_upload_profile = (user_id, image_path) => {
  return;
};

function urlToBlob(url) {
  return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.onerror = reject;
      xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
              resolve(xhr.response);
          }
      };
      xhr.open("GET", url);
      xhr.responseType = "blob"; // convert type
      xhr.send();
  });
}

// params are the mandatory info, not sure yet
export const user_create = (username, email, password) => {
  get_user_by_name(username).then((user_profile) => {
    // Check if username is free
    console.log("pöö");
    if (!user_profile) {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch((error) => {
          const errorMessage = error.message;
          Alert.alert(errorMessage);
        })
        .then((user) => {
          console.log(user);
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
  const user_promise = get_user_by_name(username).then(function (user_profile) {
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

export const get_user_by_name = async (username) => {
  console.log("test");
  return new Promise((resolve, reject) => {
    firebase.database().ref().child("users").orderByChild("displayName")
      .equalTo(username).on("value", (snapshot) => {
        console.log("snapshot: " + snapshot);
        snapshot.forEach((data) => {
          console.log(data);
          resolve(data.val());
        });
        resolve(undefined);
    });
  });
};

// results
export const user_search = async (search_term) => {
  return;
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
