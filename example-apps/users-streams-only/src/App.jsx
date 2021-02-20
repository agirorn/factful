/* eslint no-unused-vars: "error" */
import React from 'react';
import 'regenerator-runtime/runtime';
import {
  BrowserRouter as Router,
  // Switch,
  Route,
  // Link
} from 'react-router-dom';

import UserForm from './UserForm';
import Login from './Login';
import Users from './Users';

export default function App() {
  return (
    <Router>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/users">
        <Users />
      </Route>
      <Route path="/" exact>
        <UserForm />
      </Route>
    </Router>
  );
}
