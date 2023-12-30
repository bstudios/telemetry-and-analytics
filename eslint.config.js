import prettier from "prettier";
import remixEslintConfig from "@remix-run/eslint-config";
export default [
  {
    prettier,
    remixEslintConfig,
    files: ["app/**/*.ts", "app/**/*.tsx"],
  },
];
