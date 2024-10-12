/** @type {import("prettier").Config} */
export default {
  printWidth: 80,
  tabWidth: 2,
  trailingComma: "none",
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro"
      }
    }
  ]
};
