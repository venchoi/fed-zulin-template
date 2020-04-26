//统一发送ajax请求的接口
import ajax from './utils/ajax';

type Method = 'GET' | 'POST';
// 获取菜单和用户信息
export const getHomeBaseInfo = (data: any, method: Method) => {
    return ajax('/home/base-info', data, method);
};

// 获取工作流信息
export const getWorkflowTodo = (data: any, method: Method) => {
    return ajax('/business/workflow/get-todo', data, method);
};
// 登出系統
export const loginOut = (data: any, method: Method) => {
    return ajax('/auth/logout', data, method);
};
// 模拟登录
export const mockLogin = (data: any, method: Method) => {
    return ajax('/', data, method);
};
