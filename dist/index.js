"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve2, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve2(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// index.ts
var svg_preview_plugin_exports = {};
__export(svg_preview_plugin_exports, {
  VitePlugin: () => VitePlugin,
  WebpackPlugin: () => WebpackPlugin
});
module.exports = __toCommonJS(svg_preview_plugin_exports);

// utils/file.ts
var import_glob = __toESM(require("glob"));
var import_fs = require("fs");
var import_promises2 = __toESM(require("fs/promises"));
var import_path2 = __toESM(require("path"));

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
            <el-button size="mini" @click="nativeCopy(item.filePath)">
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
            isSocketInit: false,
            timer: null
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
          async nativeCopy(val) {
            clearTimeout(this.timer)
            this.timer = setTimeout(async () => {
              await navigator.clipboard.writeText(val)
              this.$message.success('\u590D\u5236\u6210\u529F\uFF1A' + val)
            }, 500)
          },
          copy(val) {
            if (!this.isSocketInit) {
              this.isSocketInit = true
              window.___browserSync___.socket.on('name', this.nativeCopy)
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
var import_path = __toESM(require("path"));
var resolve = (filePath) => import_path.default.resolve(__dirname, filePath);

// utils/server.ts
var import_browser_sync = __toESM(require("browser-sync"));
var import_promises = __toESM(require("fs/promises"));
var bs = import_browser_sync.default.create();
var cacheOptions;
var socketEmitter = {
  removeFile(path3) {
    return __async(this, null, function* () {
      yield import_promises.default.rm(path3);
    });
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
var cacheOptions2;
var getFileContent = (filePath) => __async(void 0, null, function* () {
  const content = yield import_promises2.default.readFile(filePath, "utf8");
  return {
    name: import_path2.default.basename(filePath).replace(".svg", ""),
    filePath,
    content
  };
});
var matchFilesPath = (dirPath, deep) => import_glob.default.sync(deep ? "**/*.svg" : "*.svg", { cwd: dirPath }).map((filePath) => import_path2.default.resolve(dirPath, filePath));
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
var watchDir = () => __async(void 0, null, function* () {
  clearTimeout(timer);
  timer = setTimeout(() => __async(void 0, null, function* () {
    yield writeFile(cacheOptions2);
    reloadServer();
  }), 100);
});
var createWatcher = ({ dirPath }) => {
  const fnc = () => watchDir();
  if (Array.isArray(dirPath)) {
    const arr = dirPath.map((path3) => (0, import_fs.watch)(path3, fnc));
    watchers.push(...arr);
    return;
  }
  watchers.push((0, import_fs.watch)(dirPath, fnc));
};
var start = (options) => __async(void 0, null, function* () {
  cacheOptions2 = options;
  createServer(options);
  createWatcher(options);
  yield writeFile(options);
  reloadServer();
});
var writeFile = (options) => __async(void 0, null, function* () {
  const fileList = matchFiles(options);
  const filesContent = yield getFilesInfo(fileList);
  const content = createHtmlTemplate(filesContent);
  yield import_promises2.default.writeFile(resolve("../app/index.html"), content);
});
var destory = () => {
  watchers.length = 0;
  return destoryServer();
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
var import_schema_utils = require("schema-utils");
var WebpackPlugin = class SvgPreviewPlugin {
  constructor(options) {
    this.isWatch = false;
    (0, import_schema_utils.validate)(schema_default, options, {
      name: "SvgPreviewPlugin",
      baseDataPath: "options"
    });
    this.options = options;
  }
  apply(compiler) {
    return __async(this, null, function* () {
      var _a, _b;
      const { options } = this;
      (_a = options.open) != null ? _a : options.open = true;
      (_b = options.port) != null ? _b : options.port = 3e3;
      compiler.hooks.done.tap("SvgPreviewPlugin", () => {
        console.log(`SVG\u9884\u89C8\uFF1A`, `\x1B[36mhttp://localhost:${options.port}\x1B[0m`);
      });
      compiler.hooks.watchClose.tap("SvgPreviewPlugin", destory);
      if (!this.isWatch) {
        this.isWatch = true;
        yield start(options);
      }
    });
  }
};
function VitePlugin(options) {
  var _a, _b;
  (_a = options.open) != null ? _a : options.open = true;
  (_b = options.port) != null ? _b : options.port = 3e3;
  return {
    name: "SvgPreviewPlugin",
    apply: "serve",
    buildStart() {
      return __async(this, null, function* () {
        console.log(`SVG\u9884\u89C8\uFF1A`, `\x1B[36mhttp://localhost:${options.port}\x1B[0m`);
        destory();
        yield start(options);
      });
    },
    closeWatcher() {
      destory();
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VitePlugin,
  WebpackPlugin
});
