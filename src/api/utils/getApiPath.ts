import Token from './token'
import param from './param'
import config from '../../config'

const { DEV, apiDomain } = config

interface ParamData {
  t: string;
  _ac: any;
  [propName: string]: any
}

/**
 *
 * @param  {string} path
 * @param  {object} paramData
 * @return {string}
 */
export default function getApiPath(path: string, paramData?: ParamData) {
  const token = Token.get()
  let    params
  let basePath
  let _apiDomain = apiDomain

  if (!DEV) {
    _apiDomain = ''
  }
  if (token) {
    basePath = `${_apiDomain}/${token}`
  } else {
    basePath = _apiDomain
  }

  const requestParams = paramData || { t: '' }
  requestParams.t = `${(new Date()).getTime()}`
  // 统一在请求api接口时，加上_ac参数
  const appCode = Token.getAppCode()

  if (appCode) {
    params = param(Object.assign(requestParams, { _ac: appCode }))
  } else {
    params = param(requestParams)
  }

  if (params) {
    params = path.indexOf('?') === -1 ? `?${params}` : `&${params}`
  }
  return `${basePath}${path}${params}`
}
