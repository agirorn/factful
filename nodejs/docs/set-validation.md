# Set validation

Set validation is the process of validating something across a set of
aggregates. For example, a common set validation is ensuring users' unique email
addresses.

Set validation is quite hard to do correctly in event sourcing, especially for
the uniqueness of things. It becomes slow to read all events for the set, and it
is hard to ensure correctness when saving without blocking all saves to the
event stream.

One common solution to set validation is having an extra table containing the
set validation. This table contains the unique items and can be used to ensure
that the validation holds when saving the events.

## Example:

**Set validation table**

```sql
create table users_unique_email_address_constraint (
  email text PRIMARY KEY -- constraint
);
```

**Set validation when saving events**

```js
  const event = userCreatedEvent(...args);
  history.save(
    event,
    async (db) => db.query(
      `INSERT INTO unique_emails (email) VALUES (${event.data.email});`,
    ),
  )
```


More information on [set validataion] can be found in
[Ægirs notes on event sourcing]

[set validataion]: https://github.com/agirorn/event-sourcing/blob/master/set-validation.md)
[Ægirs notes on event sourcing]: https://github.com/agirorn/event-sourcing/)
