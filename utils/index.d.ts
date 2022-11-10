interface pluginOptions {
	dirPath: string | Array<string>
	port: number
	deep?: boolean
	formatName?: (arg: string) => void
}
