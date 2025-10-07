import config from "eslint-config-reearth";

/** @type { import("eslint").Linter.Config[] } */
export default [
  ...config("@visualizer-plugin-server", { reactRecommended: true }),
  {
    files: ["tests/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  { ignores: ["node_modules/", "dist/"] },
];
