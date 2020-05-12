interface Token {
  token: string;
  apiDomain: string;
  appCode: string;
}

let __token: Token

class Token  {
  set(token: string) {
    this.token = token
  }

  get() {
    return this.token || ''
  }

  setAppCode(appCode: string) {
    this.appCode = appCode
  }

  getAppCode() {
    return this.appCode
  }

  setApiDomain(apiDomain: string) {
    this.apiDomain = apiDomain
  }

  getApiDomain() {
    return this.apiDomain
  }
}

function createToken() {
  return __token || (__token = new Token())
}

export default createToken()
