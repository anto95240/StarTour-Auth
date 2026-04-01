module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'func-names': 'off',
    'object-shorthand': 'off',
    'class-methods-use-this': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-underscore-dangle': 'off',
  },
};
