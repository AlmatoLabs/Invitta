import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextCoreWebVitals,
  ...nextTs,
  { ignores: [".next/**"] },
  {
    rules: {
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-explicit-any": "off",
      // React Compiler-era rules: the prototype (and generated shadcn files) hydrate state from
      // effects. Kept visible as warnings instead of blocking the build.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/refs": "warn",
    },
  },
];

export default config;
