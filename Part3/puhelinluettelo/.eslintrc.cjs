module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    //"plugin:react/recommended",
    //"plugin:react-hooks/recommended",
    //"plugin:jsx-a11y/recommended",
    "plugin:import/errors",
    "plugin:import/warnings"
  ],
  "globals": {
    "process": "readonly",
    "App": "readonly",
    "Person": "readonly"
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 2021,
    "sourceType": "module",
    "requireConfigFile": false,
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "plugins": [
    "react",
    "react-hooks",
    "jsx-a11y",
    "import"
  ],
  "rules": {
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "no-console": "warn",
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "jsx-a11y/anchor-is-valid": "off",
    "@typescript-eslint/no-require-imports": "off"
  }
};
