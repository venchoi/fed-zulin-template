//统一发送ajax请求的接口
import ajax from '../api/utils/ajax';

type Method = 'GET' | 'POST';
// 获取菜单和用户信息
export const getHomeBaseInfo = (data: object) => {
    return ajax('/home/base-info', data, 'GET');
};

// 获取工作流信息
export const getWorkflowTodo = () => {
    return ajax('/business/workflow/get-todo', {}, 'GET');
};
// 登出系統
export const loginOut = () => {
    return ajax('/auth/logout', {}, 'GET');
};
