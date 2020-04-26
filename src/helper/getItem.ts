export function getItem(arr: any, id = '', key = 'id') {
    if (id === null || id === undefined) return null;
    for (const j in arr) {
        if (arr[j][key] && arr[j][key].toString() === id.toString()) {
            return arr[j];
        }
    }
    return null;
}
