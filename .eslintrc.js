module.exports = {
  root: true,
  extends: ['expo', 'prettier'],
  ignorePatterns: ['node_modules/', 'dist/', '.expo/'],
  rules: {
    'react/no-unstable-nested-components': 'off',
  },
};
