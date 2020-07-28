const FormData = require('form-data');
import axios from 'axios';
import config from '../../config';
import getApiPath from './getApiPath';
import getFetchOptions from './getFetchOptions';
import { serverMap } from '../config';
import { message } from 'antd';
const { DEV } = config;
axios.interceptors.request.use(config => {
    if (config.data instanceof FormData) {
        config.headers['Content-type'] = 'multipart/form-data';
    }
    return config;
});
export default function ajax(path: string, data: object, method: 'GET' | 'POST', otherServer: string = '') {
    let promise;
    let serverDomain = '';
    const fetchOptions = getFetchOptions(getApiPath(path), method);
    const isTest = window.location.hostname.indexOf('test') !== -1;
    otherServer && serverMap[otherServer] && (serverDomain = serverMap[otherServer][DEV || isTest ? 'test' : 'prod']);
    const url = `${serverDomain}${fetchOptions.endpoint}`;
    const headers = fetchOptions.headers;
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
        promise = axios.post(url, data);
    }
    return promise
        .then(res => {
            if (!res?.data?.result) message.error(res?.data?.msg || res?.data?.message || '网络请求失败');
            return res.data;
        })
        .catch(err => {
            // 状态码非200情况
            const { response = {} } = err;
            const { data = {} } = response;
            if (response.status === 401) {
                if (!DEV) {
                    location.href = data.login_url + '?returnUrl=' + decodeURIComponent(location.href);
                } else {
                    const loginUrl = data.login_url
                        ? data.login_url.replace(/^(.+)\?(.*)/, '$1')
                        : 'https://passport-ykj-test.myfuwu.com.cn/auth/login';
                    location.href = loginUrl + '?returnUrl=' + decodeURIComponent(location.origin);
                }
            } else {
                console.error('请求失败了', err);
                // 状态码为301或者302时不提示
                if (response.status !== 301 && response.status !== 302) {
                    message.error(data.msg || '网络请求失败');
                }
            }
        });
}
