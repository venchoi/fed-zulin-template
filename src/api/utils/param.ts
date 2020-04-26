
export default function param(paramData: any) {
  let key; let val
  const params: any = [];
  const escape = window.encodeURIComponent
  if (!paramData || typeof paramData !== 'object') {
    return ''
  }

  params.add = function (k: string, v: any) { this.push(`${escape(k)}=${escape(v)}`) }

  for (key in paramData) {
    if (Object.prototype.hasOwnProperty.call(paramData, key)) {
      val =  paramData[key]
      if (val === undefined || val === null) val = ''
      params.add(key, val)
    }
  }

  return params.join('&')
}
