import htmlTemplate from './html.template'

interface fileContent {
  name: string
  filePath: string
  content: string
}

const createHtmlTag = (filesContent: fileContent[]) => {
  const content = JSON.stringify(filesContent)
  return `<script>const list = JSON.parse(JSON.stringify(${content}))</script>`
}

const createHtmlTemplate = (filesContent: fileContent[]) => {
  const content = createHtmlTag(filesContent)
  return htmlTemplate.replace('<body>', `<body>${content}`)
}

export {
  createHtmlTemplate
}