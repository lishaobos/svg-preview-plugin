import { start, destory } from './utils/file'
import schema from './utils/schema.json'
import { validate } from 'schema-utils'
import type { Compiler } from 'webpack'
import type { pluginOptions } from './type'


export const WebpackPlugin = class SvgPreviewPlugin {
	isWatch = false
	options: pluginOptions

	constructor(options: pluginOptions) {
		validate(schema as any, options, {
			name: 'SvgPreviewPlugin',
			baseDataPath: "options"
		})
		this.options = options
	}

	async apply(compiler: Compiler) {
		const { options } = this
		options.open ??= true

		compiler.hooks.done.tap('SvgPreviewPlugin', ()=> {
			console.log(`SVG预览：`, `\x1B[36mhttp://localhost:${options.port}\x1B[0m`)
		})
		
		compiler.hooks.watchClose.tap('SvgPreviewPlugin', destory)
		
		if (!this.isWatch) {
			this.isWatch = true
			
			await start(options)
		}
	}
}

export function VitePlugin (options: pluginOptions) {
	let isWatch = false
	options.open ??= true

	return {
		name: 'SvgPreviewPlugin',
		apply: 'serve',
		async buildStart() {
			console.log(`SVG预览：`, `\x1B[36mhttp://localhost:${options.port}\x1B[0m`)

			if (!isWatch) {
				isWatch = true
				
				await start(options)
			}
		},
		closeWatcher() {
			destory()
		}
	}
}