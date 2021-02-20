const OFF = 'off';

module.exports = {
  extends: ['react-app', 'airbnb'],
  env: {
    browser: true
  },
  rules: {
    'import/prefer-default-export': OFF,
    'react/react-in-jsx-scope': OFF,
    'react/jsx-one-expression-per-line': OFF,
    'react/destructuring-assignment': OFF,
    'react/prop-types': OFF,
    'react/jsx-props-no-spreading': OFF,
    'object-curly-newline': OFF,
    'jsx-a11y/no-static-element-interactions': OFF,
  }
};
