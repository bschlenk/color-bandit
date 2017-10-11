/* global __dirname, require, module */

const webpack = require('webpack');
const path = require('path');
const { env } = require('yargs').argv; // use --env with webpack 2

const { UglifyJsPlugin } = webpack.optimize;

const libraryName = 'ColorBandit';
const fileName = 'color-bandit.js';

const plugins = [];
if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
}

module.exports = {
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    path: path.join(__dirname, 'lib'),
    filename: fileName,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
      },
      /*
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
      */
    ],
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js'],
  },
  plugins,
  externals: {
    'canvas-everywhere': 'canvas-everywhere',
  },
};

