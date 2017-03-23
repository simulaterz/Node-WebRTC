module.exports = {
  entry: "./public/assets/scripts/App.js",
  output: {
    path: "./public/temp/scripts",
    filename: "App.js"
  },
  devtool: true,
  devtool: 'source-map',
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
}
