interface IRenter {
    attentions: {
        description: string;
        mobile: string;
        name: string;
    }[];
    id: string;
    mobile: string;
    name: string;
    organization_code: string;
    organization_name: string;
    type: string;
}

interface IStage {
    id: string;
    name: string;
    print_template_id: string;
}

export interface IOutLayDetailItem {
    amount: string;
    attachment: any[];
    bill_item_id: string;
    brand_name: string;
    building_floor: string;
    building_name: string;
    building_unit: string;
    contract_room_id: string;
    derated_amount: number;
    end_date: string;
    fee: string;
    fee_name: string;
    fee_type: string;
    full_room_name: string;
    id: string;
    intent_id: string;
    late_fee_amount: string;
    late_fee_derated_amount: string;
    lessor_name: string;
    meter_reading_id: string;
    package_name: string;
    receipt: any[];
    room_name: string;
    room_no: string;
    start_date: string;
    transference: any[];
}

export interface IOutLayDetailItemObj {
    [key: string]: any;
    amount: string;
    derated_amount: string;
    fee: string;
    late_fee_amount: string;
}

export interface IGetOutlayDetailParams {
    id: string;
}

export interface IOutlayDetail {
    info: {
        contract: {
            lessor_id: string;
            lessor_name: string;
        };
        exchange: {
            attachment: any[];
            bill_code: string;
            bill_id: string;
            code: string;
            contract_code: string;
            contract_id: string;
            derated_amount: number;
            exchanged_amount: string;
            exchanged_by_name: string;
            exchanged_on: string;
            exchanged_to: string;
            exchanged_to_name: string;
            id: string;
            is_repeal: number;
            late_fee_derated_amount: number;
            lessor_account: string;
            lessor_account_id: string;
            lessor_account_name: string;
            lessor_bank: string;
            lessor_name: string;
            payment_mode: string;
            payment_no: string;
            payment_remark: string;
            payment_time: string;
            renter_account: string;
            renter_account_id: string;
            renter_account_name: string;
            renter_account_remark: string;
            renter_account_type: string;
            renter_bank: string;
            repeal_by: null | string;
            repeal_remark: null | string;
            repeal_time: null | string;
            system_remark: null | string;
            transaction_code: string;
            transference_info: any;
            type: string;
        };
        renter: IRenter;
        stage: IStage;
    };
    items: IOutLayDetailItem[] | IOutLayDetailItemObj;
}

export interface IGetBillInfoParams {
    billId: string;
}

export interface IBillInfoItem {
    bill: {
        belong_date: string;
        code: string;
        contract_history_id: string;
        contract_id: string;
        demurrageAmount: number;
        deratedAmount: string;
        deratedDemurrageAmount: string;
        id: string;
        isOverdue: boolean;
        isWarning: boolean;
        overdueDays: boolean;
        payIncomePartAmount: string;
        payRefundPartAmount: string;
        paymentAmount: string;
        paymentDemurrageAmount: string;
        recIncomePartAmount: number;
        recRefundPartAmount: number;
        receivableAmount: string;
        status: string;
        type: string;
    };
    contract: {
        code: string;
        end_date: string;
        id: string;
        lessor_id: null | string;
        sign_date: string;
        start_date: string;
    };
    renter: IRenter;
    stage: IStage;
}

export interface IBillInfo {
    items: IBillInfoItem[];
}

/* export interface IOutlayAmount {
    inAll: string;
    outAll: string;
    demuurageAll: string;
    amountAll: string;
    derated_amount: string;
} */
