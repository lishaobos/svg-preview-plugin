const glob = require('glob')
const fs = require('fs')
const path = require('path')
const { createHtmlTemplate } = require('./html')
const { resolve } = require('./index')
const { createServer, destoryServer, reloadServer } = require('./server')

const watchers = []

const getFileContent = async filePath => {
  const content = await fs.readFileSync(filePath, 'utf8')
	return {
    name: path.basename(filePath).replace('.svg', ''),
    filePath,
		content
	}
}

const matchFilesPath = async dirPath => {
  const result = await glob.sync('*.svg', { cwd: dirPath })
  return result.map( filePath => path.resolve(dirPath, filePath))
}

const matchFiles = async dirPath => {
  if (typeof dirPath === 'string') {
    return await matchFilesPath(dirPath)
  } else if (Array.isArray(dirPath)) {
    const data = await Promise.all(dirPath.map(dirPath => matchFilesPath(dirPath)))
    return data.flat()
  }
}

const getFilesInfo = async fileList => await Promise.all(fileList.map(filePath => getFileContent(filePath)))

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
    const arr = dirPath.map(path => fs.watch(path, fnc))
    watchers.push(arr)
    return 
  }

  watchers.push(fs.watch(dirPath, fnc))
}

const start = async options => {
  createServer(options)
  createWatcher(options.dirPath)
  await writeFile(options.dirPath)
  reloadServer()
}

const writeFile = async dirPath => {
  const fileList = await matchFiles(dirPath)
  const filesContent = await getFilesInfo(fileList)
  const content = createHtmlTemplate(filesContent)
  await fs.writeFileSync(resolve('../app/index.html'), content)
}

const destory = () => {
  watchers.length = 0

  destoryServer()
}

module.exports = {
  start,
  destory
}