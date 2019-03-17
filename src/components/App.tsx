import React, { Component, FormEvent } from "react";
import "../css/App.css";
import Container from "./Container";
import Nav from "./Nav";
import "firebase/auth";
import "firebase/database";
import * as firebase from "firebase";
import firebaseApp, { auth, provider } from "../config/firebase";
//-----------------------------------------------------

export interface Account {
  uid: string;
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
  account: Account;
}

type user = firebase.User | null;

// -----------------------------------------------
const anonUser = {
  uid: "123",
  displayName: "anon user",
  email: "fake@email.com",
  photoURL: "http://www.placepuppy.net/1p/400/250"
};
const loggedOutAccount: Account = {
  uid: "456",
  hillCharts: []
};
//------------------------------------------------
class App extends Component<{}, {}> {
  state = {
    user: anonUser,
    account: loggedOutAccount
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
          .ref(`/accounts/${this.state.user.uid}`);
        // read the value of the user ref and update account state.
        userRef.once("value", snapshot => {
          if (snapshot.val()) {
            let newState = snapshot.val();
            this.setState({
              account: {
                uid: newState.object.uid,
                hillCharts: newState.object.hillCharts
              }
            });
          }
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
    const item = {};
    // similar to the Array.push method, this sends a copy of our object  /// so that it can be stored in Firebase.
    itemsRef.push(item);
    //reset the form values and state.
    this.setState({
      currentItem: "",
      username: ""
    });
  };
  //remove an item from the db
  removeItem(itemId: string) {
    // find the id in the db and return a reference
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    // delete using the reference
    itemRef.remove();
  }

  logOut() {
    auth.signOut().then(() => {
      this.setState({
        user: anonUser,
        account: loggedOutAccount
      });
    });
  }

  logIn() {
    auth.signInWithPopup(provider).then(result => {
      const user = result.user;
      //update the user in state
      this.setState(
        {
          user
        },
        () => {
          //after setting the user into state
          //search for that user in the db to find our create an account
          const userRef = firebase
            .database()
            .ref(`/accounts/${this.state.user.uid}`)
            .once("value")
            .then(snapshot => {
              // look at datasnapshot that came back
              if (snapshot.val()) {
                // there is an existing user account
                console.log("user found in db ->", snapshot.val());
                const data = snapshot.val();
                this.setState({
                  account: data.object
                });
              } else {
                // there is no user account
                //create new account for this user
                const account: Account = {
                  uid: this.state.user.uid,
                  hillCharts: []
                };
                //save the new account to the
                let path = "accounts/" + this.state.user.uid;
                this.setDBEntry(path, account);
                this.setState({
                  account
                });
              }
            });
        }
      );
    });
  }
  setDBEntry = async (path: string, object: any) => {
    await firebase
      .database()
      .ref(path)
      .set({
        object
      }); // returns nothing
  };
  findDBEntry = async (path: string) => {
    const datasnapshot = await firebase
      .database()
      .ref(path)
      .once("value"); // returns datasnapshot
    const val = await datasnapshot.val(); // find the actual value
    return val;
  };

  render() {
    return (
      <div className="App">
        //Nav
        <header>
          <div className="wrapper">
            <h1>Move Mountains</h1>
            {this.state.user == anonUser ? (
              <button onClick={this.logIn.bind(this)}>Log in</button>
            ) : (
              <button onClick={this.logOut.bind(this)}>Log out</button>
            )}
          </div>
        </header>
        //Main page
        {this.state.user == anonUser ? (
          ///
          /// No logged in User
          <div>
            <p>You must be logged in to see the potluck tings</p>
          </div>
        ) : (
          //
          // <user cmo>
          <div>
            <div className="user-profile">
              <div className="user-profile">
                <img src={this.state.user.photoURL} />
                <p>{this.state.user.displayName}</p>
                <p>{this.state.user.uid}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
