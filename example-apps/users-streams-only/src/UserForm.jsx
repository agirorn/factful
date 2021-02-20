import React, { useState } from 'react';
import { postCommand } from './fetch';
import { create } from './commands';

const Text = (props) => (<input type="text" {...props} />);
const Checkbox = (props) => (<input type="checkbox" {...props} />);
const LabeldCheckbox = ({ id, children, ...props }) => (
  <label htmlFor={id}>
    {children}
    <Checkbox id={id} {...props} />
  </label>
);

export default function UserForm() {
  const DEFAULT_USER = {
    name: '',
    active: true,
  };
  const [state, setState] = useState({ ...DEFAULT_USER });
  const save = async (event) => {
    event.preventDefault();
    await postCommand(create(state.name, state.active));
    setState({ ...DEFAULT_USER });
  };
  const update = (attr) => { setState({ ...state, ...attr }); };
  const changeName = ({ target }) => update({ name: target.value });
  const changeActive = ({ target }) => update({ active: target.checked });
  return (
    <form onSubmit={(e) => save(e)}>
      <h1>New User</h1>
      <Text
        name="name"
        value={state.name}
        onChange={changeName}
      />
      <br />
      <LabeldCheckbox
        checked={state.active}
        onChange={changeActive}
      >
        Active
      </LabeldCheckbox>
      <br />
      <br />
      <input type="submit" value="Save" />
    </form>
  );
}
