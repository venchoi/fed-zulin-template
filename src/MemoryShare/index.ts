/**
 * 内存、持久化缓存模块
 */
import cookie from './cookie';
import localStore from './localStorage';
import sessionStore from './sessionStorage';

export const vm = new WeakMap(); //键为对象
export const m = new Map(); //键为任意
export const Cookies = cookie;
export const Local = localStore;
export const Session = sessionStore;
