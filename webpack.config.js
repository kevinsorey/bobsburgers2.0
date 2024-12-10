const webpack = require('webpack');

module.exports = {
  resolve: {
    extensions: ['.js', '.json'],
    fallback: {
      "url": require.resolve("url/"),
      "buffer": require.resolve("buffer/"),
      "assert": require.resolve("assert/"),
      "util": require.resolve("util/"),
      "process": require.resolve("process/browser"),
      "stream-http": require.resolve("stream-http"),
      "https-browserify": require.resolve("https-browserify"),
      "process": require.resolve("process/browser"),
      "http": require.resolve("stream-http"),
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
};
