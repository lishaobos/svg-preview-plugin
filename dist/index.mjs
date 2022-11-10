// utils/file.ts
import glob from "glob";
import { watch } from "fs";
import fs2 from "fs/promises";
import path2 from "path";

// utils/html.template.ts
var html_template_default = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link
      rel="stylesheet"
      href="./element-ui.css"
    />
    <style>
      .svg-container {
        display: flex;
        flex-wrap: wrap;
      }

      .svg-item {
        position: relative;
        cursor: pointer;
        margin: 10px;
        text-align: center;
      }

      .svg-item svg {
        width: 50px;
        height: 50px;
      }

      .svg-item-name {
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 10px;
      }

      .popper {
        display: flex;
        flex-wrap: wrap;
      }
      .popper .el-button {
        width: 100%;
      }
      .popper .el-button + .el-button {
        margin-left: 0;
        margin-top: 10px;
      }
    </style>
  </head>
  <script src="./vue@next.js"><\/script>
  <script src="./element-ui.js"><\/script>
  <body>
    <div id="app">
      <div class="svg-container">
        <el-popover
          trigger="hover"
          popper-class="popper"
          v-model:visible="item.show"
          v-for="(item, index) in list"
        >
          <div>
            <el-button size="mini" type="danger" @click="del(item.filePath)">
              \u5220\u9664
            </el-button>
            <el-button size="mini" @click="copy(item.name)">\u590D\u5236\u540D\u79F0</el-button>
            <el-button size="mini" @click="copy(item.filePath)">
              \u590D\u5236\u8DEF\u5F84
            </el-button>
          </div>

          <template #reference>
            <div class="svg-item">
              <div :id="'svg-content-' + index"></div>
              <div class="svg-item-name" :title='item.name'>{{ item.name }}</div>
            </div>
          </template>
        </el-popover>
      </div>
    </div>

    <script>
      const App = {
        data() {
          return {
            list: [],
            isSocketInit: false
          }
        },
        created() {
          this.createList()
        },
        mounted() {
          this.addShdowDom()
        },
        methods: {
          addShdowDom() {
            const { length } = list
            for (let i = 0; i < length; i++) {
              const styleDom = document.createElement('style')
              styleDom.textContent = 'svg{width: 50px;height: 50px;}'
              const dom = document.querySelector("#svg-content-" + i)
              const shdow = dom.attachShadow({ mode: 'closed' })
              shdow.innerHTML = list[i].content
              shdow.appendChild(styleDom)
            }
          },
          createList() {
            this.list = list.map(item => {
              return {
                ...item,
                show: false
              }
            })
          },
          async del(filePath) {
            await this.$confirm('\u6B64\u64CD\u4F5C\u5C06\u6C38\u4E45\u5220\u9664\u8BE5\u6587\u4EF6, \u662F\u5426\u7EE7\u7EED?', '\u63D0\u793A', {
              confirmButtonText: '\u786E\u5B9A',
              cancelButtonText: '\u53D6\u6D88',
              type: 'warning'
            })
            window.___browserSync___.socket.emit('removeFile', filePath)
          },
          async copy(val) {
            if (!this.isSocketInit) {
              this.isSocketInit = true
              window.___browserSync___.socket.on('name', async name => {
                await navigator.clipboard.writeText(name)
                this.$message.success('\u590D\u5236\u6210\u529F\uFF1A' + name)
              })
            }

            window.___browserSync___.socket.emit('formatName', val)
          }
        }
      }

      const app = Vue.createApp(App)
      app.use(ElementPlus)
      app.mount('#app')
    <\/script>
  </body>
</html>


