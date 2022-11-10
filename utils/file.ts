import glob from 'glob'
import { watch } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import { createHtmlTemplate } from './html'
import { resolve } from './index'
import { createServer, destoryServer, reloadServer } from './server'
import type { FSWatcher } from 'fs'

const watchers: FSWatcher[] = []

let cacheOptions: pluginOptions

const getFileContent = async (filePath: string) => {
  const content = await fs.readFile(filePath, 'utf8')
	return {
    name: path.basename(filePath).replace('.svg', ''),
    filePath,
		content
	}
}

const matchFilesPath = (dirPath: string, deep: pluginOptions['deep']) => (glob.sync(deep ? '**/*.svg' : '*.svg', { cwd: dirPath }) as string[]).map( (filePath: string) => path.resolve(dirPath, filePath))

const matchFiles = ({ dirPath, deep }: pluginOptions) => {
  if (Array.isArray(dirPath)) {
    const data: string[] = []
    dirPath.forEach(dirPath => {
      data.push(...matchFilesPath(dirPath, deep))
    })
    return data
  } else {
    return matchFilesPath(dirPath, deep)
  }
}

const getFilesInfo = (fileList: string[]) => Promise.all(fileList.map(filePath => getFileContent(filePath)))

let timer: NodeJS.Timeout | undefined
const watchDir = async () => {
  clearTimeout(timer)

  timer = setTimeout(async () => {
    await writeFile(cacheOptions)
    reloadServer()
  }, 100)
}

const createWatcher = ({ dirPath }: pluginOptions) => {
  const fnc = () => watchDir()
  
  if (Array.isArray(dirPath)) {
    const arr = dirPath.map(path => watch(path, fnc))
    watchers.push(...arr)
    return
  }

  watchers.push(watch(dirPath, fnc))
}

const start = async (options: pluginOptions) => {
  cacheOptions = options
  createServer(options)
  createWatcher(options)
  await writeFile(options)
  reloadServer()
}

const writeFile = async (options: pluginOptions) => {
  const fileList = matchFiles(options)
  const filesContent = await getFilesInfo(fileList)
  const content = createHtmlTemplate(filesContent)
  await fs.writeFile(resolve('../app/index.html'), content)
}

const destory = () => {
  watchers.length = 0

  destoryServer()
}

export {
  start,
  destory
}