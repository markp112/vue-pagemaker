const path = require('path');

module.exports = async ({ config, mode }) => {
    config.module.rules.push({
        test: /\.vue$/,
        loader: require.resolve('vue-loader'),
        include: path.resolve(__dirname, '../src/'),
    });
    return config;
};