const { runAndExit } = require('magic-carpet');

const url = 'http://localhost:8080/';

runAndExit(`
  echo "Opening website"
  wait-on ${url}
  && open ${url}
`);
