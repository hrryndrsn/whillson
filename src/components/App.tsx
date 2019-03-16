import React, { Component, FormEvent } from "react";
import "../css/App.css";
import Container from "./Container";
import Nav from "./Nav";
import "firebase/auth";
import "firebase/database";
import * as firebase from "firebase";
import * as firebaseui from "firebaseui";
import firebaseApp, { auth, provider } from "../config/firebase";
import { string } from "prop-types";

export interface UserSession {
  id: string;
  displayName: string;
  photoUrl: string;
  Email: string;
  hillCharts: HillChart[];
}
export interface HillChart {
  id: string;
  name: string;
  points: Pt[];
}

export interface Pt {
  x: number;
  y: number;
  tag: string;
  color: string;
  tagPlacement: number;
}

export interface AppState {
  user: user;
  session: UserSession;
}

type user = firebase.User | null;

const anonUser = {
  uid: "123",
  displayName: "anon user",
  email: "fake@email.com",
  photoURL: "http://www.placepuppy.net/1p/400/250"
};

class App extends Component {
  state = {
    currentItem: "",
    username: "",
    items: [],
    user: anonUser
  };
  componentDidMount() {
    //persist login accross refresh
    auth.onAuthStateChanged(user => {
      //check if there is a user cached.
      if (user) {
        this.setState({ user });
        // - lookup the user up in the db and return a reference
        const userRef = firebase
          .database()
          .ref(`/users/${this.state.user.uid}`);
        userRef.on("value", snapshot => {
          let newState = [];
          if (snapshot) {
            let items = snapshot.val(); //grab all values in the snapshot
            for (let item in items) {
              newState.push({
                id: item,
                title: items[item].title,
                user: items[item].user
              });
            }
          }
          this.setState(
            {
              items: newState
            },
            () => {
              console.log("loaded state from db->", this.state.items);
            }
          );
        });
      }
    });
  }

  handleSubmit = (e: React.FocusEvent<HTMLFormElement>) => {
    e.preventDefault();
    //find existing object called items and return the reference
    const itemsRef = firebase.database().ref(`/users/${this.state.user.uid}`);
    // we grab the item the user typed in (as well as their username) from // he state, and package it into an object so we ship it off to our ///// Firebase database.
    console.log("item ref", itemsRef);
    itemsRef.on("value", snapshot => {
      console.log("snapshot", snapshot);
      let newState = [];
      if (snapshot) {
        let items = snapshot.val(); //grab all values in the snapshot
        for (let item in items) {
          newState.push({
            id: item,
            title: items[item].title,
            user: this.state.user.displayName
          });
        }
      }
      this.setState({
        items: newState
      });
    });
    const item = {
      title: this.state.currentItem,
      user: this.state.username
    };
    // similar to the Array.push method, this sends a copy of our object  /// so that it can be stored in Firebase.
    itemsRef.push(item);
    //reset the form values and state.
    this.setState({
      currentItem: "",
      username: ""
    });
  };
  removeItem(itemId: string) {
    // find the id in the db and return a reference
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    // delete using the reference
    itemRef.remove();
  }

  logOut() {
    auth.signOut().then(() => {
      this.setState({
        user: anonUser
      });
    });
  }

  logIn() {
    auth.signInWithPopup(provider).then(result => {
      const user = result.user;
      this.setState({
        user
      });
      const userRef = firebase.database().ref(`/users/${this.state.user.uid}`);
      console.log(userRef);
    });
  }
  render() {
    return (
      <div className="App">
        <header>
          <div className="wrapper">
            <h1>Fun Food Friends</h1>
            {this.state.user == anonUser ? (
              <button onClick={this.logIn.bind(this)}>Log in</button>
            ) : (
              <button onClick={this.logOut.bind(this)}>Log out</button>
            )}
          </div>
        </header>
        {this.state.user == anonUser ? (
          <div>
            <p>You must be logged in to see the potluck tings</p>
          </div>
        ) : (
          <div>
            <div className="user-profile">
              <div className="user-profile">
                <img src={this.state.user.photoURL} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
