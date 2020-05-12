export default class sessionstorage {
    static set = (key: string, value: string) => {
        sessionStorage.setItem(key, value);
    };
    static get = (key: string) => {
        return sessionStorage.getItem(key);
    };
    static remove = (key: string) => {
        sessionStorage.removeItem(key);
    };
}
