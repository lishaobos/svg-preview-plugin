import { Compiler } from 'webpack';

declare type pluginOptions = {
    dirPath: string | Array<string>;
    open?: boolean;
    port: number;
    deep?: boolean;
    formatName?: (name: string) => string;
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
