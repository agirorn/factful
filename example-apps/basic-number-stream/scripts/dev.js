const { runAndExit } = require('magic-carpet');

runAndExit(`
  echo "Starting dev environment"
  && yarn add ../../nodejs
  && clear
  && yarn server:reset
  && clear
  && yardman
    -w /dev/null -x 'yarn start:client'

    -w package.json
    -w server
    -x 'clear && yarn start:producer'

    -w package.json
    -w server
    -x 'clear && yarn start:server'

    -w package.json
    -w server
    -w src
    -x 'clear && yarn lint'

    -w /dev/null -x 'yarn open:client'
`);
