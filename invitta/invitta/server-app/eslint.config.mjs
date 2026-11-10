import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [...nextCoreWebVitals, ...nextTs, { ignores: [".next/**", "drizzle/**"] }];

export default config;
