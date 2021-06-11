const { start, destory } = require('./utils/file')
const schema = require('./utils/schema.json')
const { validate } = require('schema-utils')

module.exports = class SvgPreviewPlugin {
	constructor(options) {
		validate(schema, options, {
			name: 'SvgPreviewPlugin',
			baseDataPath: "options"
		})
		this.options = options
		this.isWatch = false
	}

	async apply(compiler) {
		const { options } = this
		
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
