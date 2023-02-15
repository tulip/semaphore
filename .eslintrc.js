module.exports = {
  "root": true,
  "extends": [
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "no-console": "error"
  },
  "overrides": [
    {
      "files": ["*.{ts,tsx}"],
      "parserOptions": {
        "tsconfigRootDir": __dirname,
        "project": "./tsconfig.json",
      },
      "extends": ["plugin:@typescript-eslint/recommended-requiring-type-checking"],
    }
  ]
};
