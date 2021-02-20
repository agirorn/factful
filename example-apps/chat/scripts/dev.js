const { runAndExit } = require('magic-carpet');

runAndExit(`
  echo "Magic Carpet"
  && yardman
    -w /dev/null -x 'yarn start:client'

    -w package.json
    -w server
    -x 'clear && yarn start:server'

    -w package.json
    -w server
    -w src
    -x 'clear && yarn lint'
`);
