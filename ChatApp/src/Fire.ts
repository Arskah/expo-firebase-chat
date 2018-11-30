import firebase from "firebase";

const login = (username: string, password: string) => {
  firebase.auth().signInWithEmailAndPassword(username, password).catch(function(error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    return false;
  });
  return true;
};

// Create new chatroom
const chat_create = (name) => {
  return;
};

// Add new user to chatroom
const chat_add = (chat_id, user_id) => {
  return;
};

// Send a message in chat
// reference images with some funky syntax
const chat_send = (chat_id, message) => {
  return;
};

// Leave chatroom
const chat_leave = (chat_id) => {
  return;
};

// retrieve list of images on given chat
const chat_images = (chat_id, sort?) => {
  return;
};

// get image with given resolution
const image_get_raw = (image_url, resolution) => {
  return;
};

// same as above but with settings mandated resolution
const image_get = (image_url) => {
  return;
};

// upload image to firebase => get image url
const image_upload = (chat_id, image_path) => {
  return;
};

// params are the mandatory info, not sure yet
const user_create = () => {
  return;
};

// true on success + false on fail
// TODO: Possible need to add callback as parameter for redirections etc.
const user_login = (username, passwd) => {
  return;
};

// results
const user_search = (search_term) => {
  return;
};

// value
const settings_get = (key) => {
  return;
};

// value
const settings_set = (key, value) => {
  return;
};

const profile_picture_set = () => {
  return;
};

// SETTINGS_KEYS
// -------------
// DISPLAY_NAME
// RESOLUTION
