module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "util": require.resolve("util/"),
          "stream": require.resolve("stream-browserify"),
          "crypto": require.resolve("crypto-browserify"),
          "buffer": require.resolve("buffer/"),
          "process": require.resolve("process/browser"),
          "assert": require.resolve("assert/"),
          "http": require.resolve("stream-http"),
          "https": require.resolve("https-browserify"),
          "os": require.resolve("os-browserify/browser"),
          "url": require.resolve("url/"),
          "path": require.resolve("path-browserify"),
          "fs": false,
          "net": false,
          "tls": false,
          "zlib": false
        }
      }
    }
  }
}; 