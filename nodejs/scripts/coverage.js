const { runAndExit } = require('magic-carpet');

runAndExit(`
  echo "Coverage"
  && c8
    --check-coverage
    --statements 92
    --branches   90
    --functions  92
    --lines      92
    --reporter text-summary
    --reporter lcov
    yarn test:ci
`);