`;

// utils/html.ts
var createHtmlTag = (filesContent) => {
  const content = JSON.stringify(filesContent);
  return `<script>const list = JSON.parse(JSON.stringify(${content}))<\/script>`;
};
var createHtmlTemplate = (filesContent) => {
  const content = createHtmlTag(filesContent);
  return html_template_default.replace("<body>", `<body>${content}`);
};

// utils/index.ts
import path from "path";
var resolve = (filePath) => path.resolve(__dirname, filePath);

// utils/server.ts
import browserSync from "browser-sync";
import fs from "fs/promises";
var bs = browserSync.create();
var cacheOptions;
var socketEmitter = {
  async removeFile(path3) {
    await fs.rm(path3);
  },
  formatName(name) {
    if (typeof (cacheOptions == null ? void 0 : cacheOptions.formatName) === "function") {
      bs.sockets.emit("name", cacheOptions.formatName(name));
    } else {
      bs.sockets.emit("name", name);
    }
  }
};
var initEmitter = () => {
  bs.sockets.on("connection", (client) => Object.keys(socketEmitter).forEach((key) => client.on(key, socketEmitter[key])));
};
var createServer = (options) => {
  cacheOptions = options;
  bs.init({
    server: resolve("../app"),
    open: options.open,
    ui: false,
    port: options.port
  }, initEmitter);
};
var reloadServer = () => bs.reload();
var destoryServer = () => bs.exit();

// utils/file.ts
var watchers = [];
var getFileContent = async (filePath) => {
  const content = await fs2.readFile(filePath, "utf8");
  return {
    name: path2.basename(filePath).replace(".svg", ""),
    filePath,
    content
  };
};
var matchFilesPath = (dirPath, deep) => glob.sync(deep ? "**/*.svg" : "*.svg", { cwd: dirPath }).map((filePath) => path2.resolve(dirPath, filePath));
var matchFiles = ({ dirPath, deep }) => {
  if (Array.isArray(dirPath)) {
    const data = [];
    dirPath.forEach((dirPath2) => {
      data.push(...matchFilesPath(dirPath2, deep));
    });
    return data;
  } else {
    return matchFilesPath(dirPath, deep);
  }
};
var getFilesInfo = (fileList) => Promise.all(fileList.map((filePath) => getFileContent(filePath)));
var timer;
var watchDir = async (dirPath) => {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    await writeFile(dirPath);
    reloadServer();
  }, 100);
};
var createWatcher = ({ dirPath }) => {
  const fnc = () => watchDir(dirPath);
  if (Array.isArray(dirPath)) {
    const arr = dirPath.map((path3) => watch(path3, fnc));
    watchers.push(...arr);
    return;
  }
  watchers.push(watch(dirPath, fnc));
};
var start = async (options) => {
  createServer(options);
  createWatcher(options);
  await writeFile(options);
  reloadServer();
};
var writeFile = async (options) => {
  const fileList = matchFiles(options);
  const filesContent = await getFilesInfo(fileList);
  const content = createHtmlTemplate(filesContent);
  await fs2.writeFile(resolve("../app/index.html"), content);
};
var destory = () => {
  watchers.length = 0;
  destoryServer();
};

// utils/schema.json
var schema_default = {
  type: "object",
  properties: {
    port: {
      type: "number"
    },
    dirPath: {
      anyOf: [
        { type: "array" },
        { type: "string" }
      ]
    }
  },
  additionalProperties: false
};

// index.ts
import { validate } from "schema-utils";
var WebpackPlugin = class SvgPreviewPlugin {
  constructor(options) {
    this.isWatch = false;
    validate(schema_default, options, {
      name: "SvgPreviewPlugin",
      baseDataPath: "options"
    });
    this.options = options;
  }
  async apply(compiler) {
    const { options } = this;
    options.open ?? (options.open = true);
    compiler.hooks.done.tap("SvgPreviewPlugin", () => {
      console.log(`SVG\u9884\u89C8\uFF1A`, `\x1B[36mhttp://localhost:${options.port}\x1B[0m`);
    });
    compiler.hooks.watchClose.tap("SvgPreviewPlugin", destory);
    if (!this.isWatch) {
      this.isWatch = true;
      await start(options);
    }
  }
};
function VitePlugin(options) {
  let isWatch = false;
  options.open ?? (options.open = true);
  return {
    name: "SvgPreviewPlugin",
    apply: "serve",
    async buildStart() {
      console.log(`SVG\u9884\u89C8\uFF1A`, `\x1B[36mhttp://localhost:${options.port}\x1B[0m`);
      if (!isWatch) {
        isWatch = true;
        await start(options);
      }
    },
    closeWatcher() {
      destory();
    }
  };
}
export {
  VitePlugin,
  WebpackPlugin
};
