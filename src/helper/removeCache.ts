//@ts-nocheck
export default function removeCache() {
    Cookie.remove('stageName');
    Cookie.remove('stageId');
    Cookie.remove('room_type');
    Cookie.remove('fee_type');
    Cookie.remove('fee_list_id');
    Cookie.remove('fee_item_id');
    localStorage.removeItem('stageNames');
    localStorage.removeItem('stageIds');
    localStorage.removeItem('stageType');
}