import Cookies from 'js-cookie';
export default class App {
    static get = (key: string) => {
        return Cookies.get(key);
    };
    static set = (key: string, value: string, options?: any) => {
        Cookies.set(key, value, options);
    };
    static remove = (key: string, options?: any) => {
        Cookies.remove(key, options);
    };
}
