const path = require('path');
const tailwindcss = require("tailwindcss");

module.exports = ({ config, mode }) => {

  config.module.rules.push({
    test: /\.css$/,
    loaders: [
      {
        loader: 'postcss-loader',
        options: {
          esModule: false,
          sourceMap: true,
          config: {
            path: './.storybook/',
          },
        },
        loader: 'css-loader',
        options: {
          esModule: false,
        }
      },
    ],

    include: path.resolve(__dirname, '../storybook/'),
  });

  return config;
};