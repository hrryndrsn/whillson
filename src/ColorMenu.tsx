import * as React from 'react';
import styled from "styled-components"

const ColorBlock = styled.div`
  width: 30px;
  height: 30px;
  background: ${props => props.theme.backgroundColor};
  border-radius: 15px;
  opacity: ${props => props.theme.selectedColor == props.theme.backgroundColor ? 1 : 0.2};
  transition: opacity 200ms ease-in-out;
  &:hover {
    opacity: 1;
  }
`

const ColorMenuWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 30px);
  margin-top: 10px;
  gap: 10px;

  @media(max-width: 820px) {
    grid-template-columns: repeat(6, 30px);
  }
  @media(max-width: 480px) {
    grid-template-columns: repeat(4, 30px);
  }
`

export interface ColorMenuProps {
  colorList: string[];
  selectedColor: string;
  handleColorUpdate: (c: string) => void
}

export interface ColorMenuState {
}

export default class ColorMenu extends React.Component<
  ColorMenuProps, 
  ColorMenuState> 
{
  state: ColorMenuState = {
    colorList: this.props.colorList,
  }

  handleColorBlockClick = (e: any) => {
    //call container method to update
    // the selected point's color
    this.props.handleColorUpdate(e.target.id)
  }

  renderColors = (color: string, index: number) => {
    return (
    <ColorBlock
      theme={{
        backgroundColor: color, 
        selectedColor: this.props.selectedColor
      }} 
      id={color}
      key={index}
      onClick={this.handleColorBlockClick}
    />
    )
  }

  public render() {
    return (
      <ColorMenuWrapper
        id={"#ColorMenuWrapper"}
      >
        {
          this.props.colorList.map((color: string, index: number) =>  
          this.renderColors(color, index)
        )}
      </ColorMenuWrapper>
    );
  }
}
