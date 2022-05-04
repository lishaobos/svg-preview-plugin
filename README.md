# svg-preview-plugin

说明：解决项目中 svg 文件过多，不好管理的问题（支持 vite 和 webpack）


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

- dirPath: String | Array
  - preview path

- port: Number
  - web port

## example

```
// webpack
const SvgPreview = require('svg-preview-plugin')

module.exports = {
  plugins: [
    new SvgPreview.WebpackPlugin({
      dirPath: path.resolve('src/common/icons/svg'),
      port: 3000
    })
  ]
}
```

```
// vite | rollup
import SvgPreivew from 'svg-preview-plugin'

module.exports = {
  plugins: [
    new SvgPreview.VitePlugin({
      dirPath: path.resolve('src/common/icons/svg'),
      port: 3000
    })
  ]
}
```