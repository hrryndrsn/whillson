import React, { Component } from 'react';
import styled from 'styled-components';

import "../css/App.css";

const Container = styled.div`
padding: 82px 33px;
background: #f2f2f2;
height: 100vh;
`;

interface HillChartBrowserProps {
  
}


class HillChartBrowser extends Component<HillChartBrowserProps, {}> {
  render() {
    return (
      <Container>Hill chart browser</Container>
    );
  }
}

export default HillChartBrowser;
