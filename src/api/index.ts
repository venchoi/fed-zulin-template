//统一发送ajax请求的接口
import ajax from './utils/ajax';
import getApiPath from './utils/getApiPath';
import getFetchOptions from './utils/getFetchOptions';

type Method = 'GET' | 'POST';
// 获取菜单和用户信息
export const getHomeBaseInfo = (data: any, method: Method) => {
    const fetchOptions = getFetchOptions(getApiPath('/home/base-info'), method);
    return ajax(fetchOptions.endpoint, data, method, fetchOptions.headers);
}

// 获取工作流信息
export const getWorkflowTodo = (data: any, method: Method) => {
    const fetchOptions = getFetchOptions(getApiPath('/business/workflow/get-todo'), method);
    return ajax(fetchOptions.endpoint, data, method, fetchOptions.headers);
}
// 登出系統
export const loginOut = (data: any, method: Method) => {
    const fetchOptions = getFetchOptions(getApiPath('/auth/logout'), method);
    return ajax(fetchOptions.endpoint, data, method, fetchOptions.headers);
}
// 模拟登录
export const mockLogin = (data: any, method: Method) => {
    const fetchOptions = getFetchOptions(getApiPath('/'), method);
    return ajax(fetchOptions.endpoint, data, method, fetchOptions.headers);
}
