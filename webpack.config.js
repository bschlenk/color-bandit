/* global __dirname, require, module */

const webpack = require('webpack');
const path = require('path');
const { env } = require('yargs').argv; // use --env with webpack 2

const { UglifyJsPlugin } = webpack.optimize;

const libraryName = 'ColorBandit';
const fileName = 'color-bandit';

const plugins = [];
if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
}

const outputFile = `${fileName}.js`;
const outputFileBrowser = `${fileName}-browser.js`;

function createOutputConfig(filename) {
  return {
    path: path.join(__dirname, 'lib'),
    filename,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  };
}

const configBase = {
  entry: path.join(__dirname, 'src', 'index.js'),
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
    canvas: 'canvas',
  },
};

const nodeConfig = Object.assign({}, configBase);
nodeConfig.output = createOutputConfig(outputFile);
nodeConfig.target = 'node';

const browserConfig = Object.assign({}, configBase);
browserConfig.output = createOutputConfig(outputFileBrowser);
browserConfig.target = 'web';
browserConfig.resolve = Object.assign({
  alias: {
    [path.join(__dirname, 'src', 'canvas')]: path.join(__dirname, 'src', 'canvas-browser'),
  },
}, browserConfig.resolve);

module.exports = [nodeConfig, browserConfig];
