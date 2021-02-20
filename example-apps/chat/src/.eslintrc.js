module.exports = {
  extends: ['react-app', 'airbnb'],
  env: {
    browser: true
  },
  rules: {
    'import/prefer-default-export': 'off',
    'react/react-in-jsx-scope': 'off',
  }
};
