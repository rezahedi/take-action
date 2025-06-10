import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginPrettier from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
  }),
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    plugins: { prettier: pluginPrettier },
    rules: {
      ...configPrettier.rules, // Disable conflicting ESLint rules
      'prettier/prettier': 'error', // Treat Prettier formatting issues as ESLint errors
    },
  },
];

export default eslintConfig;
