export default class localstorage {
    static set = (key: string, value: string) => {
        localStorage.setItem(key, value);
    };
    static get = (key: string) => {
        return localStorage.getItem(key);
    };
    static remove = (key: string) => {
        localStorage.removeItem(key);
    };
}
