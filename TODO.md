# TO-DO

## figure out what to do about versioning

Set the entire stream to use versioning or not
How to handle it
where to store the options regarding this being a versioned stream

## Ensure the event function used for the SQL trigger is unique

By unique it could include the stream name in it.
It could have the factful version embed it in it.
Just what ever makes the most sens and allows multiple version of the lib to
co-exist in the same data base (Why, don't know)

## Rename

- PostgreSQLStream to PostgreSQL
- MemoryStream to Memory

## Make all streams have an offset.
## Make a file stream that stores the events as a file


Dose not have to be super performant bug good E nought for demos without adding
a data base.
https://github.com/npm/write-file-atomic


## Document how to configure PG

- How to configurers so the main user dose not have the correct privilages to
  destroy<F9> the streams

- How to configurers so the main user dose he can only creat streams and insert
  records

- Best practise is to have a separate DB for the read side.

## Make a python version

## Make a go version

## Make a ruby version

## Make a F#

## Make a Swift
https://developer.apple.com/swift/

## Make a Crystal version
https://crystal-lang.org/

## Make a Kotlin Version
https://kotlinlang.org/docs/reference/server-overview.html

## check if thie can also be done ins sqlite3 using the update event 

http://www.sqlite.org/c3ref/update_hook.html
https://github.com/mapbox/node-sqlite3/blob/833f5cc1332b9213a17873f42a3d3a18dca5afc1/lib/sqlite3.js#L147

```js
db = connect(....)
var supportedEvents = [ 'trace', 'profile', 'insert', 'update', 'delete' ];
supportedEvents.forEach((type) => {
  db.addListener(type, (...args) => {
    console.log(type, ...args);
  })
})
```

## Make a file stream that stores the events as a file

## Cleanup example apps

Currently there they are way to complex and dirty.

## Make a better DDD app with aggregate

## notes

const connection = new require('factful').Pg(new Pool());
const connection = new require('factful').Memmory();

const { PostgresSQL: Factful } = new require('factful');
const connection = new : Factful(new Pool());

const { Memmory: Factful } = require('factful')
const connection = new Factful();


for (await event in (new Factful(new Pool()).getLiveStream('events')) {
  console.log(event);
}
