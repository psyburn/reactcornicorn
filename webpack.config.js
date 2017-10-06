const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appPath = path.join(__dirname, 'app');
const assetsPath = path.join(__dirname, 'assets');

module.exports = {
  entry: {
    bundle: path.join(appPath, 'index')
  },
  resolve: {
    modules: ['node_modules', appPath, assetsPath]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.ejs'),
      title: 'Reactcornicorn'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-loader'
      },
      {
        test: /\.scss/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              includePaths: [assetsPath]
            }
          }
        ]
      },
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      }
    ]
  }
};
