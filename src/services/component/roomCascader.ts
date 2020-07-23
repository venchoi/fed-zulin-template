import ajax from '@/api/utils/ajax';

interface allRoomsParams {
    stage_id: string;
}

interface simpleRoomParams {
    stage_id: string;
    building_id: string;
    floor_name: string;
}

export const getAllRooms = (data: allRoomsParams) => {
    return ajax('/resource/building/get-stage-tree', { ...data, _csrf: '' }, 'GET');
};

export const getRoomsSimple = (data: simpleRoomParams) => {
    return ajax('/resource/room/search', { ...data, _csrf: '' }, 'GET');
};
