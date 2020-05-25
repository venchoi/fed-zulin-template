/**
 * 由于菜单只能匹配一个地址，但某些菜单下的子页面可能是在内页中跳转，可能使用当前菜单无法高亮，这里另作配置，详见PageMenu.jsx实现
 * @type {Object}
 */

export const maps = [
    /**
     * key，菜单地址（不需把bastPath，以及它的查询参数写上，在PageMenu中会处理），value，正则表达式，用来匹配页面路由地址
     */
    { reg: '/middleground/report.*', key: 'Index', code: 'Report', name: '统计报表' },
    { reg: '/middleground/derate/list', key: 'Finance', code: 'Derate', name: '减免管理' },
];

export function getKey(pathName: any) {
    let key, code;
    for (const k in maps) {
        if (!Object.prototype.hasOwnProperty.call(maps, k)) continue;
        const reg = new RegExp(maps[k].reg);
        if (reg.test(pathName)) {
            key = maps[k].key;
            code = maps[k].code;
            break;
        }
    }
    return {
        key,
        code,
    };
}
