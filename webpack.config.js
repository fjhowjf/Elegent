const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require('webpack');
      
const config =module.exports = {
  // mode: 'development',
  entry: {
    'login':path.resolve(__dirname, 'src/login/index.js'),
    'content':path.resolve(__dirname, 'src/content/index.js'),
    'publish':path.resolve(__dirname, 'src/publish/index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './[name]/index.js',
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/login.html'), // 模板文件
      filename: path.resolve(__dirname, 'dist/login/index.html'), // 输出文件
      useCdn: process.env.NODE_ENV === 'production', // 生产模式下使用 cdn 引入的地址
      chunks: ['login'] // 引入哪些打包后的模块（和 entry 的 key 一致）
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/content.html'), // 模板文件
      filename: path.resolve(__dirname, 'dist/content/index.html'), // 输出文件
      useCdn: process.env.NODE_ENV === 'production', // 生产模式下使用 cdn 引入的地址
      chunks: ['content']
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/publish.html'), // 模板文件
      filename: path.resolve(__dirname, 'dist/publish/index.html'), // 输出文件
      useCdn: process.env.NODE_ENV === 'production', // 生产模式下使用 cdn 引入的地址
      chunks: ['publish']
    }),
    new MiniCssExtractPlugin(
      {
        filename: './[name]/index.css',
      }
    ),
    new webpack.DefinePlugin({
      // key 是注入到打包后的前端 JS 代码中作为全局变量
      // value 是变量对应的值（在 corss-env 注入在 node.js 中的环境变量字符串）
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  module: { // 加载器
    rules: [ // 规则列表
      {
        test: /\.css$/i, // 匹配 .css 结尾的文件
        // use: ['style-loader', 'css-loader'], // 使用从后到前的加载器来解析 css 代码和插入到 DOM
        use: [process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset',
        generator: {
          filename: 'assets/[hash][ext][query]'
        }
      }
    ]
  },
  // 优化
  optimization: {
    // 最小化
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 
      // `terser-webpack-plugin`），将下一行取消注释（保证 JS 代码还能被压缩处理）
      `...`,
      new CssMinimizerPlugin(),
    ],
  },
  // 优化
  optimization: {
    // 最小化
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 
      // `terser-webpack-plugin`），将下一行取消注释（保证 JS 代码还能被压缩处理）
      `...`,
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all', // 所有模块动态非动态移入的都分割分析
      cacheGroups: { // 分隔组
        commons: { // 抽取公共模块
          minSize: 0, // 抽取的chunk最小大小字节
          minChunks: 2, // 最小引用数
          reuseExistingChunk: true, // 当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用
          name(module, chunks, cacheGroupKey) { // 分离出模块文件名
            const allChunksNames = chunks.map((item) => item.name).join('~') // 模块名1~模块名2
            return `./js/${allChunksNames}` // 输出到 dist 目录下位置
          }
        }
      }
    }
  },
  resolve:{
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
}

if(process.env.NODE_ENV === 'development'){
  config.devtool = 'inline-source-map'
}
if(process.env.NODE_ENV === 'production'){
  config.externals = {
    'bootstrap/dist/css/bootstrap.min.css':'bootstrap',
    'axios':'axios',
    'form-serialize': 'serialize',
    '@wangeditor/editor': 'wangEditor'
  }
}

module.exports = config