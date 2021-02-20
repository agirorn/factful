/* eslint-disable object-property-newline */
import { v4 as uuid } from 'uuid';

const user = (name, aggregateId, data = {}) => ({
  aggregate: 'USERS',
  aggregateId,
  name,
  data,
});

export const activate = (id) => user('ACTIVATE', id);
export const deactivate = (id) => user('DEACTIVATE', id);
export const updateName = (id, name) => user('UPDATE_NAME', id, { name });
export const create = (name, active) => user('CREATE', uuid(), { name, active });
