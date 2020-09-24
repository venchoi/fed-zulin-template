export interface selectedConfigType {
    stageId?: string;
    stageName?: string;
    selectedProjId?: string;
    subdistrictId: string;
    subdistrictName?: string;
    buildingId: string;
    buildingName?: string;
    floorId: string;
    roomId: string;
    roomName?: string;
}

export interface treeDataType {
    label: string;
    value: string;
    isLeaf: boolean;
    type: string;
    parent_id?: string;
    children?: treeDataType[];
}

export interface floorType {
    building_id: string;
    building_name: string;
    id: string;
    name: string;
    room_num: string;
    subdistrict_name: string | null;
    unit_id: string | null;
}

export interface buildingType {
    floors: floorType[];
    id: string;
    name: string;
    parent_id: string;
    stage_id: string;
    subdistrict_name: string | null;
    type_id: string;
    type_name: string;
    units: any[];
    value: string;
}

export interface subdistrictType {
    id: string;
    name: string;
    stage_id: string;
}

export interface stagesType {
    id: string;
    name: string;
    buildings: { [index: string]: buildingType } | buildingType[];
    subdistricts: subdistrictType[];
}

export interface roomType {
    label: string;
    value: string;
    type: string;
    room_no: string;
    unit_name: string;
    unit_name: string;
    id: string;
}

export interface selectedOptionType {
    type: string;
    value: string;
    label: string;
    loading?: boolean;
    children?: {
        label: string;
        value: string;
        type: string;
    }[];
}

export interface CascaderOptionChildType extends CascaderOptionType {
    value: string;
    label: string;
    loading: boolean;
}

export interface SelectedRoomConfig {
    stageId: stirng;
    stageName: string;
    subdistrictId: string;
    subdistrictName: string;
    buildingId: string;
    buildingName: string;
    floorId: string;
    floorName: string;
    roomId: string;
    roomName: string;
}
