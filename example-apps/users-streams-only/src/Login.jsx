import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { post } from './fetch';

const Text = (props) => (<input type="text" {...props} />);
const Password = (props) => (<input type="password" {...props} />);

const Label = styled.label`
  margin: auto;
  width: 240px;
  float: right;
  & > input {
      float: right;
  }
`;

const Button = styled.button`
  float:right;
`;

export default function Login() {
  useEffect(() => { document.title = 'Login'; }, []);
  const DEFAULT_USER = {
    password: '',
    username: '',
    error: false,
  };
  const [state, setState] = useState(DEFAULT_USER);
  const save = async (event) => {
    event.preventDefault();
    const response = await post(
      '/login',
      {
        username: state.username,
        password: state.password,
      },
    );
    if (response.ok) {
      window.location.pathname = '/';
    } else {
      const error = await response.text();
      try {
        const json = JSON.parse(error);
        setState({ ...state, error: json.message });
      } catch (err) {
        setState({ ...state, error });
      }
    }
  };
  const update = (attr) => { setState({ ...state, ...attr }); };
  const changeUsername = ({ target }) => update({ username: target.value });
  const changePassword = ({ target }) => update({ password: target.value });
  return (
    <form onSubmit={(e) => save(e)}>
      <h1>Login</h1>
      <table>
        <tbody>
          {
            state.error
            && (
              <tr>
                <td>
                  Error: {state.error}
                </td>
              </tr>
            )
          }
          <tr>
            <td>
              <Label>
                Username
                <Text
                  name="username"
                  value={state.username}
                  onChange={changeUsername}
                />
              </Label>
            </td>
          </tr>
          <tr>
            <td>
              <Label>
                Password
                <Password
                  name="password"
                  value={state.password}
                  onChange={changePassword}
                />
              </Label>
            </td>
          </tr>
          <tr>
            <td>
              <Button type="submit" name="submit">
                Login
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
}
