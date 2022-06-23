const { start, destory } = require('../utils/file')
const path = require('path')

// destory()

start({
  deep: true,
  formatName(name) {
    return `<MyIcon name="${name}" />`
  },
  dirPath: [
    path.resolve('test/svg')
  ],
  port: 3007
})