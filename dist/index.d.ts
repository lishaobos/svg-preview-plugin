import { Compiler } from 'webpack';

declare type FormatData = {
    name: string;
    filePath: string;
};
declare type pluginOptions = {
    dirPath: string | Array<string>;
    /**
     * @default 3000
     */
    port?: number;
    /**
     * @default true
     */
    open?: boolean;
    deep?: boolean;
    formatName?: (name: FormatData) => string;
};

declare const WebpackPlugin: {
    new (options: pluginOptions): {
        isWatch: boolean;
        options: pluginOptions;
        apply(compiler: Compiler): Promise<void>;
    };
};
declare function VitePlugin(options: pluginOptions): {
    name: string;
    apply: string;
    buildStart(): Promise<void>;
    closeWatcher(): void;
};

export { VitePlugin, WebpackPlugin };
