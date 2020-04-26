const merge = require('webpack-merge');
const commonConfig = require('./webpack.config.common');

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    index: 'examples.html',
    contentBase: commonConfig.output.path,
    writeToDisk: true,
  },
});
