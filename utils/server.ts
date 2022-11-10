import browserSync from 'browser-sync'
import { resolve } from './index'
import fs from 'fs/promises'
import type { PathLike } from 'fs'

const bs = browserSync.create()
let cacheOptions: pluginOptions | undefined

const socketEmitter = {
	async removeFile(path: PathLike) {
		await fs.rm(path)
	},
	formatName(name: string) {
		if (typeof cacheOptions?.formatName === 'function') {
			bs.sockets.emit('name', cacheOptions.formatName(name))
		} else {
			bs.sockets.emit('name', name)
		}
	}
}

const initEmitter = () => {
	bs.sockets.on('connection', client => Object.keys(socketEmitter).forEach( key => client.on(key, socketEmitter[key])));
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