import path from 'path'

const resolve = (filePath: string) => path.resolve(__dirname, filePath)

export {
  resolve
}