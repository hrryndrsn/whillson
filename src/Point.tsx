import React from 'react';
import styled from "styled-components";

const Circle = styled.circle`

`

export interface PointProps {
  x: number,
  y: number
}



export default class Point extends React.PureComponent<PointProps, any> {
  componentDidMount = () => {
    console.log(this.props)
  }
  public render() {
    return (
      <Circle 
        cx={this.props.x} 
        cy={this.props.y} 
        r={2}
        fill={"black"}
      />
    );
  }
}
