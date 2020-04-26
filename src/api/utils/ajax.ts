import axios from 'axios';
import config from '../../config';
const { DEV } = config;
export default function ajax(url: string, data: object, method: 'GET' | 'POST', headers: any) {
    let promise;
    if (method === 'GET') {
        axios.defaults.headers.get = {
            ...headers,
        };
        promise = axios.get(url, {
            params: { ...data },
        });
    } else {
        axios.defaults.headers.post = {
            ...headers,
        };
        promise = axios.post(url, {
            ...data,
        });
    }
    return promise
        .then(res => {
            return res.data;
        })
        .catch(err => {
            const { response = {} } = err;
            if (response.status === 401) {
                const { data } = response;
                if (!DEV) {
                    location.href = data.login_url + '?returnUrl=' + decodeURIComponent(location.href);
                } else {
                    localStorage.setItem('is_login', '0');
                    const loginUrl = data.login_url
                        ? data.login_url.replace(/^(.+)\?(.*)/, '$1')
                        : 'https://passport-ykj-test.myfuwu.com.cn/auth/login';
                    location.href =
                        loginUrl +
                        '?returnUrl=' +
                        decodeURIComponent(location.origin) +
                        '/static/cookie/set?returnUrl=' +
                        location.href;
                }
            } else {
                console.log('请求失败了');
                console.error(err);
                console.log('错误已经捕获');
            }
        });
}
