import React from "react";
import styled from "styled-components";

const Circle = styled.circle`

  fill: ${props => props.theme.color};
  stroke: ${props => props.theme.isSelected ? "#fff" : "none"};
  r: ${props =>
    props.theme.isDragging 
      ? 2.5 
      : props.theme.isSelected 
      ? 3
      : 2
    };
    
  transition: r 75ms ease-in-out, 
              fill 75ms ease-in-out;
  &:hover {
    r: ${props => props.theme.isSelected ? 3 : 2.5};
  }
`;

const Tag = styled.text`
  fill: #000;
  user-select: none;
  font-size: 2px;
  font-family: sans-serif;
  background: #333;
`;

export interface PointProps {
  x: number;
  y: number;
  id: number;
  isDragging: boolean;
  isSelected: boolean;
  handleSelectPoint: (id: number) => void;
  tag: string;
  color: string;
  tagPosition: number;
}

export default class Point extends React.Component<PointProps, any> {
  tagRef = React.createRef<SVGTextElement>();

  state = {
    textBoxWidth: 0,
  }

  componentDidMount = () => {
    if (this.tagRef.current) {
      console.log(this.tagRef.current.getBBox().width)
      this.setState({textBoxWidth: this.tagRef.current.getBBox().width})
    }
    
  };
  componentDidUpdate = () => {
    if (this.tagRef.current) {
      if (this.state.textBoxWidth !== this.tagRef.current.getBBox().width){
        this.setState({textBoxWidth: this.tagRef.current.getBBox().width})
      }
    }
  }

  handlePointClick = (e: any) => {
    const pId = parseInt(e.target.id);
    this.props.handleSelectPoint(pId);
  };

  renderXOffset = () => {
    switch (this.props.tagPosition) {
      case 0:
        this.props.x - (this.state.textBoxWidth/2)
        break;
      case 1:
        this.props.x - (this.state.textBoxWidth/2)
        break;
      case 2:
        this.props.x - (this.state.textBoxWidth/2)
        break;
      case 4:
        this.props.x - (this.state.textBoxWidth/2)
        break;
    }
  }

  renderYOffset = (): any => {
    return this.props.x - (this.state.textBoxWidth/2)
    // switch (this.props.tagPosition) {
    //   case 0:
    //     this.props.y - 5
    //     break;
    //   case 1:
    //     this.props.y - 5
    //     break;
    //   case 2:
    //     this.props.y - 5
    //     break;
    //   case 4:
    //     this.props.y - 5
    //     break;
    // }
  }
  
  public render() {
    let  xOff 
    let  yOff 

    if (this.props.tagPosition == 0) {
      //tag at top
      xOff = this.props.x - (this.state.textBoxWidth/2)
      yOff = this.props.y - 5
    } else if (this.props.tagPosition == 1) {
      //tag at right
      xOff = this.props.x + (this.state.textBoxWidth ) - 5
      yOff = this.props.y + 0.5
    } else if (this.props.tagPosition == 2) {
      //tag at bottom
      xOff = this.props.x - (this.state.textBoxWidth/2)
      yOff = this.props.y + 6
    } else {
      //tag at left
      xOff = this.props.x - (this.state.textBoxWidth ) - 4
      yOff = this.props.y + 0.5
    }
    return (
      <g>
        <Circle
          id={String(this.props.id)}
          cx={this.props.x}
          cy={this.props.y}
          r={2}
          onClick={this.handlePointClick}
          theme={{
            isDragging: this.props.isDragging,
            isSelected: this.props.isSelected,
            color: this.props.color
          }}
        />
        <Tag 
          x={xOff}
          y={yOff}
          ref={this.tagRef}
        >
          {this.props.tag}
        </Tag>
      </g>
    );
  }
}
