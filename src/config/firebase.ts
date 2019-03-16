import firebase from "firebase";

const config = {
  apiKey: "AIzaSyAZC0dCiUMQJ0Ga8kWZdsoWy2u6Wj5V6bo",
  authDomain: "move-mountains.firebaseapp.com",
  databaseURL: "https://move-mountains.firebaseio.com",
  projectId: "move-mountains",
  storageBucket: "move-mountains.appspot.com",
  messagingSenderId: "742719727510"
};
firebase.initializeApp(config);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;
