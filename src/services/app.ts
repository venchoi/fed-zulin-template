//统一发送ajax请求的接口
import ajax from '../api/utils/ajax';

type Method = 'GET' | 'POST';
// 获取菜单和用户信息
export const getHomeBaseInfo = (data: any) => {
    return ajax('/home/base-info', data, 'GET');
};

// 获取工作流信息
export const getWorkflowTodo = (data: any) => {
    return ajax('/business/workflow/get-todo', data, 'GET');
};
// 登出系統
export const loginOut = (data: any) => {
    return ajax('/auth/logout', data, 'GET');
};
// 模拟登录
export const mockLogin = (data: any) => {
    return ajax('/', data, 'GET');
};
