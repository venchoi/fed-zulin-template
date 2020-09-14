import ajax from '@/api/utils/ajax';

// 根据项目获取有权限人员
export const getUserList = (stage_id: { stage_id: string | Array<string> }) => {
    return ajax('/user/renter/get-user-list', { stage_id, page: 1, page_size: 10000 }, 'GET');
};

// 获取收款提醒列表
export const getAdviceCollectionList = () => {
    return ajax('/bill/collection-remind/list', {}, 'GET');
};

// 保存收款配置接口
export const saveCollectionRemind = (data: any) => {
    return ajax('/bill/collection-remind/save', data, 'POST');
};

// 切换是否启用配置
export const switchEnable = (data: { stage_id: string }) => {
    return ajax('/bill/collection-remind/switch-enable', data, 'POST');
};
