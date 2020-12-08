const path = require('path')
const webpack = require('webpack')

module.exports = {
  // 要打包的第三方模块的数组
  entry: {
    vendor: ['vue']
  },
  output: {
    path: path.resolve(__dirname, '../static/js'), // 打包后文件输出的位置
    filename: '[name].dll.js',
    library: '[name]_[fullhash]' // 这里需要和webpack.DllPlugin中的`name: '[name]_[fullhash]'`保持一致
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../[name]-manifest.json'),
      context: __dirname,
      name: '[name]_[fullhash]'
    })
  ]
}