import React, { Component } from "react";
import styled from "styled-components";
import Point from "./Point";

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

const Background = styled.rect``;

const GhostCircle = styled.circle`
  opacity: ${props => (props.theme.active ? 1 : 0)};
  fill: #6fcf97;
  transition: opacity 50ms ease-in;
`;

interface Pt {
  x: number;
  y: number;
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
}

class Container extends Component<{}, ContainerState> {
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
    points: []
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
      //call pointOnCrv function
      const pt = this.pointOnCrv(e.x / window.innerWidth);

      //confirm point is not undefined, if
      let defPoint = point ? point : { x: 0, y: 0 };
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

  handleClick = (e: React.MouseEvent) => {
    const newPoint = this.pointOnCrv(e.pageX / window.innerWidth);
    console.log(newPoint);
    console.log(e.pageX / window.innerWidth);
    this.setState({
      points: [...this.state.points, { x: newPoint.x, y: newPoint.y }]
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

  renderPoint = (point: Pt, index: number) => {
    return <circle key={index} cx={point.x} cy={point.y} r={2} fill={"#333"} />;
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
            ref={this.pathRef}
          />
          <TapPath
            d="M0 46C24.8264 46 25 20 50 20C75 20 75.1736 46 100 46"
            onMouseOver={this.mouseOverTapPath}
            onMouseOut={this.mouseOutTapPath}
            onClick={this.handleClick}
          />
          {this.state.points.map((point: Pt, index) => {
            return this.renderPoint(point, index);
          })}
        </SvgWrapper>
      </ContainerWrapper>
    );
  }
}

export default Container;
