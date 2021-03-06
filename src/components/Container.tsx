import React, { Component, TouchEventHandler } from "react";
import styled from "styled-components";
import Point from "./Point";
import FloatingBox from "./FloatingBox";
import { pointColors } from "../constants/colors";
import { adjectives, hillWords, generateRandom } from "../constants/words";

import "../css/App.css";
import { Pt } from "../constants/models";
import { RouteComponentProps } from "react-router-dom";
import { threadId } from "worker_threads";
import firebase from "firebase";

const ContainerWrapper = styled.div`
  margin: 0 auto;
  background: #fff;
`;
const SvgWrapper = styled.svg`
  width: 100%;
  height: 100%;
  background-color: #fff;
`;
const Hill = styled.path`
  fill: white;
`;
const TapPath = styled.path`
  stroke-width: 1;
  stroke: ${props => (props.theme.active ? "#6fcf97" : "#ccc")};
  transition: stroke 200ms ease-out;
  &:hover {
    cursor: pointer;
    stroke: #6fcf97;
  }
  @media (max-width: 500px) {
    stroke-width: 1;
  }
`;
//the actual hover target
const FakeTapPath = styled.path`
  opacity: 0;
  stroke-width: 4;
  stroke: red;
  fill: none;
  transition: stroke 200ms ease-out;
  &:hover {
    cursor: pointer;
    stroke: #6fcf97;
  }
  @media (max-width: 500px) {
    stroke-width: 3;
  }
`;
const MainPath = styled.path`
  stroke: 1px;
  fill: none;
`;

const Background = styled.rect`
  fill: #f2f2f2;
`;

const GhostCircle = styled.circle`
  opacity: ${props => (props.theme.active ? 1 : 0)};
  fill: #6fcf97;
  r: ${props => (props.theme.active ? 1.5 : 0.5)};
  transition: opacity 100ms ease-in-out;
`;

const EmptyFloatingBox = styled.div`
  display: grid;
  padding: 0px 25vw;
  left: 0;
  bottom: 0;
  width: 50%;
  height: 35vh;
  min-height: 20px;
  background: none;
  font-size: 32px;
`;

const EmptyMessage = styled.p`
  text-align: center;
  padding-top: 50px;
  opacity: 0.2;
`;

const Annotation = styled.text`
  font-size: 1.5px;
  fill: #bdbdbd;
  font-weight: bold;
  user-select: none;
`;

const HillNameInlineEdit = styled.input`
  height: 24px;
  margin-top: 60px;
  position: absolute;
  background: none;
  padding: 10px;
  margin-left: 10px;
  font-size: 24px;
  width: 40vw;
  outline: 0;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0);
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid #ccc;
  }
`;
////-----------------------------------------------------

interface ContainerState {
  mouse: {
    x: number;
    y: number;
  };
  mousePoseOnLine: {
    x: number;
    y: number;
  };
  mounted: boolean;
  mouseXPercent: number;
  tapPathActive: boolean;
  points: Pt[];
  isDragging: boolean;
  draggedPoint: number;
  selectedPoint: number;
  inputFocused: boolean;
  activeHill: string | null;
  hillRef?: firebase.database.Reference;
  hillName?: string;
}

/////---------------------------------------------------------

interface MatchParams {
  id: any;
  isExact: boolean;
  params: {
    id: string;
  };
  url: string;
}

interface containerProps {
  match?: MatchParams; // get the match param but not the rest of the route params
  SetDBEntry: (path: string) => Promise<any>;
  currentAccount: Account;
  currentUser: firebase.User;
  hillID: Promise<string | null>;
  hillName?: string;
}

/////---------------------------------------------------------

class Container extends Component<containerProps, {}> {
  state: ContainerState = {
    mouse: {
      x: 0,
      y: 0
    },
    mousePoseOnLine: {
      x: 0,
      y: 0
    },
    mounted: false,
    mouseXPercent: 0,
    tapPathActive: false,
    points: [],
    isDragging: false,
    draggedPoint: -1, //the point being dragged
    selectedPoint: -1, //the point which has been clicked
    inputFocused: false,
    activeHill: null,
    hillName: ""
  };

  pathRef = React.createRef<SVGPathElement>();

