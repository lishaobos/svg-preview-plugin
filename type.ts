import type { Plugin } from 'vite'
import type { Compiler } from 'webpack'

export type pluginOptions = {
	dirPath: string | Array<string>
	open?: boolean
	port: number
	deep?: boolean
	formatName?: (name: string) => string
}

export declare class WebpackPlugin {
	isWatch: boolean
	options: pluginOptions
	constructor(options: pluginOptions)
	apply: (compiler: Compiler) => void
}

export declare function VitePlugin(options: pluginOptions): Plugin