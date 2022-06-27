const path = require("path");
const os = require('os');
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 浏览器渲染
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // 清除上次的打包文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // css 文件整合
const CopyWebpackPlugin = require("copy-webpack-plugin"); // 将public文件夹下的静态js文件,拷贝至build文件夹中
const Happypack = require('happypack'); // 多线程打包
// const OptimizeCssPlugin = require("optimize-css-assets-webpack-plugin"); // 压缩打包之后的css文件
// const autoprefixer = require("autoprefixer"); // 自动补充名称

const happyThreadPool = Happypack.ThreadPool({size: os.cpus().length})

const rootDir = process.cwd(); // 根目录

module.exports = {
  entry: path.resolve(rootDir, "src/main"), // 输入
  output: {
    // 输出
    path: path.resolve(rootDir, "dist"),
    filename: "bundle.[contenthash:8].js",
  },
  resolve: {
    alias: {
      "@public": path.resolve(rootDir, "public/"),
      "@src": path.resolve(rootDir, "src/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // 匹配规则
        use: "babel-loader", // 解析
        include: path.resolve(rootDir, "src"), // 匹配特定条件
        exclude: "/node_nodules/", //排除特定条件
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          "style-loader",
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
        use: "file-loader", // 解析
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
    new Happypack({
      id:'js',
      use: ["babel-loader"],
      threadPool: happyThreadPool
    }),
    // new OptimizeCssPlugin(),
    new CleanWebpackPlugin(),
  ],
};
