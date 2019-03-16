import React, { Component } from 'react';
import '../css/App.css';
import Container from './Container';
import Nav from './Nav';
import 'firebase/auth';
import * as firebaseui from 'firebaseui'
import firebaseConfig  from '../constants/firebase';

class App extends Component {
  state = {
    fbConfig: firebaseConfig
  }
  componentDidMount() {
  
  }
  render() {
    return (
      <div className="App">
        <Nav/>
        <Container/>
      </div>
    );
  }
}

export default App;
