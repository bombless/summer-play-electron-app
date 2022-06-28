export default {
    preLoaders: [
        {
          test: /\.js$/,
          exclude: /node_modules\/intl-/,
          loader: "source-map-loader"
        }
      ]
}
