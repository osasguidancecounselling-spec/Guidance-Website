import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginCypress from "eslint-plugin-cypress/flat";
import pluginJest from "eslint-plugin-jest";

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  // Main React source code configuration
  {
    files: ["src/**/*.{js,jsx}"],
    ...pluginReactConfig,
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    languageOptions: {
      ...pluginReactConfig.languageOptions,
      globals: { ...globals.browser },
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReactConfig.rules,
      ...pluginReactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
    settings: {
      react: { version: "detect" },
    },
  },
  // Cypress end-to-end test configuration
  {
    files: ["cypress/e2e/**/*.cy.{js,jsx}"],
    ...pluginCypress.configs.recommended,
  },
  // Jest unit/integration test configuration
  {
    files: ["src/**/__tests__/**/*.{js,jsx}", "src/**/*.{spec,test}.{js,jsx}"],
    ...pluginJest.configs.flat.recommended,
    languageOptions: {
      globals: { ...globals.jest },
    },
    rules: {
      ...pluginJest.configs.flat.recommended.rules,
    },
  },
  // Configuration for project config files
  {
    files: ["*.config.js", "*.config.cjs", ".eslintrc.js"],
    languageOptions: {
      parserOptions: {
        sourceType: "commonjs",
      },
      globals: { ...globals.node },
    },
  },
];
