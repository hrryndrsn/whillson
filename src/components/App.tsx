import React, { Component, FormEvent, ComponentPropsWithRef } from "react";
import "../css/App.css";
import Container from "./Container";
import Nav from "./NavWithLogin";
import "firebase/auth";
import "firebase/database";
// import * as firebase from "firebase";
import firebase, { auth, provider } from "../config/firebase";
import styled from "styled-components";
import NavWithLogin from "./NavWithLogin";
import {
  BrowserRouter as Router,
  Route,
  Link,
  RouteComponentProps
} from "react-router-dom";
import HillChartBrowser from "./HillchartBrowser";
import { Account } from "../constants/models";
//-----------------------------------------------------

export interface HillChart {
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
      } else {
        console.log("no user");
      }
    });
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

  FindDBEntry = async (path: string) => {
    const datasnapshot = await firebase
      .database()
      .ref(path)
      .once("value"); // returns datasnapshot
    const val = await datasnapshot.val(); // find the actual value
    return val;
  };

  createNewHillOnAccount = async (useruid: string) => {
    const resultKey = await firebase
      .database()
      .ref(useruid)
      .child("hills")
      .push({
        name: "My new hillchart",
        points: []
      }).key;

    return resultKey;
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
            <Route
              path="/hills"
              exact
              component={(props: any) => (
                <HillChartBrowser
                  {...props}
                />
              )}
            />
            <Route
              path="/hills/:id"
              component={(props: any) => (
                <Container
                  {...props}
                  findDbEntry={this.FindDBEntry}
                  SetDBEntry={this.setDBEntry}
                  currentAccount={this.state.account}
                  currentUser={this.state.user}
                  createNewHill={this.createNewHillOnAccount}
                />
              )}
            />
          </MainPage>
        </div>
      </Router>
    );
  }
}

export default App;
