const webpackConfig = require('./webpack.config');

module.exports = Object.assign(webpackConfig, {
  devtool: 'eval-source-map',

  output: {
    pathinfo: true,
    publicPath: '/',
    filename: '[name].js'
  }
});
