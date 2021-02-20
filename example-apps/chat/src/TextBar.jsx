import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Textbar = styled.div`
  display: flex;
  align-items: stretch;
`;

const Input = styled.input`
  flex-grow: 1;
  box-sizing: border-box;
`;

const Button = styled.button`
  border-radius: 0;
  border: none;
`;

export default class TextBar extends Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  sendMessage() {
    const { current } = this.input;
    const { props: { onSubmit } } = this;
    onSubmit(current.value);
    current.value = '';
  }

  sendMessageOnEnter(e) {
    if (e.keyCode === 13) {
      this.sendMessage();
    }
  }

  render() {
    const sendMessage = () => this.sendMessage();
    const sendMessageOnEnter = (...args) => this.sendMessageOnEnter(...args);
    const { buttonText: text } = this.props;

    return (
      <Textbar>
        <Input
          type="text"
          ref={this.input}
          onKeyDown={sendMessageOnEnter}
        />
        <Button onClick={sendMessage}>{text}</Button>
      </Textbar>
    );
  }
}

TextBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
};
