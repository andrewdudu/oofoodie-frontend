const CompressionWebpackPlugin = require("compression-webpack-plugin");

module.exports = {
  configureWebpack: {
    plugins: [
      new CompressionWebpackPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.(js|css)$/,
      }),
    ],
  },
  assetsDir: "static",
  devServer: {
    https: true,
    proxy: {
      "^/api/": {
        target: "http://192.168.5.6:8080",
        changeOrigin: true,
      },
      "^/auth/": {
        target: "http://192.168.5.6:8080",
        changeOrigin: true,
      },
    },
  },
};
