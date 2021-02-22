const autoprefixer = require("autoprefixer");
const tailwindcss = require("tailwindcss");

module.exports = {
  plugins: [
    require('postcss-import')(),
    tailwindcss('./tailwind.config.js'), //This refers to your tailwind config
    autoprefixer(),
  ],
};