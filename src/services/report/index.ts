//统一发送ajax请求的接口
const FormData = require('form-data');
import ajax from '../../api/utils/ajax';
import otherServer from '../../api/config';

interface ReportListParams {
    keyword: string;
    page_index: number;
    page_size: number;
}

interface CURDParams {
    id: string;
}

// 获取菜单和用户信息
export const getMyReportList = (params: ReportListParams) => {
    return ajax('/report/report-proxy/cus-list', params, 'GET');
};

export const getBasicReportList = (params: ReportListParams) => {
    return ajax('/report/report-proxy/std-list', params, 'GET');
};

export const deleteReport = (params: CURDParams) => {
    return ajax('/report/report-proxy/delete', params, 'POST');
};

export const checkIsExit = (params: CURDParams) => {
    return ajax('/report/report-proxy/add-from-std', params, 'POST');
};

export const importReport = (params: CURDParams) => {
    return ajax('/report/report-proxy/add-from-std', params, 'POST');
};

export const getUpdateStatus = () => {
    return ajax('/report/report/get-dm-status', {}, 'GET');
};

export const updateReportRDS = () => {
    return ajax('statistics-report/push-dm-data-wash-order', {}, 'GET', otherServer.bmsReportCenter);
};

export const editReport = (params: Object) => {
    return ajax('/report/report-proxy/save', params, 'POST');
};
