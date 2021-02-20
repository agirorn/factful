/* eslint no-unused-vars: "error" */

import './App.css';
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  BrowserRouter as Router,
  Route,
  useHistory,
  withRouter,
} from 'react-router-dom';
import MessageWindow from './MessageWindow';
import TextBar from './TextBar';
import { getSocket } from './websocket';

const Container = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: auto;
`;

const Title = styled.div`
  font-size: 18px;
  text-align: center;
  margin: 10px 0;
`;

const UserLine = styled.span`
  color: #989696;
  display: block;
  font-size: 2em;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
`;

const Username = styled.span`
  color: #61b324;
`;

export function LogIn() {
  const history = useHistory();
  const setUserName = (username) => history.push(`/user/${username}`);
  return (
    <Container>
      <Title>Enter username</Title>
      <TextBar onSubmit={setUserName} buttonText="LogIn" />
    </Container>
  );
}

const addMessage = (message) => ({ username, messages }) => ({
  username,
  messages: [...messages, message],
});

class ChatComponent extends React.Component {
  constructor(props) {
    super(props);
    const { props: { match: { params: { username } } } } = this;
    this.state = {
      username,
      messages: [],
    };

    this.socket = getSocket();
    this.socket.on('message', (message) => {
      this.setState(addMessage(message));
    });
  }

  sendMessage(text) {
    const { username } = this.state;
    this.socket.send({ username, text });
  }

  render() {
    const { state: { messages, username } } = this;
    const onSubmit = (text) => this.sendMessage(text);
    return (
      <Container>
        <UserLine>
          USER:
          <Username>{username}</Username>
        </UserLine>
        <Title>Messages</Title>
        <MessageWindow messages={messages} username={username} />
        <TextBar onSubmit={onSubmit} buttonText="Send" />
      </Container>
    );
  }
}
ChatComponent.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  match: PropTypes.object.isRequired,
};
const Chat = withRouter(ChatComponent);

export default function App() {
  return (
    <Router>
      <Route exact path="/"><LogIn /></Route>
      <Route path="/user/:username"><Chat /></Route>
    </Router>
  );
}
