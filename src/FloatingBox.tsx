import * as React from 'react';
import styled, { ThemeConsumer } from 'styled-components';
import ColorMenu from './ColorMenu';



const FloatingBoxWrapper = styled.div`
  display: grid;
  padding: 0px 25vw;
  left: 0;
  bottom: 0;
  width: 50%;
  height: 35vh;
  min-height: 20px;
  background: none;
  font-size: 32px;
`

const FormWrapper = styled.form`
`
const PointTagInput = styled.input`
  font-size: 32px;
  width: 100%;
  background: none;
  outline: none;
  border:none;
  &:focus {
    border-bottom: 1px rgba(0,0,0, 0.2) solid;
  }
  
`

const TagLabel = styled.label`
  user-select: none;
  font-size: 16px;
  color: #bbb;
  margin-bottom: 12px;
`

//---------------------------------------------------------------------------

export interface FloatingBoxProps {
  activePoint: {
    tag: string,
    x: number,
    y: number,
  },
  colors: string[],
  handleTagChange: (e: any) => void
}

export default class FloatingBox extends React.Component<FloatingBoxProps, any> {
  state = {
    x: this.props.activePoint.x,
    y: this.props.activePoint.y,
    screenPosX: ((this.props.activePoint.x / 100) * window.innerWidth),
    screenPosY: (this.props.activePoint.y / 100) * window.innerHeight
  }

  private handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  }

   public render() {
    return (
      <FloatingBoxWrapper
        id="floatingBoxContainer"
        theme={{x: this.state.screenPosX, y: this.state.screenPosY}}
      >
      <FormWrapper
        id="formWrapper"
        onSubmit={this.handleSubmit}
      >
        <TagLabel>
          Name
        </TagLabel>
        <PointTagInput 
          type="text" 
          id="inputField"
          autoFocus={true}
          value={this.props.activePoint.tag}
          onChange={this.props.handleTagChange}
        />
        <TagLabel>
          Color
        </TagLabel>
        
        <ColorMenu 
          colorList={this.props.colors}
        />
      </FormWrapper>
      </FloatingBoxWrapper>
    );
  }
}
