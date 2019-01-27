import React from "react";
import styled from "styled-components";

const Circle = styled.circle`
  fill: ${props =>
    props.theme.isDragging 
      ? "blue" 
      : props.theme.isSelected 
      ? "red" 
      : "#333"
    };
  r: ${props =>
    props.theme.isDragging 
      ? 2.5 
      : props.theme.isSelected 
      ? 2.5 
      : 2
    };
  transition: r 75ms ease-in-out, fill 75ms ease-in-out;
  &:hover {
    fill: ${props => (props.theme.isSelected ? "red" : "blue")};
    r: 2.5;
  }
`;

const Tag = styled.text`
  fill: #fff;
  user-select: none;
  font-size: 2px;
  font-family: sans-serif;
`;

export interface PointProps {
  x: number;
  y: number;
  id: number;
  isDragging: boolean;
  isSelected: boolean;
  handleSelectPoint: (id: number) => void;
  tag: string;
}

export default class Point extends React.Component<PointProps, any> {
  tagRef = React.createRef<SVGTextElement>();

  state = {
    textBoxWidth: 0
  }

  componentDidMount = () => {
    // console.log(this.props)
    if (this.tagRef.current) {
      console.log(this.tagRef.current.getBBox().width)
      this.setState({textBoxWidth: this.tagRef.current.getBBox().width})
    }
    
  };
  componentDidUpdate = () => {
    // console.log(this.props)
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
  handleMouseDown = (e: React.MouseEvent) => {
    // return console.log("drag")
  };

  public render() {
    return (
      <g>
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
        <Tag 
        x={this.props.x - (this.state.textBoxWidth/2)} 
        y={this.props.y - 5}
        ref={this.tagRef}
        >
          {this.props.tag}
        </Tag>
      </g>
    );
  }
}
