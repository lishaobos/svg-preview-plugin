const { start, destory } = require('../utils/file')
const path = require('path')

destory()

start({
  // dirPath: path.resolve('./test/svg'),
  dirPath: [
    path.resolve('src/common/icons/svg')
  ],
  port: 3007
})