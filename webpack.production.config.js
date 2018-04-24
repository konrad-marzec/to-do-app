const path = require('path');
const webpack = require('webpack');
const loaders = require('./webpack.loaders');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

loaders.push({
  test: /\.(scss|sass|css)$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        minimize: {
          safe: true
        }
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        plugins: () => [
          autoprefixer
        ]
      },
    },
    {
      loader: 'sass-loader',
      options: {
        includePaths: [
          path.resolve('./src'),
          path.resolve('.'),
        ],
      }
    }
  ]
});

module.exports = {
  mode: 'production',
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
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          output: {
            comments: false
          },
          compress: {
            warnings: false,
            drop_console: true,
            drop_debugger: true,
          },
        },
      })
    ]
  },
  plugins: [
    new WebpackCleanupPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.[chunkhash].css',
    }),
    new HtmlWebpackPlugin({
      title: 'To Do',
      host: '',
      filename: path.join(__dirname, 'index.html'),
      template: './src/template.html',
      files: {
        css: ['style.css'],
        js: ['bundle.js'],
      },
    }),
    new ScriptExtHtmlWebpackPlugin({
      preload: /\.js$/,
      defaultAttribute: 'async'
    }),
    new WebpackPwaManifest({
      inject: true,
      name: '',
      short_name: '',
      description: '',
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
