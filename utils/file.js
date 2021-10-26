const glob = require('glob')
const { watch } = require('fs')
const fs = require('fs/promises')
const path = require('path')
const { createHtmlTemplate } = require('./html')
const { resolve } = require('./index')
const { createServer, destoryServer, reloadServer } = require('./server')

const watchers = []

const getFileContent = async filePath => {
  const content = await fs.readFile(filePath, 'utf8')
	return {
    name: path.basename(filePath).replace('.svg', ''),
    filePath,
		content
	}
}

const matchFilesPath = dirPath => glob.sync('*.svg', { cwd: dirPath }).map( filePath => path.resolve(dirPath, filePath))

const matchFiles = dirPath => {
  if (typeof dirPath === 'string') {
    return matchFilesPath(dirPath)
  } else if (Array.isArray(dirPath)) {
    const data = []
    dirPath.forEach(dirPath => {
      data.push(...matchFilesPath(dirPath))
    })
    return data
  }
}

const getFilesInfo = fileList => Promise.all(fileList.map(filePath => getFileContent(filePath)))

let timer
const watchDir = async (dirPath) => {
  clearTimeout(timer)

  timer = setTimeout(async () => {
    await writeFile(dirPath)
    reloadServer()
  }, 100)
}

const createWatcher = dirPath => {
  const fnc = (...args) => watchDir(dirPath, ...args)
  
  if (Array.isArray(dirPath)) {
    const arr = dirPath.map(path => watch(path, fnc))
    watchers.push(arr)
    return 
  }

  watchers.push(watch(dirPath, fnc))
}

const start = async options => {
  createServer(options)
  createWatcher(options.dirPath)
  await writeFile(options.dirPath)
  reloadServer()
}

const writeFile = async dirPath => {
  const fileList = matchFiles(dirPath)
  const filesContent = await getFilesInfo(fileList)
  const content = createHtmlTemplate(filesContent)
  await fs.writeFile(resolve('../app/index.html'), content)
}

const destory = () => {
  watchers.length = 0

  destoryServer()
}

module.exports = {
  start,
  destory
}