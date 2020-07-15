
export interface Props {
    history: History;
    user: User;
}

export interface RenterListProps {
    setLoading(isLoading: boolean): void;
    setTotalSize(total: number): void;
    totalSize: number;
    page: number;
    pageSize: number;
    stageId: string;
}

export interface renterType {
    alias: string;
    organization_name: string;
}

export interface contractRoomType {
    contract_id: string;
    id: string;
    room_name: string;
}

export interface renterListType {
    code: string;
    start_date: string; 
    end_date: string;
    contract_renter: renterType[];
    contract_room: contractRoomType[];
    admin_user_name: string;
    phone: string;
    email: string;
}

export interface statusMapType {
    [index: string]: string;
}
