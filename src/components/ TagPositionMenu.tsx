import * as React from "react";
import styled from "styled-components";

const TagPositionMenuWrapper = styled.div`
  font-size: 16px;
  display: grid;
  grid-template-areas:
    "a a"
    "a a";
  margin-top: 45px;
  margin-right: 5px;
  gap: 10px;
  height: 70px;
  width: 70px;
`;

const TagPosButton = styled.div`
  background: #f2f2f2;
  text-align: center;
  line-height: 30px;
  height: 30px;
  width: 30px;
  border: 1px solid #ccc;
  background: white;
  border-radius: 4px;
  &:hover {
    box-shadow: none;
    background: #333;
    color: white;
    cursor: pointer;
    border: none;
  }
`;

interface TagPositionMenuProps {
  handleUpdate: (n: number) => void;
}

class TagPositionMenu extends React.Component<TagPositionMenuProps, {}> {
  handleClick = (e: any) => {
    // this.props.handleUpdate(e.target.id);
    switch(e.target.id) {
      case "ctop":
        this.props.handleUpdate(0);
        break;
      case "cright":
        this.props.handleUpdate(1);
        break
      case "cbottom":
        this.props.handleUpdate(2);
        break
      case "cleft":
        this.props.handleUpdate(3);
        break
    }
  };
  public render() {
    return (
      <TagPositionMenuWrapper id="ctagPosWrapper">
        <TagPosButton onClick={this.handleClick} id="ctop">
          {"↑"}
        </TagPosButton>
        <TagPosButton onClick={this.handleClick} id="cbottom">
          {"↓"}
        </TagPosButton>
        <TagPosButton onClick={this.handleClick} id="cleft">
          {"←"}
        </TagPosButton>
        <TagPosButton onClick={this.handleClick} id="cright">
          {"→"}
        </TagPosButton>
      </TagPositionMenuWrapper>
    );
  }
}

export default TagPositionMenu;
