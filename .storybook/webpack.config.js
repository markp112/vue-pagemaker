const path = require('path');
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = async ({ config, mode }) => {
    config.module.rules.push({
        test: /\.vue$/,
        loader: require.resolve('ts-loader'),
        include: path.resolve(__dirname, '../src/'),
        options: { appendTsSuffixTo: [/\.vue$/]}
    });
    config.resolve.plugins = config.resolve.plugins || [];
    config.resolve.plugins.push(new TsconfigPathsPlugin({}));
    return config;
};