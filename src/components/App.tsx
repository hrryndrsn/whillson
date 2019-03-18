import React, { Component, FormEvent } from "react";
import "../css/App.css";
import Container from "./Container";
import Nav from "./NavWithLogin";
import "firebase/auth";
import "firebase/database";
import * as firebase from "firebase";
import firebaseApp, { auth, provider } from "../config/firebase";
import styled from "styled-components";
import NavWithLogin from "./NavWithLogin";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import HillChartBrowser from "./HillchartBrowser";

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
  user: firebase.User | null; // the currently logged in user
  account: Account; // an object which stores the user's hillcharts against the user.uui
}

// -----------------------------------------------
const MainPage = styled.div`
  width: 100%;
  margin: 0 auto;
  height: 100%;
`;
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
      if (user) {
        //non null value for user has been passed
        this.setState({ user });
        // - lookup the user up in the db and return a reference
        const userRef = firebase
          .database()
          .ref(`/accounts/${this.state.user.uid}`);
        // read the value of the user ref and update account state.
        userRef.once("value", snapshot => {
          if (snapshot.val()) {
            // there is a value, update the account infomation to the stored one.
            let val = snapshot.val();
            this.setState({
              account: {
                uid: val.object.uid,
                hillCharts: val.object.hillCharts
              }
            });
          }
        });
      }
    });
  }

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
      <Router>
        <div className="App">
          <NavWithLogin
            isLoggedIn={this.state.user == anonUser}
            user={this.state.user}
            logOut={this.logOut.bind(this)}
            logIn={this.logIn.bind(this)}
          />
          
          <MainPage>
            <Route path="/" exact component={Container} />
            <Route path="/browse" exact component={HillChartBrowser} />
          </MainPage>
        </div>
      </Router>
    );
  }
}

export default App;
