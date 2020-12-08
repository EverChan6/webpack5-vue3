const { compilation } = require("webpack")

/**
 * 描述：这是一个plugin
 * 功能：在生成打包文件之前自动生成一个关于打包出来的文件的大小信息
 */
class FileListPlugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    // emit is asynchronous hook, tapping into it using tapAsync, you can use tapPromise/tap(synchronous) as well
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, callback) => {
      // Create a header string for the generated file:
      let fileList = 'In this build:\n\n'

      // Loop through all compiled assets,
      // adding a new line item for each filename.
      for(let filename in compilation.assets) {
        fileList += '- ' + filename + '\n'
      }

      // Insert this list into the webpack build as a new file asset:
      compilation.assets['filelist.md'] = {
        source: function() {
          return fileList
        },
        size: function() {
          return fileList.length
        }
      }
      
      callback()
    })
  }
}

module.exports = FileListPlugin