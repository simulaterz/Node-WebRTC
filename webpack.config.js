module.exports = {
  entry: {
    Main: ['./public/assets/scripts/Main.js'],
    Chat: ['./public/assets/scripts/Chat.js'],
    Login: ['./public/assets/scripts/Login.js']
  },
  output: {
    path: "./public/temp/scripts/",
    filename: "[name].js"
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
// module.exports = {
//   entry: {
//     Chat: "./public/assets/scripts/Chat.js",
//     Main: "./public/assets/scripts/Main.js",
//     Login: "./public/assets/scripts/Login.js"
//   },
//   output: {
//     path: "./public/temp/scripts/",
//     filename: "[name].js"
//   },
//   module: {
//     loaders: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         loader: 'babel-loader',
//         query: {
//           presets: ['es2015']
//         }
//       }
//     ]
//   }
// }
