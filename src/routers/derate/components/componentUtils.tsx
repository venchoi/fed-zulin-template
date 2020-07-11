import { feeItemType, derateDetailDataType } from './derateSubRow.d';
export const initDerateDetailData = (data: derateDetailDataType) => {
    const roomsMap: { [index: string]: feeItemType[] } = {};
    const { status } = data;
    data.copyItems = [];
    data.items.forEach((item: feeItemType) => {
        const copyItem = {
            ...item,
            isDemurrage: false,
        };
        const copyDemurrageItem = {
            ...item,
            isDemurrage: true,
        };
        if (!roomsMap[item.room_name]) {
            roomsMap[item.room_name] = [];
        }
        if (status !== '已减免') {
            if ((copyItem.stayAmount || 0) * 1 > 0) {
                roomsMap[item.room_name].push(copyItem);
            }
            if ((copyItem.stayDemurrageAmount || 0) * 1 > 0) {
                roomsMap[item.room_name].push(copyDemurrageItem);
            }
        } else {
            roomsMap[item.room_name].push(copyItem);
            if ((copyItem.demurrage_derated_amount || 0) * 1 > 0) {
                roomsMap[item.room_name].push(copyDemurrageItem);
            }
        }

        if (Array.isArray(copyItem.full_room_name)) {
            copyItem.full_room_name = copyItem.full_room_name.join('、');
        }
        if (Array.isArray(copyDemurrageItem.full_room_name)) {
            copyDemurrageItem.full_room_name = copyDemurrageItem.full_room_name.join('、');
        }
        copyItem.renter_name = copyItem.renter_organization_name;
        copyDemurrageItem.renter_name = copyDemurrageItem.renter_organization_name;
        if (status !== '已减免') {
            if ((copyItem.stayAmount || 0) * 1 > 0) {
                data.copyItems.push(copyItem);
            }
            if ((copyItem.stayDemurrageAmount || 0) * 1 > 0) {
                data.copyItems.push(copyDemurrageItem);
            }
        } else {
            data.copyItems.push(copyItem);
            if ((copyItem.demurrage_derated_amount || 0) * 1 > 0) {
                data.copyItems.push(copyDemurrageItem);
            }
        }
    });
    data.items = data.copyItems;
    const roomNames: string[] = Object.keys(roomsMap);
    // 为表格跨行显示设置rowSpan
    roomNames.forEach(roomName => {
        const len = roomsMap[roomName].length;
        for (let j = 0; j < len; j++) {
            if (j === 0) {
                roomsMap[roomName][j].rowSpan = len;
            } else {
                roomsMap[roomName][j].rowSpan = 0;
            }
        }
    });
};
