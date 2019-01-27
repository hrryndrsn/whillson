import * as React from 'react';
import styled, { ThemeConsumer } from 'styled-components';



const FloatingBoxWrapper = styled.div`
  position: fixed;
  display: grid;
  padding: 20px 20vw;
  left: 0;
  bottom: 0;
  width: 60%;
  height: 20vh;
  background: white;
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

//---------------------------------------------------------------------------

export interface FloatingBoxProps {
  activePoint: {
    tag: string,
    x: number,
    y: number,
  },
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
        <PointTagInput 
          type="text" 
          id="inputField"
          autoFocus={true}
          value={this.props.activePoint.tag}
          onChange={this.props.handleTagChange}
        />
      </FormWrapper>
      </FloatingBoxWrapper>
    );
  }
}
