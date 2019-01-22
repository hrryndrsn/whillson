import React, { Component } from "react";
import styled from "styled-components";
import { hillPathData, TapPathData } from "./paths";

import "./App.css";

const ContainerWrapper = styled.div`
  margin: 0 auto;
  background: white;
`;
const SvgWrapper = styled.svg`
  width: 100%;
  background-color: #fff;
  @media (max-width: 500px) {
      margin-top: 20vh;
  }
`;
const Hill = styled.path`
  fill: #f2f2f2;
`;
const TapPath = styled.path`
  stroke: rgba(0, 0, 0, 0);
  stroke-width: 20;
  fill: none;
  transition: stroke 200ms ease-out 50ms;
  &:hover {
    stroke: #6fcf97;
    cursor: pointer;
  }
`;
const MainPath = styled.path`
  stroke: none;
  fill: none;
`;

class Container extends Component {
  state = {
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
    points: [
      {
        x: 719.9999389648438,
        y: 300,
        color: "blue"
      }
    ]
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
      // console.log(e.x/window.innerWidth)
      // console.log(this.pathRef.current)
      const xPct = e.x/window.innerWidth
      const path = this.pathRef.current
      let point;
      if (path) {
        let tryPoint = path.getPointAtLength(xPct)
        if (tryPoint !== undefined) {
          point = tryPoint
        }
        console.log(point)
      }

      let derp = point ? point : {x: 0, y: 0}
      this.setState({ 
        mouse: { x: e.x, y: e.y }, 
        mouseXPercent: e.x / window.innerWidth,
        mousePoseOnLine: {x: derp.x ? derp.x : 0, }
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

  render() {
    return (
      <ContainerWrapper>
        <SvgWrapper 
                    width="100%"
          viewBox={`0 0 1440 700`}
          
        >
          <Hill d={hillPathData} />
          <TapPath
            d={TapPathData}
            onMouseOver={this.mouseOverTapPath}
            onMouseOut={this.mouseOutTapPath}
          /> 
          <MainPath d={TapPathData} ref={this.pathRef} />
          <circle
            cx={this.state.mousePoseOnLine.x}
            cy={this.state.mousePoseOnLine.y}
            r={25}
            fill={"black"}
          />
        </SvgWrapper>        
      </ContainerWrapper>
    );
  }
}

export default Container;

// {
//   this.state.points.map( point => {
//     <circle
//     cx={point.x}
//     cy={point.y}
//     r={25}
//     fill={"black"}
//   />
//   })
// }