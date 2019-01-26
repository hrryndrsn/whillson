import React, { Component } from "react";
import styled from "styled-components";
import {
  hillPathData,
  TapPathData,
  hillPathData2,
  TapPathData2
} from "./paths";

import "./App.css";

const ContainerWrapper = styled.div`
  margin: 0 auto;
  background: white;
`;
const SvgWrapper = styled.svg`
  width: 100%;
  height: 100%;
  background-color: #fff;

  @media (max-width: 700px) {
    margin-top: 20vh;
  }

  @media (max-width: 1100px) {
  }
`;
const Hill = styled.path`
  fill: #f2f2f2;
`;
const TapPath = styled.path`
  stroke: rgba(0, 0, 0, 0);
  stroke-width: 1 ;
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

const Background = styled.rect``

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
      const xPct = e.x / window.innerWidth;
      const path = this.pathRef.current;
      let point;
      if (path) {
        let tryPoint = path.getPointAtLength(xPct);
        if (tryPoint !== undefined) {
          point = tryPoint;
        }
      }

      let derp = point ? point : { x: 0, y: 0 };
      this.setState({
        mouse: { x: e.x, y: e.y },
        mouseXPercent: e.x / window.innerWidth,
        mousePoseOnLine: { x: derp.x ? derp.x : 0 }
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
        <SvgWrapper width="100%" height="60" viewBox={`0 0 100 60`} fill="none">
          >
          <Background width="100" height="60" fill="#2D9CDB" />
          <Hill
            d="M50 20C25 20 24.8264 46 0 46V60H100V46C75.1736 46 75 20 50 20Z"
            fill="#F2F2F2"
          />
          <TapPath
            d="M0 46C24.8264 46 25 20 50 20C75 20 75.1736 46 100 46"
            ref={this.pathRef}
            onMouseOver={this.mouseOverTapPath}
            onMouseOut={this.mouseOutTapPath}
          />
          <MainPath
            d="M0 46C24.8264 46 25 20 50 20C75 20 75.1736 46 100 46"
            stroke="black"
            fill="none"
            strokeWidth="0.694444"
            ref={this.pathRef}
          />
          {/* <line
              x1={100 * this.state.mouseXPercent}
              x2={100 * this.state.mouseXPercent}
              y1={0}
              y2={50}
              stroke={"red"}
              strokeWidth={0.1}
            /> */}
        </SvgWrapper>
      </ContainerWrapper>
    );
  }
}

export default Container;
