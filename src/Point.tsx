import React from 'react';
import styled from "styled-components";

const Circle = styled.circle`
  fill: ${props => props.theme.isDragging 
      ? "blue"
      : props.theme.isSelected 
      ? "red"
      : "#333"
    };
  r: ${props => props.theme.isDragging 
      ? 2.5
      :  props.theme.isSelected
      ?  2.5
      :  2
    };
  transition: r 75ms ease-in-out, fill 75ms ease-in-out;
  &:hover {
    fill:${props => props.theme.isSelected ? "red":  "blue"};;
    r: 2.5;
  }
`

export interface PointProps {
  x: number,
  y: number,
  id: number,
  isDragging: boolean,
  isSelected: boolean,
  handleSelectPoint: (id: number) => void
}

export default class Point extends React.Component<PointProps, any> {
  componentDidMount = () => {
    // console.log(this.props)
  }

  handlePointClick = (e: any) => {
    const pId = parseInt(e.target.id)
    this.props.handleSelectPoint(pId)
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
        theme={{
          isDragging: this.props.isDragging,
          isSelected: this.props.isSelected
        }}
      />
    );
  }
}
