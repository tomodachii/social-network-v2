module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    commonjs: true,
    jest: true,
  },
  extends: ["react-app", "react-app/jest", "plugin:prettier/recommended"],
  plugins: ["prettier"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    React: "writable",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./front-end/tsconfig.json", "./front-end/tsconfig.node.json"],
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2022,
    sourceType: "module",
    "import/resolver": {
      typescript: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      },
    },
  },
  rules: {
    complexity: [
      "error",
      {
        max: 100,
      },
    ],
    "no-use-before-define": "off",
    "no-console": "error",
    "no-debugger": "error",
    "prefer-const": [
      "error",
      {
        destructuring: "any",
        ignoreReadBeforeAssign: false,
      },
    ],
    "testing-library/no-node-access": "off",
    "no-unused-vars": "off",
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "lodash",
            message: "Import [module] from lodash/[module] instead",
          },
        ],
      },
    ],
    "spaced-comment": [
      "error",
      "always",
      {
        markers: ["/"],
      },
    ],
    "@typescript-eslint/indent": ["off"],
    "@typescript-eslint/quotes": ["off"],
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-use-before-define": ["error"],
    "react/no-unknown-property": [
      "error",
      {
        ignore: ["css"],
      },
    ],
    "react/no-unstable-nested-components": [
      "error",
      {
        allowAsProps: false,
      },
    ],
    "import/order": [
      "warn",
      {
        "newlines-between": "always",
        distinctGroup: false,
        groups: ["builtin", "external", "parent", "sibling", "index"],
      },
    ],
    "prettier/prettier": [
      "error",
      { endOfLine: "auto" },
      {
        usePrettierc: true,
      },
    ],
    "import/no-duplicates": ["error", { "prefer-inline": true }],
  },
  ignorePatterns: [".yarn/", ".husky/", "node_modules/", "coverage/", "public/", "dist/", "*.cjs"],
  overrides: [
    {
      files: ["*.d.ts"],
      rules: {
        "@typescript-eslint/triple-slash-reference": ["off"],
      },
    },
  ],
};
