import React, { Component } from 'react';
import '../css/App.css';
import Container from './Container';
import Nav from './Nav';

class App extends Component {
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
