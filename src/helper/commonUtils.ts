/**
 * 获取访问报表的完整链接
 * @returns {string}
 */
interface Obj {
    [inedx: string]: any;
}
export function getReportHref(params: Obj) {
    const hostName = window.location.hostname;
    const hostNamePrefix = 'app-ykj';
    const currentSmp = /_smp/.test(location.search)
        ? location.search.replace('?_smp=', '').replace('.Report', '')
        : 'Rental';
    let val = '';
    if (/test/.test(hostName) || /dev/.test(hostName)) {
        val = 'test';
    } else if (/beta/.test(hostName)) {
        val = 'beta';
    }
    const newHostNamePrefix = `${hostNamePrefix}${val ? '-' : ''}${val}`;
    let paramsPrefix = '';
    for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
            paramsPrefix += `${key}=${params[key]}&`;
        }
    }
    return `https://${newHostNamePrefix}.myfuwu.com.cn/bms/ReportCenter/statistics-report/view?${paramsPrefix}&_ac=Rental&_smp=${currentSmp}.ReportStatisticsMenu`;
}
