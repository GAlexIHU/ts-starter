const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended",
    "prettier",
    "eslint-config-turbo",
    "turbo",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:eslint-comments/recommended",
  ],
  plugins: ["@typescript-eslint", "simple-import-sort", "prettier"],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
  },
  parser: "@typescript-eslint/parser",
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/",
  ],
  rules: {
    complexity: ["error", 10],
    "prefer-object-spread": "error",
    "prefer-const": ["error", { destructuring: "all" }],
    "func-names": ["error", "as-needed"],
    "no-new-object": "error",
    "no-eq-null": "error",
    eqeqeq: "error",
    "arrow-body-style": ["warn", "as-needed"],
    curly: ["error", "all"],
    "prefer-arrow-callback": ["error", { allowNamedFunctions: true }],
    "prefer-spread": "error",
    "no-duplicate-imports": "error",
    "guard-for-in": "error",
    "no-useless-call": "error",
    "no-useless-return": "error",
    "no-useless-concat": "error",
    "no-eval": "error",
    "no-floating-decimal": "error",
    "default-case": "error",
    "default-case-last": "error",
    "max-statements-per-line": "error",
    "max-params": ["warn", { max: 6 }],
    "prettier/prettier": "error",
    "simple-import-sort/imports": [
      "error",
      {
        groups: [["^\\u0000", "^@?\\w", "^[^.]", "^\\."]],
      },
    ],
    "simple-import-sort/exports": "error",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/no-shadow": "error",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-dupe-class-members": "error",
    "@typescript-eslint/no-meaningless-void-operator": "error",
    "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
    "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
    "@typescript-eslint/no-unnecessary-type-arguments": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/no-useless-empty-export": "error",
    "@typescript-eslint/no-throw-literal": [
      "error",
      {
        // This should ideally be `false`, but it makes rethrowing errors inconvenient. There should be a separate `allowRethrowingUnknown` option.
        allowThrowingUnknown: true,
        allowThrowingAny: false,
      },
    ],
  },
  overrides: [
    {
      files: ["*.js?(x)", "*.ts?(x)"],
    },
    {
      files: ["*.test.ts", "*.spec.ts"],
      plugins: ["vitest"],
      extends: ["plugin:vitest/recommended"],
    },
  ],
};
