import React from 'react';
import styled from "styled-components";

const Circle = styled.circle`
  fill: ${props => props.theme.isDragging ? "blue":  "#333"};
  r: ${props => props.theme.isDragging ? 2.5:  2};;
  transition: r 75ms ease-in-out;
  &:hover {
    fill: blue;
    r: 2.5;
  }
`

export interface PointProps {
  x: number,
  y: number,
  id: number,
  isDragging: boolean
}

export default class Point extends React.Component<PointProps, any> {
  componentDidMount = () => {
    // console.log(this.props)
  }

  handlePointClick = (e: React.MouseEvent) => {
    // console.log(e.target)
  } 
  handleMouseDown = (e: React.MouseEvent) => {
    // return console.log("drag")
  } 

  public render() {
    return (
      <Circle
        id={String(this.props.id)}
        cx={this.props.x} 
        cy={this.props.y} 
        r={2} 
        onClick={this.handlePointClick}
        onMouseDown={this.handleMouseDown}
        theme={{isDragging: this.props.isDragging}}
      />
    );
  }
}
