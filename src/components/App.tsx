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

interface Item {
  id: string;
  title: string;
  user: string;
}

type user = firebase.User | null;

interface AppState {
  currentItem: string;
  username: string;
  items: Item[];
  user: user;
}

const anonUser = {
  displayName: "anon user",
  email: "fake@email.com",
  photoURL: "http://www.placepuppy.net/1p/400/250",
  uid: "zordie"
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
      if (user) {
        this.setState({ user });
      }
    });
    // -
    const itemsRef = firebase.database().ref(`/users/${this.state.user.uid}`);
    itemsRef.on("value", snapshot => {
      console.log("snapshot", snapshot);
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
  handleChange(e: React.FocusEvent<HTMLInputElement>) {
    switch (e.target.name) {
      case "username":
        this.setState({ username: e.target.value });
        break;
      case "currentItem":
        this.setState({ currentItem: e.target.value });
        break;
    }
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
      this.setState(
        {
          user
        },
        () => {
          const itemsRef = firebase
            .database()
            .ref(`/users/${this.state.user.uid}`);
          itemsRef.on("value", snapshot => {
            console.log("snapshot", snapshot);
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
      );
    });
  }
  render() {
    if (this.state.user) {
      console.log(this.state.user.photoURL);
    }
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
            <div className="container">
              <section className="add-item">
                <form onSubmit={this.handleSubmit}>
                  <input
                    type="text"
                    name="username"
                    placeholder="What's your name?"
                    onChange={this.handleChange.bind(this)}
                    value={this.state.user.displayName || this.state.user.email}
                  />
                  <input
                    type="text"
                    name="currentItem"
                    placeholder="What are you bringing?"
                    onChange={this.handleChange.bind(this)}
                    value={this.state.currentItem}
                  />
                  <button>Add Item</button>
                </form>
              </section>
              <section className="display-item">
                <div className="wrapper">
                  <ul>
                    {this.state.items.map((item: Item) => {
                      return (
                        <li key={item.id}>
                          <h3>{item.title}</h3>
                          <p>
                            brought by: {item.user}
                            {item.user === this.state.user.displayName ||
                            item.user === this.state.user.email ? (
                              <button onClick={() => this.removeItem(item.id)}>
                                Remove Item
                              </button>
                            ) : null}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
