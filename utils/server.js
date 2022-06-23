const bs = require('browser-sync').create()
const { resolve } = require('./index')
const fs = require('fs/promises')
let cacheOptions = {}

const socketEmitter = {
	async removeFile(path) {
		await fs.rm(path)
	},
	formatName(name) {
		if (typeof cacheOptions.formatName === 'function') {
			bs.sockets.emit('name', cacheOptions.formatName(name))
		} else {
			bs.sockets.emit('name', name)
		}
	}
}

const initEmitter = (options) => {
	bs.sockets.on('connection', client => Object.keys(socketEmitter).forEach( key => client.on(key, socketEmitter[key])));
}

const createServer = (options) => {
	cacheOptions = options

	bs.init({
		server: resolve('../app'),
		open: false,
		ui: false,
		port: options.port
	}, initEmitter)
}

const reloadServer = () => bs.reload()

const destoryServer = () => bs.exit()

module.exports = {
  createServer,
	reloadServer,
	destoryServer
}