/**
 * 描述：这是一个loader
 * 功能：去除代码中的console
 * 备注：虽然但是，其实terserPlugin已经集成了这个去除console功能，详情见[drop_console传送门](https://github.com/terser/terser#minify-options)
 */

const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const t = require('@babel/types')
module.exports = function(source) {
  const ast = parser.parse(source, { sourceType: 'module' })
  traverse(ast, {
    CallExpression(path) {
      if(t.isMemberExpression(path.node.callee) && t.isIdentifier(path.node.callee.object, { name: 'console' })) {
        path.remove()
      }
    }
  })
  const output = generator(ast, {}, source)
  return output.code
}

/**
 * 使用方式如下：
 * 在webpack.config.js中
 */
// rules:[{
//   test: /\.js$/,
//   use: path.resolve(__dirname,'drop-console.js')
//   }
// ]