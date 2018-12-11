module.exports = {
  "extends": ["airbnb", "plugin:jest/recommended"],
  "rules": {
    "import/prefer-default-export": 0,
    "arrow-parens": 0,
    "camelcase": 0,
    "import/no-extraneous-dependencies": 0,
    "react/forbid-prop-types": [false],
    "object-curly-newline": 0,
    "no-param-reassign": 0,
    "react/no-array-index-key": 0,
    "no-nested-ternary": 0,
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }]
  },
  "env": {
    "browser": true,
  },
  "plugins": ["jest"]
};