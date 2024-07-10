import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        "pretty-card":
          "0px 0px 0px 1px #0E3F7E08, 0px 1px 1px -0.5px #2A334508, 0px 3px 3px -1.5px #2A334608, 0px 6px 6px -3px #2A334608, 0px 12px 12px -6px #0E3F7E08, 0px 24px 24px -12px #0E3F7E10",
      },
    },
  },
  plugins: [],
};
export default config;
