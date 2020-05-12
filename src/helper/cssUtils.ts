

export function writeCssInStyles(cssText:any) {
  const id = `id_${Math.random().toString(32).slice(2)}`
  const stylesheet = document.createElement('style')
  stylesheet.setAttribute('id', id)
  stylesheet.setAttribute('type', 'text/css')
  //设置对应的样式
  stylesheet.innerHTML = cssText
  document.getElementsByTagName('head')[0].appendChild(stylesheet)
}
