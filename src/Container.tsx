import React, { Component } from 'react';
import styled from 'styled-components';
import {hillPathData, TapPathData} from './paths'

import './App.css';

const ContainerWrapper = styled.div`
  width: 100vw;
  height: 90vh;
  margin: 0 auto;
`
const SvgWrapper = styled.svg`
  width: 100%;
  height: 900px;
`
const Hill = styled.path`
  fill:#f2f2f2
`
const TapPath = styled.path`
  stroke: rgba(0,0,0,0);
  stroke-width: 30;
  fill: none;
  transition: stroke 200ms ease-out;
  &:hover {
    stroke: red;
  }
`
const MainPath = styled.path`
  stroke: none;
  fill: none;
`

class Container extends Component {

  state = {
    mouse: {
      x: 0,
      y: 0,
    }
  }

  pathRef = React.createRef<SVGPathElement>();

  componentDidMount = () => {
    window.addEventListener("load", (e) => {
      const ref = this.pathRef.current
      if (!ref) {
        console.log('ref is null')
      } else {
        console.log(ref.getTotalLength())
      }
    });

    window.addEventListener("mousemove", (e: MouseEvent) => {
      this.setState({mouse: {x: e.x, y: e.y}})
    });
  }
  render() {
    return (
      <ContainerWrapper>
        <SvgWrapper
          viewBox="0 0 1440 600"
        >
        <Hill d={hillPathData} />
        <TapPath d={TapPathData} />
        <MainPath d={TapPathData} ref={this.pathRef}/>
        </SvgWrapper>
      </ContainerWrapper>
    );
  }
}

export default Container;
