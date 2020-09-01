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
    if(!num || (typeof num !== 'string' && typeof num !== 'number')) {
        return num;
    }
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

/**
 * encode文件名
 * @param url
 */
export function enCodeFileName(url: string) {
    if (url) {
        const index = url.lastIndexOf('/');
        const pre = url.substring(0, index + 1);
        let next = url.substring(index + 1);
        if (next) {
            next = encodeURIComponent(next);
        }
        return `${pre}${next}`;
    }
    return url;
}

/**
 * 生成随机字符串
 * @returns {string}
 */
export function randomStr() {
    return (
        Math.random()
            .toString(32)
            .slice(2) + (+new Date()).toString(16)
    );
}

/**
 * 对于正式和中文的排序
 * @param arr
 * @returns []
 */
export function sort(arr: any[]): any[] {
    arr.sort((x, y): number => {
        const reg = /(\D*)?(-\d+|\d*)(\D*)?/;
        const regFix = /(\D*)?(-\d+)(\D*)?/;
        const xResult = reg.exec(x.name) || [];
        const xResultFix = regFix.exec(x.name);
        const yResult = reg.exec(y.name) || [];
        const yResultFix = regFix.exec(y.name);
        const xHead = xResultFix ? xResultFix[1] : xResult[1];
        const xNum = (xResultFix && xResultFix[2]) || xResult[2];
        const xFoot = xResult[3];
        const yHead = yResultFix ? yResultFix[1] : yResult[1];
        const yNum = (yResultFix && yResultFix[2]) || yResult[2];
        const yFoot = yResult[3];
        if (xHead && yHead) {
            if (xHead !== yHead) {
                return xHead > yHead ? 1 : -1;
            }
        }
        if (xHead && !yHead) {
            return 10000000000000;
        }
        if (!xHead && yHead) {
            return -10000000000000;
        }
        if (xNum && yNum) {
            if (xNum !== yNum) {
                if (xHead) {
                    return parseFloat(xNum) - parseFloat(yNum);
                }
                return parseFloat(yNum) - parseFloat(xNum);
            }
        }
        if (xFoot && yFoot) {
            if (xNum !== yNum) {
                if (xHead) {
                    return yFoot > xFoot ? 1 : -1;
                }
                return xFoot > yFoot ? 1 : -1;
            }
        }
        return x.name > y.name ? 1 : -1;
    });
    return arr;
}
