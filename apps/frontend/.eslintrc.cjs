/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/react.js"],
  overrides: [
    {
      files: [".eslintrc.cjs"],
      env: {
        node: true,
      },
    },
    {
      files: ["**/*.ts", "**/*.tsx"],
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    {
      files: ["vite.config.ts"],
      parserOptions: {
        project: "./tsconfig.node.json",
      },
    },
  ],
};
