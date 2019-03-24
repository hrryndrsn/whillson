import React, { Component } from "react";
import styled from "styled-components";

import "../css/App.css";
import { Link } from "react-router-dom";
import firebase from "firebase";
import { HillChart } from "../constants/models";
import { threadId } from "worker_threads";
import { hillWords } from "../constants/words";
import { Tile } from "./Tile";

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
    background: white;
  height: 100px;
  padding: 24px;
  display: flex;
  align-items: flex-end;
  border-radius: 5px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16);
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
    return text;
  }
  componentDidMount = () => {
    this.state.mounted = true;
    let data: { hills: HillChart[] };
    let newHillArr: HillChart[] = [];
    if (this.props.currentUser) {
      let userRef = firebase
        .database()
        .ref("accounts/" + this.props.currentUser.uid);
      userRef.once("value").then(snapshot => {
        if (snapshot.val()) {
          data = { ...snapshot.val() };
          let hillObj = data.hills;
          let keys = Object.keys(hillObj);
          let gen = keys.map((key:any, index: number) => {
            let hill = {
                id: key,
                name: hillObj[key].name,
                points: hillObj[key].points
              }
            newHillArr.push(hill)
           });

          if (this.state.mounted) {
            this.setState({ hills: newHillArr });
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
          {this.state.hills.map((hill: HillChart, index: number) => <Tile key={index} hillId={1} index={index} hill={hill}/>)}
          <Link to={"/hills/" + this.makeid(16)}>
            <AddNewButtonGridCell>Create hill</AddNewButtonGridCell>
          </Link>
        </HillChartGrid>
      </Container>
    );
  }
}

export default HillChartBrowser;
