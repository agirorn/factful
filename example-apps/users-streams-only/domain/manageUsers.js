const by = (event) => (user) => (
  user.aggregateId === event.aggregateId
);

const NAME_UPDATED = ({ name }) => name === 'NAME_UPDATED';
const ACTIVATED = ({ name }) => name === 'ACTIVATED';
const DEACTIVATED = ({ name }) => name === 'DEACTIVATED';
const USER_UPDATE = (event) => [
  NAME_UPDATED,
  ACTIVATED,
  DEACTIVATED,
].find((test) => test(event));

const manageUsers = (USERS, event) => {
  const users = [...USERS];
  if (event.aggregate === 'USERS') {
    if (event.name === 'CREATED') {
      users.push({
        ...event.data,
        aggregateId: event.aggregateId,
        updatedAt: event.timestamp,
      });
    }

    if (USER_UPDATE(event)) {
      const user = users.find(by(event));
      user.updatedAt = event.timestamp;
      if (NAME_UPDATED(event)) { user.name = event.data.name; }
      if (ACTIVATED(event)) { user.active = true; }
      if (DEACTIVATED(event)) { user.active = false; }
    }
  }
  return users;
};

module.exports = manageUsers;
