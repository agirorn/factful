import React from 'react';
import styled from 'styled-components';
import { RIEInput, RIEToggle } from 'riek';
import { getSocket } from './websocket';
import manageUsers from '../domain/manageUsers';
import { activate, deactivate, updateName } from './commands';
import { postCommand } from './fetch';

const Container = styled.div`
  width: 400px;
  align-items: stretch;
  margin: auto;
`;

export default class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
    this.socket = getSocket();

    this.socket.on('message', (event) => {
      const { users: USERS } = this.state;
      let users = [...USERS];
      if (event.aggregate === 'CACHER' && event.name === 'USERS') {
        users = event.data;
      }
      users = manageUsers(users, event);

      this.setState({ users });
    });
  }

  render() {
    const changeUserActive = (user) => async ({ active }) => {
      const command = active ? activate : deactivate;
      await postCommand(command(user.aggregateId));
    };
    const changeUserName = (user) => async ({ name }) => {
      await postCommand(updateName(user.aggregateId, name));
    };
    const users = this.state.users.map((user) => (
      <tr key={user.aggregateId}>
        <td>
          <RIEInput
            value={user.name}
            change={changeUserName(user)}
            propName="name"
          />
        </td>
        <td>
          <RIEToggle
            value={user.active}
            propName="active"
            change={changeUserActive(user)}
          />
        </td>
        <td>
          {user.updatedAt}
        </td>
      </tr>
    ));
    return (
      <Container>
        <h1>Users</h1>
        <table>
          <tr>
            <th>Name</th>
            <th>Active</th>
            <th>Updated at</th>
          </tr>
          {users}
        </table>
      </Container>
    );
  }
}
