// 生产环境配置文件
// 生产环境主要实现的是压缩代码、提取css文件、合理的sourceMap、分割代码

const path = require('path')
const webpackConfig = require('./webpack.config.js')
const { merge } = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = merge(webpackConfig, {
  mode: 'production',
  devtool: 'nosources-source-map',
  plugins: [
    new CopyWebpackPlugin({
      patterns:
      [{
        from: path.resolve(__dirname, '../public'),
        to: path.resolve(__dirname, '../dist')
      }]
    })
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        exclude: /node_modules/
      }),
      new OptimizeCssAssetsPlugin({})
    ],
    splitChunks: {
      chunks: "async",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
})