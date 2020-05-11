import Cookie from 'js-cookie';
import { writeCssInStyles } from './cssUtils';
import { find } from 'lodash';
import removeCahce from './removeCache';
import { getKey } from '../components/FedMenu/menuRoutes';
import config from '../config';

const { DEV, serverPort } = config;
const appNames = [
    'Rental',
    'ManagementCenter',
    'OperationCenter',
    'AssetCenter',
    'Apartment',
    'PropertyBase',
    'MemberCenter',
    'FangYi',
    'ZhaoShang',
];
export function handleBaseInfo(payload: any) {
    const appLists: any = [];
    const navs = payload.funcNav.apps;
    let navItem, nav, appCode: any;
    const functions = payload.funcNav.functions;
    let hasNotPushed = false;
    for (const k in navs) {
        if (!Object.prototype.hasOwnProperty.call(navs, k)) continue;
        appLists.push({
            name: navs[k].app_name,
            key: navs[k].app_code,
            id: navs[k].id,
            url: navs[k].site_url,
            img: navs[k].icon_url,
            children: [],
        });
    }
    const pathKey = getKey(location.pathname);
    let str = '';
    //获取url的_smp参数
    const _smpParms = (Cookie.get('locationSearch_smp') || '').split('.')[0];
    function _set2Times() {
        for (const k in functions) {
            if (!Object.prototype.hasOwnProperty.call(functions, k)) {
                continue;
            }
            //#import   由于路由在多个地方跳转  现在必须保证的为 路由的前缀是唯一的 也就是在constans中配置的为  get到的 key  一直
            if (!appCode) {
                if (!appCode && functions[k].func_code && functions[k].func_code.indexOf(pathKey) !== -1) {
                    appCode = functions[k].app_code;
                }
            }
            if (!functions[k].pushed) {
                navItem = find(appLists, ['key', functions[k].app_code || _smpParms || 'Rental']);
                //设置 appCode  判断当前的地址
                if (!navItem) {
                    continue;
                }
                //判断当前的层级 如果是1 直接加入进去 否则的话
                if (Number(functions[k].level) === 1) {
                    functions[k].children = [];
                    functions[k].pushed = true;
                    navItem.children.push(functions[k]);
                } else {
                    nav = find(navItem.children, ['id', functions[k].parent_id]);
                    if (nav) {
                        functions[k].pushed = true;
                        if (DEV) {
                            //开发结算设置对应的端口号
                            if (!functions[k].func_url) functions[k].func_url = '';
                            // is_access_fun = 1,或者当前项目的标识与url _smp参数不一致也需要跳转 时表示需要外链
                            functions[k].func_url =
                                +functions[k].is_access_fun === 1
                                    ? functions[k].func_url
                                    : functions[k].func_url.replace(
                                          location.hostname,
                                          `${location.hostname}:${serverPort}`
                                      );
                        }
                        nav.children.push(functions[k]);
                    } else {
                        hasNotPushed = true;
                    }
                }
                //设置对应的权限的css
                functions[k].actions.forEach((action: any) => {
                    if (action.element_id !== null && action.element_id !== '') {
                        functions[k][action.element_id] = true;
                        str += `.${action.element_id},`;
                    }
                });
            }
        }
    }

    _set2Times();
    //搞两次 不行就算了
    if (hasNotPushed) {
        _set2Times();
    }
    if (str !== '') {
        str = str.slice(0, str.length - 1);
    }
    str += `{
                       display:inline-block !important;
                }`;
    writeCssInStyles(str);
    //appCode  如果为空的化 凑
    if (!appCode) appCode = _smpParms || 'Rental';
    //设置对应的nav  左边的菜单 app_code   设置缓存菜单
    //@ts-ignore
    window.urlFunctions = functions;
    //如果有icon-info  替换icon
    if (!payload.logo_info) {
        payload.logo_info = {};
    }
    if (payload.logo_info.icon) {
        //替换数据
        // @ts-ignore
        window.icon.setAttribute('href', payload.logo_info.icon);
    }
    if (payload.logo_info.title) {
        //替换数据
        window.document.title = payload.logo_info.title;
    }

    // // 排序app
    const sortNavsNames: any = [];
    appNames.forEach(item => {
        const find = appLists.find((nav: any) => nav.key === item);
        if (find) {
            sortNavsNames.push(find);
        }
    });
    appLists.forEach((nav: any) => {
        const find = sortNavsNames.find((item: any) => item.key === nav.key);
        if (!find) {
            sortNavsNames.push(nav);
        }
    });
    return {
        appCode,
        // navsNames: sortNavsNames,
        appList: appLists,
        // hasAssetCenter: payload.hasOwnProperty('is_open_asset_center') ? payload.is_open_asset_center : false, // 是否包含资管中心
        // onlineUrl: payload.onlineServiceUrl,
        logoInfo: payload.logo_info || {},
        user: payload.user,
        logoutUrl: payload.logoutUrl,
        passwordUrl: payload.passwordUrl,
        // merchantsSiteUrl: payload.merchantsSiteUrl, //用于rental跳转merchants的绝对地址
        // hasMenued: true
    };
}
