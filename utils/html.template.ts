export default `
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
  <script src="./vue@next.js"></script>
  <script src="./element-ui.js"></script>
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
              删除
            </el-button>
            <el-button size="mini" @click="copy(item)">复制名称</el-button>
            <el-button size="mini" @click="nativeCopy(item.filePath)">
              复制路径
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
            await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            window.___browserSync___.socket.emit('removeFile', filePath)
          },
          async nativeCopy(val) {
            clearTimeout(this.timer)
            this.timer = setTimeout(async () => {
              await navigator.clipboard.writeText(val)
              this.$message.success('复制成功：' + val)
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
    </script>
  </body>
</html>`