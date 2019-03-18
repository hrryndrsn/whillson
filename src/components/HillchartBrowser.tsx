import React, { Component } from 'react';
import styled from 'styled-components';

import "../css/App.css";
import { Link } from 'react-router-dom';

const Container = styled.div`
padding: 82px 33px;
background: #f2f2f2;
height: 100vh;
`;


const PageHeader = styled.h3``

const HillChartGrid = styled.div`
display: grid;
gap: 16px;
grid-template-areas: "a b c"
`
const GridCell = styled.div`
  height: 200px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
`

const AddNewButtonGridCell = styled.div`
  height: 200px;
  background: #f2f2f2;
  border: 1px solid #ccc;
  border-radius: 5px;
`



interface HillChartBrowserProps {
  
}


class HillChartBrowser extends Component<HillChartBrowserProps, {}> {
  render() {
    return (
      <Container>
        <PageHeader>Hills</PageHeader>

        <HillChartGrid>
          <GridCell/>
          <GridCell/>
          <GridCell/>
          <GridCell/>
          <Link to="/new">
          <AddNewButtonGridCell>New</AddNewButtonGridCell>
          </Link>
          
        </HillChartGrid>
      </Container>
    );
  }
}

export default HillChartBrowser;
