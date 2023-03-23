import type { Plugin } from 'vite'
import type { Compiler } from 'webpack'

export type FormatData = {
	name: string
	filePath: string
}

export type pluginOptions = {
	dirPath: string | Array<string>
	/**
	 * @default 3000
	 */
	port?: number
	/**
	 * @default true
	 */
	open?: boolean
	deep?: boolean
	formatName?: (name: FormatData) => string
}

export declare class WebpackPlugin {
	isWatch: boolean
	options: pluginOptions
	constructor(options: pluginOptions)
	apply: (compiler: Compiler) => void
}

export declare function VitePlugin(options: pluginOptions): Plugin