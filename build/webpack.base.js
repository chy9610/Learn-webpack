const path = require("path");
const os = require("os");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 预编译资源模块 (浏览器渲染)
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // 清除上次的打包文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // css 文件整合
const CopyWebpackPlugin = require("copy-webpack-plugin"); // 将public文件夹下的静态js文件,拷贝至build文件夹中
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer"); // 依赖包分析
const threadLoader = require("thread-loader");
// const OptimizeCssPlugin = require("optimize-css-assets-webpack-plugin"); // 压缩打包之后的css文件

const rootDir = process.cwd(); // 根目录

module.exports = {
  stats: "errors-only",
  entry: path.resolve(rootDir, "src/main"), // 输入
  output: {
    // 输出
    path: path.resolve(rootDir, "dist"),
    filename: "bundle.[contenthash:8].js",
  },
  resolve: {
    extensions: [".js", ".json"],
    alias: {
      "@public": path.resolve(rootDir, "public/"),
      "@src": path.resolve(rootDir, "src/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // 匹配规则
        use: ["thread-loader", "babel-loader"], // 解析
        include: path.resolve(rootDir, "src"), // 匹配特定条件
        exclude: "/node_nodules/", //排除特定条件
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          "style-loader",
          // "thread-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["autoprefixer"]],
              },
            },
          },
          "less-loader",
        ],
        exclude: "/node_modules/",
      },
      {
        test: /\.(png|jpe?g|gif)$/i, // 匹配规则
        use: [
          {
            loader: "file-loader",
            options: {
              name() {
                if (process.env.NODE_ENV === "development") {
                  return "[path][name].[ext]";
                }
                return "[contenthash].[ext]";
              },
              outputPath: "assets",
              publicPath: "assets",
            },
          },
        ], // 解析
        exclude: "/node_nodules/", //排除特定条件
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(rootDir, "public/index.html"),
      inject: "body",
      scriptLoading: "blocking",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "*.js",
          context: path.resolve(rootDir, "public/js"),
          to: path.resolve(rootDir, "dist/js"),
        },
        {
          from: "*.css",
          context: path.resolve(rootDir, "public/css"),
          to: path.resolve(rootDir, "dist/css"),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    new BundleAnalyzerPlugin(),
    // new OptimizeCssPlugin(),
    // new CleanWebpackPlugin(),
  ],
  optimization: {
    runtimeChunk: "single",
  },
};
