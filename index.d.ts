import type { Plugin } from 'vite'
import type { Compiler } from 'webpack'

declare class WebpackPlugin {
	isWatch: boolean
	options: pluginOptions
	constructor(options: pluginOptions)
	apply: (compiler: Compiler) => void
}

declare function VitePlugin(options: pluginOptions): Plugin

export {
	WebpackPlugin,
	VitePlugin
}