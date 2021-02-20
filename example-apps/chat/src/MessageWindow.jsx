/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Componenent = styled.div`
  height: 600px;
  overflow-y: scroll;
  border: 1px solid #27213c;
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
`;

const Container = styled.div`
  width: 80%;
  padding: 4px;
  border-radius: 4px;
  margin: 5px 0;
  align-self: ${({ self }) => (self ? 'flex-end' : 'flex-start')} ;
  background-color: ${({ self }) => (self ? '#d1beb0' : '#f5fbef')} ;
  border: 1px solid ${({ self }) => (self ? '#c49f94' : '#c7e2c9')} ;
`;

const Username = styled.div`
  font-size: 12px;
  font-weight: bold;
  color: #5a352a;
`;

const Text = styled.div`
  font-size: 15px;
`;

const Message = ({ text, username, self }) => (
  <Container self={self}>
    <Username>{username}</Username>
    <Text>{text}</Text>
  </Container>
);
Message.propTypes = {
  text: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  self: PropTypes.bool.isRequired,
};

const EmptyLine = () => (<div>&nbsp;</div>);

const scrollDown = (ref) => {
  const chat = ref.chat.current;
  chat.scrollTop = chat.scrollHeight - chat.clientHeight;
};

export default class MessageWindow extends React.Component {
  constructor(props) {
    super(props);
    this.chat = React.createRef();
  }

  componentDidUpdate() {
    scrollDown(this);
  }

  render() {
    const { messages, username } = this.props;
    return (
      <Componenent ref={this.chat}>
        {messages.map((msg, key) => ( // eslint-disable-line react/prop-types
          <Message
            key={key}
            text={msg.text}
            username={msg.username}
            self={username === msg.username}
          />
        ))}
        <EmptyLine />
      </Componenent>
    );
  }
}

MessageWindow.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  messages: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired,
};
