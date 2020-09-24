// 基础、公共的接口放在这里

import ajax from '@/api/utils/ajax';
import { ResponseData, PaymentMode } from '@/types/common';

/**
 * parameter/parameter/settings 获取支付方式
 * @param ignoredConfig
 */
export const getPayParams = (ignoredConfig: number): Promise<ResponseData<{ PaymentMode: PaymentMode[] }>> => {
    const param = {
        code: 'PaymentMode',
        ignored_config: ignoredConfig === 1 ? 1 : 0,
    };
    return ajax('/parameter/parameter/settings', param, 'GET');
};
