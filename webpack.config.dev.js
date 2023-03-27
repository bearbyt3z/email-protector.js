const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.config.common');

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: commonConfig.output.path,
    },
    devMiddleware: {
      index: 'examples.html',
      writeToDisk: true,
    },
  },
});
