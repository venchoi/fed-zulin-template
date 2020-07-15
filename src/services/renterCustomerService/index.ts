import ajax from '@/api/utils/ajax';
import {
    getrenterListParams
} from '@/types/renterCustomerService';

// 获取减免列表
export const getRenterList = (data: getrenterListParams) => {
    return ajax('/user/contract-admin/list', { ...data, _csrf: '' }, 'POST');
};
