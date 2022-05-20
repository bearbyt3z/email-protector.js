const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'email-protector.js',
    path: path.resolve(__dirname, 'build'),
    libraryTarget: 'window',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'examples.html',
      inject: 'head',
      minify: false,
      scriptLoading: 'blocking',
      template: path.resolve(__dirname, 'src', 'index.html'),
    }),
    new ESLintPlugin({
      extensions: 'js',
      exclude: '/node_modules/',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
};
