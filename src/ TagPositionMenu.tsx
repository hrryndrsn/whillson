import * as React from 'react';
import styled from 'styled-components';


const TagPositionMenuWrapper = styled.div`
font-size: 16px;
display: grid;
grid-template-areas: "a a"
                     "a a";
margin-top: 10px;
gap: 10px;
height: 70px;
width: 70px;
`   

const TagPosButton = styled.div`
  background: #f2f2f2;
  text-align: center;
  line-height: 30px;
  height: 30px;
  width: 30px;
`

interface TagPositionMenuProps {
}

const TagPositionMenu: React.SFC<TagPositionMenuProps> = (props) => {
  return (
    <TagPositionMenuWrapper>
      <TagPosButton id="ctop">{"T"}</TagPosButton>
      <TagPosButton id="cbottom">{"B"}</TagPosButton>
      <TagPosButton id="cleft">{"L"}</TagPosButton>
      <TagPosButton id="cright">{"R"}</TagPosButton>
    </TagPositionMenuWrapper>
  )
};

export default TagPositionMenu;