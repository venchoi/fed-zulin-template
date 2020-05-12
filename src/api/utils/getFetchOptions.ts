
export default function getFetchOptions(endpoint: any, method: 'GET'|'POST' = 'GET', opts: any = {}) {
    const headers = opts.headers || {}
    const defaultOptions = {
        ...opts,
        endpoint,
        method,
        credentials: 'include',
        headers: {
            Accept: 'ajax',
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': headers['Content-Type'] || 'application/json',
            ...headers,
        }
    }
    if (opts.formData) {
        delete defaultOptions.headers['Content-Type']
        delete defaultOptions.formData
    }
    return defaultOptions
}
