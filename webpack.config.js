module.exports = {
  entry: {
        Main: "./public/assets/scripts/Main.js",
        Chat: "./public/assets/scripts/Chat.js",
  },
  output: {
    path: "./public/temp/scripts"
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
}
