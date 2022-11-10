interface pluginOptions {
	dirPath: string | Array<string>
	open?: boolean
	port: number
	deep?: boolean
	formatName?: (arg: string) => void
}