  handleLoad = (e: Event) => {
    if (this.state.mounted) {
      if (this.props.currentUser) {
        console.log("user detected");
      } else {
        console.log("user is null");
      }
      const ref = this.pathRef.current;
      if (!ref) {
        return;
      } else {
        this.getPointOnPath(ref, 0.5);
      }
    }
  };
  handleTouchStart = (e: any) => {
    let newId: number;
    if (e.target.id) {
      if (
        // check if the target of the touch as a known element.
        e.target.id === "inputField" || // is the name input field
        e.target.id === "floatingBoxContainer" || // is the editor bg
        e.target.id === "formWrapper" || // is the editor bg
        e.target.id.charAt(0) === "#" || //is a color block
        e.target.id.charAt(0) === "c" //is position control
      ) {
        // mouse down over a 'secondary element'
        return;
      }
      newId = parseInt(e.target.id);
      this.setState({
        isDragging: true,
        draggedPoint: newId,
        selectedPoint: newId
      });
    } else {
      //no id, no element we care about is the target
      this.setState({
        isDragging: true,
        draggedPoint: -1,
        selectedPoint: -1,
        inputFocused: false
      });
      return;
    }
  };
  handleTouchMove = (e: any) => {
    const tx = e.changedTouches[0].pageX,
      ty = e.changedTouches[0].pageY,
      xPct = tx / window.innerWidth,
      path = this.pathRef.current;
    let point;
    if (path) {
      let tryPoint = path.getPointAtLength(xPct);
      if (tryPoint !== undefined) {
        point = tryPoint;
      }
    }
    //call pointOnCrv function
    const pt = this.pointOnCrv(tx / window.innerWidth);
    if (this.state.isDragging) {
      if (this.state.selectedPoint !== -1) {
        // create a new point and add it to the graph
        let id = this.state.selectedPoint;
        let pointsList: Pt[] = this.state.points;
        pointsList[id].x = pt.x;
        pointsList[id].y = pt.y;

        this.setState({
          points: pointsList
        });
        // console.log(this.state.points);
      }
    }

    this.setState({
      mouse: { x: tx, y: ty },
      mouseXPercent: tx / window.innerWidth,
      mousePoseOnLine: {
        x: pt.x,
        y: pt.y
      }
    });
  };

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === 8 && this.state.selectedPoint !== -1) {
      this.handleDeletePoint();
    }
  };
  handleMouseMove = (e: MouseEvent) => {
    const xPct = e.x / window.innerWidth,
      path = this.pathRef.current;
    let point;
    if (path) {
      let tryPoint = path.getPointAtLength(xPct);
      if (tryPoint !== undefined) {
        point = tryPoint;
      }
    }
    //call pointOnCrv function
    const pt = this.pointOnCrv(e.x / window.innerWidth);

    if (this.state.isDragging) {
      if (this.state.selectedPoint !== -1) {
        let id = this.state.selectedPoint;
        let pointsList: Pt[] = this.state.points;
        pointsList[id].x = pt.x;
        pointsList[id].y = pt.y;

        this.setState(
          {
            points: pointsList
          },
          () => {
            // update the current positions in local sotrage
            localStorage.setItem("points", JSON.stringify(this.state.points));
            //update positions in db
            if (this.state.hillRef) {
              this.state.hillRef.child("points").set({
                ...this.state.points
              });
            }
          }
        );
      }
    }

    this.setState({
      mouse: { x: e.x, y: e.y },
      mouseXPercent: e.x / window.innerWidth,
      mousePoseOnLine: {
        x: pt.x,
        y: pt.y
      }
    });
  };

  componentDidMount = () => {
    this.state.mounted = true;
    //Check if we have loaded on a specific url
    if (this.props.match) {
      if (this.props.match.params.id) {
        //we have id to a new or exisitng hill
        // console.log("hill id:", this.props.match.params.id);
        this.setState({ activeHill: this.props.match.params.id });
        // open up a db connection for this hill
        let path =
          "accounts/" +
          this.props.currentUser.uid +
          "/hills/" +
          this.props.match.params.id;
        let hillRef = firebase.database().ref(path);
        this.setState({ hillRef }, () => {
          //check value of hillRef
          if (this.state.hillRef) {
            //we have a vlaue hillRef, check its value
            hillRef.once("value").then(snapshot => {
              // check if we have existing data for this hill id
              if (snapshot.val()) {
                // console.log("existing data for this hill", snapshot.val());
                let ed = snapshot.val();
                if (this.state.mounted) {
                  this.setState({
                    hillName: ed.name || "Hew hill",
                    points: ed.points
                  });
                }
              }
            });
          } else {
            // no hill value, it is a new hill, add a name
          }
        });
      } else {
        //we dont have a specic hill id
        console.log("sanbox");
      }
    }
    //register handlers, make sure to cancel them in componentDidUnmount
    window.addEventListener("load", this.handleLoad);
    window.addEventListener("touchstart", this.handleTouchStart);
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("touchmove", this.handleTouchMove);
  };

  getPointOnPath = (ref: SVGPathElement, pct: number) => {
    const curveLen = ref.getTotalLength();
    const point = ref.getPointAtLength(curveLen * pct);
    return point;
  };

  mouseOverTapPath = (e: React.MouseEvent) => {
    this.setState({ tapPathActive: true });
  };

  mouseOutTapPath = (e: React.MouseEvent) => {
    this.setState({ tapPathActive: false });
  };

  handleSelectPoint = (id: number) => {
    this.setState({ selectedPoint: id });
  };

  getRandomColor = () => {
    var color = pointColors[Math.floor(Math.random() * pointColors.length)];
    return color;
  };

  handleClick = (e: React.MouseEvent) => {
    const newPoint = this.pointOnCrv(e.pageX / window.innerWidth);
    const ptId = this.state.points.length;
    //add point
    this.setState(
      {
        points: [
          ...this.state.points,
          {
            x: newPoint.x,
            y: newPoint.y,
            tag: generateRandom(adjectives, hillWords),
            color: this.getRandomColor(),
            tagPlacement: 0
          }
        ],
        selectedPoint: ptId
      },
      () => {
        //fire stuff in a callback to make sure state is correct
        //prevent off by 1 erros
        //save tp local storage
        localStorage.setItem("points", JSON.stringify(this.state.points));
        //save to db
        if (this.state.hillRef) {
          this.state.hillRef.child("points").set({
            ...this.state.points
          });
        }
      }
    );
  };

  pointOnCrv(pct: number): { x: number; y: number } {
    const defRef = this.pathRef.current;
    let length: number,
      containerWidth: number,
      relPct: number,
      crds: { x: number; y: number };

    if (defRef) {
      length = defRef.getTotalLength();
      relPct = length * pct;
      containerWidth = window.innerWidth;
      crds = defRef.getPointAtLength(relPct);
      return crds;
    } else {
      crds = { x: 0, y: 0 };
      return crds;
    }
  }

  //mouse down on contianer
  handleMouseDown = (e: any) => {
    let newId: number;
    if (e.target.id) {
      if (
        e.target.id === "inputField" || // is the name input field
        e.target.id === "floatingBoxContainer" || // is the editor bg
        e.target.id === "formWrapper" || // is the editor bg
        e.target.id.charAt(0) === "#" || //is a color block
        e.target.id.charAt(0) === "c" //is position control
      ) {
        // mouse down over a 'secondary element'
        return;
      }
      newId = parseInt(e.target.id);
      this.setState({
        isDragging: true,
        draggedPoint: newId,
        selectedPoint: newId
      });
    } else {
      //no id, no element we care about is the target
      this.setState({
        isDragging: true,
        draggedPoint: -1,
        selectedPoint: -1,
        inputFocused: false
      });
      return;
    }
  };

  handleMouseUp = (e: any) => {
    this.setState({ isDragging: false, draggedPoint: -1 });
  };

  handleDeselect = (e: any) => {
    this.setState({ selectedPoint: -1 });
  };

  handleTagChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (this.state.selectedPoint > -1) {
      let ptList: Pt[] = this.state.points.slice();
      ptList[this.state.selectedPoint].tag = e.currentTarget.value;
      this.setState(
        {
          points: ptList
        },
        () => {
          //save to local storage
          localStorage.setItem("points", JSON.stringify(this.state.points));
          //save to db
          if (this.state.hillRef) {
            this.state.hillRef.child("points").set({
              ...this.state.points
            });
          }
        }
      );
    } else return;
  };

  renderPointEditor = () => {
    if (this.state.selectedPoint === -1) {
      // nothing selected
      return <div />;
    } else {
      return (
        <FloatingBox
          activePoint={this.state.points[this.state.selectedPoint]}
          handleTagChange={this.handleTagChange}
          colors={pointColors}
          handleColorUpdate={this.handleUpdatePointColor}
          handleUpdateTagPosition={this.handleUpdateTagPosition}
          handleDeletePoint={this.handleDeletePoint}
          toggleInputFocus={this.toggleFocusInput}
        />
      );
    }
  };

  handleUpdatePointColor = (c: string) => {
    if (this.state.selectedPoint !== -1) {
      let pointList = this.state.points;
      let selectedPt = this.state.selectedPoint;
      pointList[selectedPt].color = c;
      this.setState({ points: pointList }, () => {
        //save to local storage
        localStorage.setItem("points", JSON.stringify(this.state.points));
        //save to db
        if (this.state.hillRef) {
          this.state.hillRef.child("points").set({
            ...this.state.points
          });
        }
      });
    }
  };

  handleUpdateTagPosition = (newPos: number) => {
    // console.log("update pos to ->", newPos);
    if (this.state.selectedPoint !== -1) {
      let pointList = this.state.points;
      let selectedPt = this.state.selectedPoint;
      pointList[selectedPt].tagPlacement = newPos;
      this.setState({ points: pointList }, () => {
        //save to local storage
        localStorage.setItem("points", JSON.stringify(this.state.points));
        //save to db
        if (this.state.hillRef) {
          this.state.hillRef.child("points").set({
            ...this.state.points
          });
        }
      });
    }
  };

  handleDeletePoint = () => {
    if (this.state.selectedPoint !== -1 && this.state.inputFocused === false) {
      let pointList = this.state.points;
      let selectedPt = this.state.selectedPoint;
      pointList.splice(selectedPt, 1);
      this.setState({ points: pointList, selectedPoint: -1 }, () => {
        //save to localstorage
        localStorage.setItem("points", JSON.stringify(this.state.points));
        //save to db
        if (this.state.hillRef) {
          this.state.hillRef.child("points").set({
            ...this.state.points
          });
        }
      });
    }
  };

  toggleFocusInput = () => {
    this.setState({ inputFocused: !this.state.inputFocused });
  };

  componentWillUnmount = () => {
    this.state.mounted = false;
    //unregister handlers
    window.removeEventListener("load", this.handleLoad);
    window.removeEventListener("touchstart", this.handleTouchStart);
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("touchmove", this.handleTouchMove);
  };

  handleHillNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ hillName: e.currentTarget.value }, () => {
      if (this.state.hillRef) {
        this.state.hillRef.child("name").set(this.state.hillName);
      }
    });
  };

  updateHillName = () => {
    if (this.state.hillRef) {
      this.state.hillRef.child("name").set(this.state.hillName);
    }
  };

  render() {
    return (
      <ContainerWrapper
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
      >
        {this.state.hillRef && (
          <HillNameInlineEdit
            type="text"
            value={this.state.hillName}
            onChange={this.handleHillNameChange}
          />
        )}
        <SvgWrapper
          width="100%"
          height="50%"
          viewBox={`0 0 100 50`}
          fill="none"
        >
          >
          <Background
            onClick={this.handleDeselect}
            width="100"
            height="50"
            fill="#2D9CDB"
          />
          <line
            x1={50}
            x2={50}
            y1={0}
            y2={50}
            stroke="#ccc"
            strokeWidth="0.5"
            strokeDasharray="1.2"
          />
          <Hill
            d="M50 22C25 22 24.8264 48 0 48V52H100V48C75.1736 48 75 22 50 22Z"
            fill="#F2F2F2"
            onClick={this.handleDeselect}
          />
          <GhostCircle
            cx={this.state.mousePoseOnLine.x}
            cy={this.state.mousePoseOnLine.y}
            r={2}
            theme={{ active: this.state.tapPathActive }}
          />
          <MainPath
            d="M0 48C24.8264 48 25 22 50 22C75 22 75.1736 48 100 48"
            fill="none"
            strokeWidth="0.694444"
          />
          <FakeTapPath
            d="M0 48C24.8264 48 25 22 50 22C75 22 75.1736 48 100 48"
            onMouseOver={this.mouseOverTapPath}
            onMouseOut={this.mouseOutTapPath}
            onClick={this.handleClick}
          />
          <TapPath
            d="M0 48C24.8264 48 25 22 50 22C75 22 75.1736 48 100 48"
            onMouseOver={this.mouseOverTapPath}
            onMouseOut={this.mouseOutTapPath}
            onClick={this.handleClick}
            ref={this.pathRef}
            theme={{ active: this.state.tapPathActive }}
          />
          {this.state.points.map((point: Pt, index) => {
            return (
              <Point
                key={index}
                id={index}
                x={point.x}
                y={point.y}
                isDragging={index == this.state.draggedPoint}
                isSelected={index == this.state.selectedPoint}
                handleSelectPoint={this.handleSelectPoint}
                tag={point.tag}
                color={point.color}
                tagPosition={point.tagPlacement}
              />
            );
          })}
        </SvgWrapper>

        {this.renderPointEditor()}
      </ContainerWrapper>
    );
  }
}

export default Container;
