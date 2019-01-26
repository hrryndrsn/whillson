import React from 'react';
import styled from "styled-components";

const Circle = styled.circle`
  fill: red;
`

export interface PointProps {
  key: number,
  x: number,
  y: number
}



export default class Point extends React.Component<PointProps, any> {
  componentDidMount = () => {
    console.log(this.props)
  }

  handlePointClick = (e: React.MouseEvent) => {
    console.log(e.target)
  } 

  public render() {
    return (
      <Circle
        key={this.props.key} 
        id={String(this.props.key)}
        cx={this.props.x} 
        cy={this.props.y} 
        r={2} 
        fill={"#333"} 
        onClick={this.handlePointClick}
      />
    );
  }
}
