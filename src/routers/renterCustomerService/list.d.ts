
export interface Props {
    history: History;
    user: User;
}

export interface RenterListProps {

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
}