let __token: any;

class Token {
    token = null;
    appCode = null;
    apiDomain = null;
    set(token: any) {
        this.token = token;
    }

    get() {
        return this.token || '';
    }

    setAppCode(appCode: any) {
        this.appCode = appCode;
    }

    getAppCode() {
        return this.appCode;
    }

    setApiDomain(apiDomain: any) {
        this.apiDomain = apiDomain;
    }

    getApiDomain() {
        return this.apiDomain;
    }
}

function createToken() {
    return __token || (__token = new Token());
}

export default createToken();
