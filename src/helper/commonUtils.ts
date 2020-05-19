/**
 * 获取访问报表的完整链接
 * @returns {string}
 */
interface Obj {
    [inedx: string]: any;
}

interface windowType {
    urlFunctions: any;
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

interface EventType extends MouseEvent {
    path?: HTMLElement[];
    target: HTMLElement;
}
export const getPath = (e: EventType) => {
    if (e.path) return e.path;
    let elem = e.target;
    const path = [elem];
    while (elem.parentElement) {
        elem = elem.parentElement;
        path.unshift(elem);
    }
    return path;
};

export const isOutsideClick = (e: EventType, className: string) => {
    if (!(e instanceof Event) || !className) return false;
    return !getPath(e).some(node => node.className && node.className.indexOf && node.className.indexOf(className) >= 0);
};

export function formatNum(num: number | string, decimal: number = 2) {
    if (Number(num)) {
        return Number(num).toFixed(decimal);
    }
    return (0).toFixed(decimal);
}

export function comma(num: string): string {
    const reg = /^[-+]?[0-9]+(\.?[0-9])?[0-9]*$/;
    const str = num.toString();
    if (reg.test(str)) {
        //开始替换 取得符号
        const split = str.split('.');
        const int = split[0];
        const decimal = split[1];
        return `${int.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')}${decimal ? `.${decimal}` : ''}`;
    }
    return str;
}

/**
 * 检测当前用户权限是否存在
 * @param funcCode
 * @param elementId
 */
export function checkPermission(funcCode: string, elementId: string) {
    const arr = (<any>window).urlFunctions;
    let hasRights = false;
    if (arr && arr.length > 0) {
        const r = arr.filter((item: any) => item.func_code === funcCode);
        if (r && r.length === 1) {
            const hasExist = r[0].actions.filter((item: any) => item.element_id === elementId);
            if (hasExist && hasExist.length === 1) {
                hasRights = true;
            }
        }
    }
    return hasRights;
}
