import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
    // Generated artifacts of the workspace docs app.
    "docs/.next/**",
    "docs/.source/**",
    "docs/out/**",
    // Historical migration snapshots are not part of the active app surface.
    "tmp/**",
  ]),
]);

export default eslintConfig;
