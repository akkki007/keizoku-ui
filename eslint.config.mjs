import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/* eslint-config-next 16 ships flat configs directly — no FlatCompat. */
const config = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "skills/**",
      "docs/**",
      // Generated: the shadcn registry manifests and the Pagefind index.
      "public/r/**",
      "public/_pagefind/**",
    ],
  },
];

export default config;
