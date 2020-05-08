// 管理中心或运营中心其他站点 server
interface ServerMap {
    [index: string]: {
        test: string;
        prod: string;
    };
}

export const serverMap: ServerMap = {
    bmsReportCenter: {
        test: 'https://app-ykj-test.myfuwu.com.cn/bms/ReportCenter/',
        prod: 'https://app-ykj.myfuwu.com.cn/bms/ReportCenter/',
    },
};

export default {
    bmsReportCenter: 'bmsReportCenter',
};
