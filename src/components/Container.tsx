import React, { Component } from "react";
import styled from "styled-components";
import Point from "./Point";
import FloatingBox from "./FloatingBox";
import { pointColors } from "../constants/colors";
import { adjectives, hillWords, generateRandom } from "../constants/words";

import "../css/App.css";

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
//the actuall hover target
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
////-----------------------------------------------------

interface Pt {
  x: number;
  y: number;
  tag: string;
  color: string;
  tagPlacement: number;
}

interface ContainerState {
  mouse: {
    x: number;
    y: number;
  };
  mousePoseOnLine: {
    x: number;
    y: number;
  };
  mouseXPercent: number;
  tapPathActive: boolean;
  points: Pt[];
  isDragging: boolean;
  draggedPoint: number;
  selectedPoint: number;
  inputFocused: boolean;
}

/////---------------------------------------------------------

class Container extends Component<{}, ContainerState> {
  state: ContainerState = {
    mouse: {
      x: 0,
      y: 0
    },
    mousePoseOnLine: {
      x: 0,
      y: 0
    },
    mouseXPercent: 0,
    tapPathActive: false,
    points: [],
    isDragging: false,
    draggedPoint: -1, //the point being dragged
    selectedPoint: -1, //the point which has been clicked
    inputFocused: false
  };

  pathRef = React.createRef<SVGPathElement>();

  componentDidMount = () => {
    window.addEventListener("load", e => {
      const ref = this.pathRef.current;
      if (!ref) {
        return;
      } else {
        this.getPointOnPath(ref, 0.5);
      }
      // find any stored data in localStorage
      let tryGetStoredData = localStorage.getItem("points");
      if (tryGetStoredData) {
        //we found a coded json string
        let dc = JSON.parse(tryGetStoredData);
        console.log(dc);
        this.setState({ points: dc });
      } else {
        // there is no saved state. Let points array remain empty
      }
    });

    window.addEventListener("touchstart", (e: any) => {
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
    });

    window.addEventListener("touchmove", (e: any) => {
      // console.log("move x:", e.changedTouches[0].pageX)
      // console.log("move y:", e.changedTouches[0].pageY)

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
          console.log(this.state.points);
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
    });

    window.addEventListener("touchend", (e: any) => {
      console.log("End", e);
    });

    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.keyCode === 8 && this.state.selectedPoint !== -1) {
        this.handleDeletePoint();
      }
    });

    window.addEventListener("mousemove", (e: MouseEvent) => {
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
            () =>
              // update the current positions in local sotrage
              localStorage.setItem("points", JSON.stringify(this.state.points))
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
    });
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
        //TODO - Save state to local host.
        localStorage.setItem("points", JSON.stringify(this.state.points));
        console.log("state packet", this.state.points);
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
      console.log("ref not defined");
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
    console.log("change->", e.currentTarget.value);
    if (this.state.selectedPoint > -1) {
      let ptList: Pt[] = this.state.points.slice();
      ptList[this.state.selectedPoint].tag = e.currentTarget.value;
      console.log(ptList);
      this.setState(
        {
          points: ptList
        },
        () => {
          localStorage.setItem("points", JSON.stringify(this.state.points));
        }
      );
    } else return;
  };

  renderPointEditor = () => {
    if (this.state.selectedPoint === -1) {
      return (
        <EmptyFloatingBox>
          <EmptyMessage />
        </EmptyFloatingBox>
      );
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
      this.setState({ points: pointList });
    }
  };

  handleUpdateTagPosition = (newPos: number) => {
    console.log("update pos to ->", newPos);
    if (this.state.selectedPoint !== -1) {
      let pointList = this.state.points;
      let selectedPt = this.state.selectedPoint;
      pointList[selectedPt].tagPlacement = newPos;
      this.setState({ points: pointList }, () => {
        localStorage.setItem("points", JSON.stringify(this.state.points));
      });
    }
  };

  handleDeletePoint = () => {
    if (this.state.selectedPoint !== -1 && this.state.inputFocused === false) {
      let pointList = this.state.points;
      let selectedPt = this.state.selectedPoint;
      pointList.splice(selectedPt, 1);
      this.setState({ points: pointList, selectedPoint: -1 }, () => {
        localStorage.setItem("points", JSON.stringify(this.state.points));
      });
    }
  };

  toggleFocusInput = () => {
    this.setState({ inputFocused: !this.state.inputFocused });
  };

  render() {
    return (
      <ContainerWrapper
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
      >
        <SvgWrapper
          width="100%%"
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
          <Annotation x={33} y={3}>
            ← Figuring it out
          </Annotation>
          <Annotation x={55} y={3}>
            Making it happen →
          </Annotation>
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
