// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import browserSync from 'browser-sync'
import { resolve } from './index'
import fs from 'fs/promises'
import type { PathLike } from 'fs'
import type { pluginOptions, FormatData } from '../type'

type Key = 'removeFile' | 'formatName'

const bs = browserSync.create()
let cacheOptions: pluginOptions | undefined

const socketEmitter = {
	async removeFile(path: PathLike) {
		await fs.rm(path)
	},
	formatName(data: FormatData) {
		if (typeof cacheOptions?.formatName === 'function') {
			bs.sockets.emit('name', cacheOptions.formatName({
				name: data.name,
				filePath: data.filePath
			}))
		} else {
			bs.sockets.emit('name', data.name)
		}
	}
}

const initEmitter = () => {
	bs.sockets.on('connection', (client: any) => Object.keys(socketEmitter).forEach((key) => client.on(key, socketEmitter[key as Key])));
}

const createServer = (options: pluginOptions) => {
	cacheOptions = options

	bs.init({
		server: resolve('../app'),
		open: options.open,
		ui: false,
		port: options.port
	}, initEmitter)
}

const reloadServer = () => bs.reload()

const destoryServer = () => bs.exit()

export {
  createServer,
	reloadServer,
	destoryServer
}