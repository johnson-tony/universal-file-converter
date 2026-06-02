import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Break circular references in plugins
const pluginsToFix = [
  { name: "@next/next", plugin: nextPlugin },
  { name: "react", plugin: reactPlugin },
];

for (const { name, plugin } of pluginsToFix) {
  if (plugin.configs) {
    for (const key in plugin.configs) {
      const config = plugin.configs[key];
      if (config.plugins?.[name]) {
        config.plugins[name] = { ...config.plugins[name] };
        delete config.plugins[name].configs;
      }
    }
  }
}

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/exhaustive-deps": "off",
      "prefer-const": "off",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
