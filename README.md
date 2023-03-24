# svg-preview-plugin

说明：解决项目中 svg 文件过多，不好同意查看管理的问题（支持 vite 和 webpack）


<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c452533b0e847f48c10872a465d1e19~tplv-k3u1fbpfcp-watermark.image">

功能：
- 实时预览 svg，动态更新预览内容
- 复制文件名
- 复制文件路径
- 删除文件

# use

```
npm i -D svg-preview-plugin@latest
```

## options

* dirPath
  * Type: `string | array`
  * Desc: `预览路径`

* open
  * Type: `boolean`
  * Default: `true`
  * Desc: `自动打开预览窗口`

* port
  * Type: `number`
  * Default: 3000
  * Desc: `预览端口`

* deep
  * Type: `boolean`
  * Default: `false`
  * Desc: `是否递归显示 dirPath 里的 svg`

* formatName
  * Type: `function`
  * Desc: `自定义复制内容`

## example

```js
// webpack
const { WebpackPlugin } = require('svg-preview-plugin')

module.exports = {
  plugins: [
    new WebpackPlugin({
      dirPath: path.resolve('src/assets/icons/svg'),
      port: 3000,
      deep: true,
      formatName({name, filePath}) {
        return `<MyIcon name="${name}" />`
      }
    })
  ]
}
```

```js
// vite | rollup
import { VitePlugin } from 'svg-preview-plugin'

module.exports = {
  plugins: [
    VitePlugin({
      dirPath: path.resolve('src/assets/icons/svg'),
      port: 3000,
      deep: true,
      formatName({name, filePath}) {
        return `<MyIcon name="${name}" />`
      }
    })
  ]
}
```