import * as React from 'react';
import styled, { ThemeConsumer } from 'styled-components';
import { number } from 'prop-types';



const FloatingBoxWrapper = styled.div`
  position: fixed;
  display: grid;
  padding: 0 20vw;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 20vh;
  background: rgba(0,0,0, 0.2);
  font-size: 32px;
`

const FormWrapper = styled.form``
const PointTagInput = styled.input`
font-size: 32px;

`

//---------------------------------------------------------------------------

export interface FloatingBoxProps {
  activePoint: {
    tag: string,
    x: number,
    y: number,
  },
  id: number
  handleTagChange: (e: any) => void
}

export default class FloatingBox extends React.Component<FloatingBoxProps, any> {
  state = {
    x: this.props.activePoint.x,
    y: this.props.activePoint.y,
    screenPosX: ((this.props.activePoint.x / 100) * window.innerWidth),
    screenPosY: (this.props.activePoint.y / 100) * window.innerHeight
  }

   public render() {
    return (
      <FloatingBoxWrapper
        id="floatingBoxContainer"
        theme={{x: this.state.screenPosX, y: this.state.screenPosY}}
      >
      <FormWrapper
        id="formWrapper"
      >
        <PointTagInput 
          type="text" 
          id="inputField"
          value={this.props.activePoint.tag}
          onChange={this.props.handleTagChange}
        />
      </FormWrapper>
      </FloatingBoxWrapper>
    );
  }
}
