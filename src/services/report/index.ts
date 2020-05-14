//统一发送ajax请求的接口
import { Cookies } from '@/MemoryShare';
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
    // const params = {
    //     _ac: 'Rental',
    //     _smp: 'Rental.Report',
    //     o: Cookies.get('src_tenant_code'),
    // };
    return ajax('/report/report-proxy/update-report', {}, 'GET');
};

export const editReport = (params: Object) => {
    return ajax('/report/report-proxy/save', params, 'POST');
};
