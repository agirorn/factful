module.exports = {
  extends: 'eslint-config-airbnb-base',
  rules: {
    'max-len': ['error', {
      code: 80,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreComments: true,
    }],
    'no-restricted-syntax': 'off',
  },
};
