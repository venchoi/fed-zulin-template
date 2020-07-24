/*
 * 日期 对象、字符串的一些处理方法
 * */

/**
 * 时间字符串显示到分
 * 如 2020-07-24 11:30:01 处理为 2020-07-24 11:30
 * @param 时间字符串
 */
export function dateStrShow2Min(dateStr?: string): string {
    let str = dateStr || '';
    if (str) {
        const arr = str.split(':');
        if (arr && arr.length === 3) {
            str = `${arr[0]}:${arr[1]}`;
        }
    }
    return str;
}
