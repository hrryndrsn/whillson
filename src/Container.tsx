import React, { Component } from "react";
import styled from "styled-components";
import Point from "./Point";
import FloatingBox from "./FloatingBox";

import {} from "./paths";

import "./App.css";

const ContainerWrapper = styled.div`
  margin: 0 auto;
  background: white;
`;
const SvgWrapper = styled.svg`
  width: 100%;
  height: 100%;
  background-color: #fff;
`;
const Hill = styled.path`
  fill: #f2f2f2;
`;
const TapPath = styled.path`
  stroke: rgba(0, 0, 0, 0);
  stroke-width: 3;
  fill: none;
  transition: stroke 70ms ease-out;
  &:hover {
    cursor: pointer;
  }
`;
const MainPath = styled.path`
  stroke: none;
  fill: none;
`;

const Background = styled.rect`
`;

const GhostCircle = styled.circle`
  opacity: ${props => (props.theme.active ? 1 : 0)};
  fill: #6fcf97;
  transition: opacity 100ms ease-in-out;
`;


////-----------------------------------------------------

interface Pt {
  x: number;
  y: number;
  tag: string;
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
    selectedPoint: -1 //the point which has been clicked
  };

  pathRef = React.createRef<SVGPathElement>();

  componentDidMount = () => {
    window.addEventListener("load", e => {
      const ref = this.pathRef.current;
      if (!ref) {
        console.log("ref is null");
      } else {
        this.getPointOnPath(ref, 0.5);
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
          let id = this.state.selectedPoint
          let pointsList: Pt[] = this.state.points 
          pointsList[id].x = pt.x
          pointsList[id].y = pt.y
  
          this.setState({
            points: pointsList
          })
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
    this.setState({selectedPoint: id})
  }

  handleClick = (e: React.MouseEvent) => {
    const newPoint = this.pointOnCrv(e.pageX / window.innerWidth);
    const ptId = this.state.points.length
    //add point
    this.setState({
        points: [...this.state.points, { x: newPoint.x, y: newPoint.y, tag: "New point"}],
        selectedPoint: ptId
      });
    
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
    console.log(e.target.id)
    let newId: number;
    if (e.target.id) {
      if (e.target.id === "inputField" 
          || e.target.id === "floatingBoxContainer"
          || e.target.id === "formWrapper"
        ) {
        return
      }
      newId = parseInt(e.target.id)
      this.setState({isDragging: true, draggedPoint: newId, selectedPoint: newId})
    } else {
      //no id, no element we care about is the target
      this.setState({isDragging: true, draggedPoint: -1, selectedPoint: -1})
      return
    }
  }

  handleMouseUp = (e: any) => {
    this.setState({isDragging: false, draggedPoint: -1})
  }

  handleDeselect = (e: any) => {
    this.setState({selectedPoint: -1})
  }

  handleTagChange = (e: React.FormEvent<HTMLInputElement>) => {
    console.log("change->",e.currentTarget.value)
    if (this.state.selectedPoint > -1) {
      let ptList: Pt[] = this.state.points.slice();
      ptList[this.state.selectedPoint].tag = e.currentTarget.value
      console.log(ptList)
      this.setState({
        points: ptList
      })
    } else
    return
  }

  render() {
    return (
      <ContainerWrapper 
        onMouseDown={this.handleMouseDown} 
        onMouseUp={this.handleMouseUp}
      >
        <SvgWrapper width="100%" height="60" viewBox={`0 0 100 60`} fill="none">
          >
          <Background onClick={this.handleDeselect} width="100" height="60" fill="#2D9CDB" />
          <Hill
            d="M50 20C25 20 24.8264 46 0 46V60H100V46C75.1736 46 75 20 50 20Z"
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
            d="M0 46C24.8264 46 25 20 50 20C75 20 75.1736 46 100 46"
            fill="none"
            strokeWidth="0.694444"
          />
          <TapPath
            d="M0 46C24.8264 46 25 20 50 20C75 20 75.1736 46 100 46"
            onMouseOver={this.mouseOverTapPath}
            onMouseOut={this.mouseOutTapPath}
            onClick={this.handleClick}
            ref={this.pathRef}
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
              />
            )
          })}
        </SvgWrapper>
          {(this.state.selectedPoint > -1) && 
        
         <FloatingBox 
            activePoint={this.state.points[this.state.selectedPoint]}
            handleTagChange={this.handleTagChange}
         />
        }

      </ContainerWrapper>
    );
  }
}

export default Container;
