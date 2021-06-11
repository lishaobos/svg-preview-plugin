const htmlTemplate = require('./html.template')

const createHtmlTag = filesContent => {
  const content = JSON.stringify(filesContent)
  return `<script>const list = JSON.parse(JSON.stringify(${content}))</script>`
}

const createHtmlTemplate = filesContent => {
  const content = createHtmlTag(filesContent)
  return htmlTemplate.replace('<body>', `<body>${content}`)
}

module.exports = {
  createHtmlTemplate
}