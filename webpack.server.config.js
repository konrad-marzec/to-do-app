'use strict';
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  name: 'server',
  target: 'node',
  externals: [nodeExternals()],
  entry: [
    'babel-polyfill',
    './server.js',
  ],
  output: {
    path: path.join(__dirname, '/'),
    filename: 'server.build.js',
    publicPath: '/',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(css|scss|gif|jpg|png|svg|ttf|mp4|woff|eot)$/,
        loader: 'ignore-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      utils: path.resolve(__dirname, 'src/utils'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        PORT: JSON.stringify(process.env.PORT),
        NODE_ENV: '"production"',
      }
    }),
  ],
};
