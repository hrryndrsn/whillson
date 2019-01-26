import * as React from 'react';
import styled, { ThemeConsumer } from 'styled-components';
import { number } from 'prop-types';

export interface FloatingBoxProps {
  activePoint: {
    tag: string,
    x: number,
    y: number,
}}

const FloatingBoxWrapper = styled.div`
  position: absolute;
  display: grid;
  /* left: ${props => (props.theme.x + "px")};
  top:${props => (props.theme.y + "px")};; */
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100px;
`

export default class FloatingBox extends React.Component<FloatingBoxProps, any> {
  state = {
    x: this.props.activePoint.x,
    y: this.props.activePoint.y,
    screenPosX: ((this.props.activePoint.x / 100) * window.innerWidth),
    screenPosY: (this.props.activePoint.y / 100) * window.innerHeight
  }

  componentDidMount = () => {
    console.log(this.state.screenPosX)
  }

  componentDidUpdate= () => { 
    if (this.props.activePoint.x !== this.state.x) {
      console.log("derp")
      this.setState({x: this.props.activePoint.x,
        y: this.props.activePoint.y,
        screenPosX: ((this.props.activePoint.x / 100) * window.innerWidth),
        screenPosY: (this.props.activePoint.y / 100) * window.innerHeight})
    }
  }

  
   public render() {
    return (
      <FloatingBoxWrapper
        theme={{x: this.state.screenPosX, y: this.state.screenPosY}}
      >
       <p>{this.props.activePoint.tag}</p>
       <p>{this.props.activePoint.x}</p>
       <p>{this.props.activePoint.y}</p>
      </FloatingBoxWrapper>
    );
  }
}
