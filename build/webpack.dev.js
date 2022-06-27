const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base");

module.exports = merge(baseConfig, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    port: "3000",
    hot: true,
    // stats: "errors-only",
    compress: true, // 启用 gzip 压缩
    proxy: {
      "/api": {
        target: "http://api.zhihu.com",
        pathWrite: {
          "/api": "",
        },
      },
    },
  },
});
