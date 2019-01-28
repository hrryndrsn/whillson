import * as React from 'react';
import styled from "styled-components"

const ColorBlock = styled.div`
  width: 30px;
  height: 30px;
  background: ${props => props.theme.backgroundColor};
  border-radius: 15px;
  opacity: 0.1;
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
`

export interface ColorMenuProps {
  colorList: string[]
}

export interface ColorMenuState {
}

export default class ColorMenu extends React.Component<
  ColorMenuProps, 
  ColorMenuState> 
{
  state: ColorMenuState = {
    colorList: this.props.colorList
  }

  renderColors = (color: string) => {
    return (
    <ColorBlock
      theme={{backgroundColor: color}} 
    />
    )
  }

  public render() {
    return (
      <ColorMenuWrapper>
        {
          this.props.colorList.map((color: string) =>  
          this.renderColors(color)
        )}
      </ColorMenuWrapper>
    );
  }
}
