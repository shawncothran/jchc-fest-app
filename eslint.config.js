import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist", "node_modules", ".vite", "build", "coverage"],
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      ...js.configs.recommended.rules,
      curly: ["error", "all"],
      "space-before-blocks": ["error", "always"],
      "no-var": "error",
      "prefer-const": "error",
    },
  },
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: config.files || ["**/*.{ts,tsx}"],
    languageOptions: {
      ...config.languageOptions,
      globals: globals.browser,
      parserOptions: {
        ...config.languageOptions?.parserOptions,
        projectService: true,
      },
    },
  })),
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      curly: ["error", "all"],
      "space-before-blocks": ["error", "always"],
      "no-var": "error",
      "prefer-const": "error",
      "@typescript-eslint/explicit-function-return-types": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  }
);
