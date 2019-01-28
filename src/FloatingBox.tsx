import * as React from 'react';
import styled, { ThemeConsumer } from 'styled-components';
import ColorMenu from './ColorMenu';
import TagPositionMenu from './ TagPositionMenu';



const FloatingBoxWrapper = styled.div`
 position: fixed;
 display: grid;
  top: 42vw;
  width: 50%;
  left: 25%;
  height: 35vh;
  background: white;;
  font-size: 32px;

  @media(max-width: 820px) {
    /* width: 60%;
    left: 20% */
  }

  @media(max-width: 680px) {
    top: 50vw;
    width: 70%;
    left: 15%;
  }
`

const FormWrapper = styled.form`
background: white;
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

const ControlRow = styled.div`
display: flex;
justify-content: space-between;
margin-top: 20px;
`

const FormFieldGroup = styled.div``


const DeleteButton = styled.div`
width:66px;
height: 30px;
font-size: 16px;
text-align: center;
border-radius: 5px;
line-height: 30px;
margin-left: 50px;;
margin-top: 42px;
margin-right: 0px;
background: none;
border: 0.5px solid #cccc;
padding: 2px 4px;;
&:hover {
  box-shadow: none;
  border: none; 
  background: red;
  color: white;
}
`

//---------------------------------------------------------------------------

export interface FloatingBoxProps {
  activePoint: {
    tag: string,
    x: number,
    y: number,
    color: string
  },
  colors: string[],
  handleTagChange: (e: any) => void
  handleColorUpdate: (c: string) => void
  handleUpdateTagPosition: (n: number) => void
  handleDeletePoint: () => void
  toggleInputFocus: () => void
}

export default class FloatingBox extends React.Component<FloatingBoxProps, any> {
  state = {
    x: this.props.activePoint.x,
    y: this.props.activePoint.y,
    screenPosX: ((this.props.activePoint.x / 100) * window.innerWidth),
    screenPosY: (this.props.activePoint.y / 100) * window.innerHeight
  }

  boxRef = React.createRef<HTMLDivElement>();

  private handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  }

  componentDidMount = () => {
    let maybeRef = this.boxRef.current
    if (maybeRef) {
    }
  }

   public render() {
    return (
      <FloatingBoxWrapper
        id="floatingBoxContainer"
        theme={{x: this.state.screenPosX, y: this.state.screenPosY}}
        ref={this.boxRef}
      >
      <FormWrapper
        id="cformWrapper"
        onSubmit={this.handleSubmit}
      >
      {/* Row 1 */}
      <ControlRow id="cControlRow1">
          <FormFieldGroup id="c">
            <TagLabel>
              Name
            </TagLabel>
            <PointTagInput 
              type="text" 
              id="inputField"
              autoFocus={true}
              value={this.props.activePoint.tag}
              onChange={this.props.handleTagChange}
              onFocus={this.props.toggleInputFocus}
              onBlur={this.props.toggleInputFocus}
            />  
          </FormFieldGroup>
          <FormFieldGroup id="c">
            <DeleteButton
              id="cDeleteButton"
              onClick={this.props.handleDeletePoint}
            >Remove</DeleteButton>
          </FormFieldGroup>
        </ControlRow>
      {/* Row 2 */}
        <ControlRow id="cControlRow2">
          <FormFieldGroup id="c">
            <TagLabel>
              Color
            </TagLabel>
            <ColorMenu 
              colorList={this.props.colors}
              selectedColor={this.props.activePoint.color}
              handleColorUpdate={this.props.handleColorUpdate}
            />
          </FormFieldGroup >
          <FormFieldGroup id="c">
            <TagPositionMenu handleUpdate={this.props.handleUpdateTagPosition}/>
          </FormFieldGroup>
        </ControlRow>
      </FormWrapper>
      </FloatingBoxWrapper>
    );
  }
}
