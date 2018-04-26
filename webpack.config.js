const path = require('path');
const webpack = require('webpack');
const loaders = require('./webpack.loaders');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const DashboardPlugin = require('webpack-dashboard/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || '8888';

loaders.push({
  test: /\.scss$/,
  loaders: [
    'style-loader',
    'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]_[local]__[hash:base64:5]',
    'sass-loader',
  ],
  exclude: ['node_modules'],
});

module.exports = {
  mode: 'development',
  target: 'web',
  cache: false,
  context: __dirname,
  devtool: process.env.WEBPACK_DEVTOOL || 'eval-source-map',
  entry: [
    'babel-polyfill',
    'intersection-observer',
    './src/index.jsx'
  ],
  output: {
    publicPath: '/',
    filename: 'bundle.[hash].js',
    path: path.join(__dirname, 'public'),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      utils: path.resolve(__dirname, 'src/utils'),
    },
  },
  module: {
    rules: loaders,
  },
  devServer: {
    contentBase: [
      path.resolve('public'),
      path.resolve('static'),
    ],
    // do not print bundle build stats
    noInfo: true,
    // enable HMR
    hot: true,
    // embed the webpack-dev-server runtime into the bundle
    inline: true,
    // serve index.html in place of 404 responses to allow HTML5 history
    historyApiFallback: true,
    port: PORT,
    host: HOST,
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        PORT: JSON.stringify(process.env.PORT),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.[chunkhash].css',
    }),
    new DashboardPlugin(),
    new HtmlWebpackPlugin({
      title: 'To Do',
      template: './src/template.html',
      files: {
        css: ['style.css'],
        js: ['bundle.js'],
      },
    }),
    new ScriptExtHtmlWebpackPlugin({
      preload: /\.js$/,
      defaultAttribute: 'async',
    }),
    new SWPrecacheWebpackPlugin(
      {
        cacheId: 'to-do-app',
        dontCacheBustUrlsMatching: /\.\w{8}\./,
        filename: 'service-worker.js',
        minify: true,
        navigateFallback: '/index.html',
        staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
      }
    ),
    new WebpackPwaManifest({
      inject: true,
      name: 'To Do App',
      short_name: 'To Do',
      description: 'To Do app',
      background_color: '#000000',
      theme_color: '#000000',
      icons: [
        {
          src: path.resolve('./static/assets/images/icon.png'),
          sizes: [96, 128, 192, 256],
        },
      ]
    }),
  ],
};
