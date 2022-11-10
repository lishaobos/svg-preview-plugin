import { Plugin } from 'vite';
import { Compiler } from 'webpack';

declare class WebpackPlugin {
	isWatch: boolean
	options: pluginOptions
	constructor(options: pluginOptions)
	apply: (compiler: Compiler) => void
}

declare function VitePlugin(options: pluginOptions): Plugin

export { VitePlugin, WebpackPlugin };
