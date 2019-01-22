import React, { Component } from 'react';
import styled from 'styled-components';

import './App.css';

const NavWrapper = styled.div`
  height: 5vh;
  margin: 0 auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
`

class Nav extends Component {
  render() {
    return (
      <NavWrapper>
      </NavWrapper>
    );
  }
}

export default Nav;
