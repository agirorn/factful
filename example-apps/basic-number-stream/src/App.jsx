/* eslint no-unused-vars: "error" */

import React from 'react';
import styled from 'styled-components';
import { getSocket } from './websocket';

const Container = styled.div`
  width: 400px;
  align-items: stretch;
  margin: auto;
`;

const NumberText = styled.div`
  color: #ab8237;
  align-items: stretch;
  margin: auto;
  display: inline-block;
`;

const SumText = styled.div`
  color: red;
  align-items: stretch;
  margin: auto;
  display: inline-block;
`;

const OffsetText = styled.div`
  color: navy;
  align-items: stretch;
  margin: auto;
  font-weight: bolder;
  display: inline-block;
`;

const IdText = styled.div`
  color: #ab8237;
  // align-items: stretch;
  // margin: auto;
  font-weight: bolder;
  display: inline-block;
`;

const Text = styled.div`
  color: Black;
  align-items: stretch;
  margin: auto;
  font-weight: bolder;
  width: 100%;
  padding-bottom: 0.3em;
`;

class Number extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      number: 0,
      offset: 0,
      sum: 0,
    };
    this.socket = getSocket();
    this.socket.on('message', (message) => {
      this.setState({
        id: message.id,
        number: message.number,
        offset: message.offset,
        sum: message.sum,
      });
    });
  }

  render() {
    return (
      <Container>
        <h1>Numbers</h1>
        <Text>ID: <IdText>{this.state.id}</IdText></Text>
        <Text>Offset: <OffsetText>{this.state.offset}</OffsetText></Text>
        <Text>Number: <NumberText>{this.state.number}</NumberText></Text>
        <Text>SUM: <SumText>{this.state.sum}</SumText></Text>
      </Container>
    );
  }
}

export default function App() {
  return (
    <Number />
  );
}
