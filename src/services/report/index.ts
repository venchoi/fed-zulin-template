//统一发送ajax请求的接口
import ajax from '../../api/utils/ajax';
import otherServer from '../../api/config';

interface ReportListParams {
    page_index: number;
    page_size: number;
}

// TODO  extends IRecordType
interface DeleteParams {
    id: string;
}

interface UpdateParams {
    name: string;
    desc: string;
    rds_type: string;
}

// 获取菜单和用户信息
export const getMyReportList = (params: ReportListParams) => {
    return ajax('/report/report-proxy/cus-list', params, 'GET');
};

export const getBasicReportList = (params: ReportListParams) => {
    return ajax('/report/report-proxy/std-list', params, 'GET');
};

export const deleteReport = (params: DeleteParams) => {
    return ajax('/report/report-proxy/delete', params, 'POST');
};

export const checkIsExit = (params: DeleteParams) => {
    return ajax('/report/report-proxy/add-from-std', params, 'POST');
};

export const importReport = (params: DeleteParams) => {
    return ajax('/report/report-proxy/add-from-std', params, 'POST');
};

export const getUpdateStatus = () => {
    return ajax('/report/report/get-dm-status', {}, 'GET');
};

export const updateReportRDS = () => {
    // getFetchOptions(getApiPath(`${server}/statistics-report/push-dm-data-wash-order`, { _smp: 'Rental.Report', _ac: 'Rental', o }, false), 'GET');
    return ajax('statistics-report/push-dm-data-wash-order', {}, 'GET', otherServer.bmsReportCenter);
};

export const editReport = (params: UpdateParams) => {
    // getFetchOptions(getApiPath(`${server}/statistics-report/push-dm-data-wash-order`, { _smp: 'Rental.Report', _ac: 'Rental', o }, false), 'GET');
    return ajax('/report/report-proxy/save', params, 'POST');
};
