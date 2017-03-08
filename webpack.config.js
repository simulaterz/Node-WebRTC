const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./public/assets/scripts/App.js",
  output: {
    path: "./public/temp/scripts",
    filename: "App.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
  // ,
  // plugins: [
  //   new htmlWebpackPlugin ({
  //     inject: true,
  //     template: 'public/index.html'
  //   })
  // ]
}
