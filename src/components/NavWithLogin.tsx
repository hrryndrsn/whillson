import React, { Component } from "react";
import styled from "styled-components";

import "../css/App.css";
import { Link, NavLink } from "react-router-dom";
import { logoutSVGPath1, logoutSVGPath2 } from "../constants/colors";

const NavWrapper = styled.div`
  margin: 0 auto;
  padding: 16px 8px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  a {
    text-decoration: none;
    &:hover {
      color: pink;
    }
  }
  h3 {
    align-self: center;
    font-weight: bold;
    margin-left: 24px;
  }
`;
const AccountControlGroup = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr 1fr;
  button {
    padding: 0;
  }
  a {
    justify-self: right;
    align-self: center;
    color: #999 ;
    font-size: none;
  }
`;

const LoggedInUserControlGroup = styled.div`
  display: grid;
  grid-template-areas: "a b";
  align-content: center;
`;

const UserProfile = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 40px 100px;
  justify-content: center;
  align-content: center;
  margin-right: 12px;
`;

const ProfilePhoto = styled.img`
  width: 40px;
  margin-right: 16px;
  border-radius: 50%;
  align-self: center;
`;

const LogoutButtonGroup = styled.div`
  display: flex;
  &:hover {
    fill: pink;
  }
`

const LogInOutButton = styled.button`
  background: none;
  box-shadow: none; 
  color: black;
  border: none;
  cursor: pointer;
  &:hover {
    color: limegreen;
  }
  &:active {
    outline: none;
  }
`;

const Username = styled.p`
  margin: 0;
`;

const SiteTitle = styled.p`
  color: #bbb;
  font-weight: bolder;
  font-size: 24px;
  margin-left: 14px;
  text-decoration: none;
  vertical-align: center;
  align-self: center;
  justify-self: center;
`;

interface NavProps {
  isLoggedIn: boolean;
  user: any;
  logOut: () => void;
  logIn: () => void;
}

const LogoutSVG = styled.svg`
  fill: #999;
  height: 100%;
  transform: scale(1.4);
  margin-left: 8px;
`

const renderlogoutSVG = <svg width="24" height="24" viewBox="0 0 24 24" fill="none">

</svg>



class NavWithLogin extends Component<NavProps, {}> {
  render() {
    return (
      <NavWrapper>
        <NavLink to={this.props.user.uid == "123" ? "/hills" : "/"}>
          <SiteTitle>👉⛰</SiteTitle>
        </NavLink>
        {this.props.isLoggedIn ? (
          <AccountControlGroup>
            <LogInOutButton onClick={this.props.logIn.bind(this)}>
              Log in
            </LogInOutButton>
          </AccountControlGroup>
        ) : (
          <AccountControlGroup>
            <NavLink to={"/hills"}>Browse hills</NavLink>
            <LoggedInUserControlGroup>
              <UserProfile>
                <ProfilePhoto src={this.props.user.photoURL} />
                <LogoutButtonGroup>
                  <LogInOutButton onClick={this.props.logOut.bind(this)}>
                    <LogoutSVG width="24" height="24" viewBox="0 0 24 24" >
                    <path d={logoutSVGPath1}/>
                    <path d={logoutSVGPath2}/>
                    </LogoutSVG>
                  </LogInOutButton>
                </LogoutButtonGroup>
              </UserProfile>
            </LoggedInUserControlGroup>
          </AccountControlGroup>
        )}
      </NavWrapper>
    );
  }
}

export default NavWithLogin;
