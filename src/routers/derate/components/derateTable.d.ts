import {
    User,
    projsValue,
    feeItem,
    derateType,
    statusMapType,
    responseType,
    enableItemType,
    billFeeItemType,
} from '../list.d';
import History from history;
export interface getDerateListParams {
    proj_id?: string;
    page: number;
    page_size: number;
    keyword?: string;
    start_date?: string;
    end_date?: string;
    fee_name?: string;
    room_id?: string;
    subdistrict_id?: string;
    building_id?: string;
    floor_id?: string;
    floor_name?: string;
}
export interface derateTableProps {
    derateList: derateType[];
    derateTotal: number;
    user: User;
    history: History;
    selectedRowKeys: string[];
    onTableSelect?(keys: string[], rows: derateType[]): void;
    projIds: string[];
    projNames: string[];
    setLoading(loading: boolean): void;
    getDerateListData(): void;
    searchParams: getDerateListParams;
    setSearchParams(params: getDerateListParams): void;
    feeItemList: billFeeItemType[];
}

export interface selectedRowKeyType {
    id: string;
}

export interface selectedRoomConfigType {
    selectedProjId: string;
    subdistrictId: string;
    buildingId: string;
    floorId: string;
    floorName: string;
    roomId: string;
}

export interface selectedConfigType {
    stageId: string;
    subdistrictId: string;
    buildingId: string;
    floorId: string;
    floorName: string;
    roomId: string;
}
