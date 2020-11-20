// 开发环境配置文件
// 开发环境主要实现的是热更新,不要压缩代码，完整的sourceMap

const Webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
const { merge } = require('webpack-merge')

module.exports = merge(webpackConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    port: 3000,
    hot: true,
    contentBase: '../dist'
  },
  plugins: [
    new Webpack.HotModuleReplacementPlugin()
  ]
})
