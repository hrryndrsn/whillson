import React, { Component } from "react";
import styled from "styled-components";

import "../css/App.css";
import { Link } from "react-router-dom";
import firebase from "firebase";
import { HillChart } from "../constants/models";
import { threadId } from "worker_threads";
import { hillWords } from "../constants/words";

const Container = styled.div`
  padding: 82px 33px;
  background: #f2f2f2;
  height: 100vh;
`;

const PageHeader = styled.h3``;

const HillChartGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 1fr;
`;
const GridCell = styled.div`
  height: 200px;
  background: white;
  border: 1px solid #ccc;
  gap: 16px;
  border-radius: 5px;
`;

const AddNewButtonGridCell = styled.div`
  height: 200px;
  background: #f2f2f2;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

interface HillChartBrowserProps {
  currentUser: firebase.User;
}

interface HillChartBrowserState {
  hills: HillChart[];
  mounted: boolean;
}

class HillChartBrowser extends Component<
  HillChartBrowserProps,
  HillChartBrowserState
> {
  state = {
    hills: [],
    mounted: true
  };
  makeid(length: number): string {
    var text: string = "";
    var possible: string = "ABCDEFGHIKLMNOPQTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
      console.log(text)
    return text;
  }
  componentDidMount = () => {
    this.state.mounted = true;
    let data: { hills: HillChart[] };
    let newHillArr: HillChart[];
    if (this.props.currentUser) {
      let userRef = firebase
        .database()
        .ref("accounts/" + this.props.currentUser.uid);
      userRef.once("value").then(snapshot => {
        if (snapshot.val()) {

          data = { ...snapshot.val() };
          let hillObj = data.hills;
          let keys = Object.keys(hillObj);
          let newArr: any = []
          keys.map((element:any) => { newArr.push(hillObj[element]) });
          console.log("new hill arr =>", newArr)
          if (this.state.mounted) {
            this.setState({ hills: newArr });
          }
        }
      });
    }
  };

  componentWillUnmount = () => {
    this.state.mounted = false;
  };

  render() {
    return (
      <Container>
        <PageHeader>Hills</PageHeader>
        <HillChartGrid>
          {this.state.hills.map((hill: HillChart, index: number) => <GridCell key={index}>{hill.name ? hill.name : "new hill"}</GridCell>)}
          <Link to={"/hills/" + this.makeid(16)}>
            <AddNewButtonGridCell>New</AddNewButtonGridCell>
          </Link>
        </HillChartGrid>
      </Container>
    );
  }
}

export default HillChartBrowser;
