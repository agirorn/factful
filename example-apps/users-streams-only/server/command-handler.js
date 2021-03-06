const setup = (streams) => async (req) => {
  const { body: command } = req;
  if (command.aggregate === 'USERS') {
    if (command.name === 'CREATE') {
      await streams.save([{
        aggregate: 'USERS',
        aggregateId: command.aggregateId,
        name: 'CREATED',
        data: {
          ...command.data,
        },
      }]);
    }
    if (command.name === 'UPDATE_NAME') {
      await streams.save([{
        aggregate: 'USERS',
        aggregateId: command.aggregateId,
        name: 'NAME_UPDATED',
        data: {
          ...command.data,
        },
      }]);
    }

    if (command.name === 'ACTIVATE') {
      await streams.save([{
        aggregate: 'USERS',
        aggregateId: command.aggregateId,
        name: 'ACTIVATED',
        data: {},
      }]);
    }

    if (command.name === 'DEACTIVATE') {
      await streams.save([{
        aggregate: 'USERS',
        aggregateId: command.aggregateId,
        name: 'DEACTIVATED',
        data: {},
      }]);
    }
  }
};

module.exports = {
  commandHandler: setup,
};
