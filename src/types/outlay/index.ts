export interface FeeItem {
    fee_name: string;
}

export enum RangePickerType {
    pay,
    order,
}

export interface OutLayTableProps {
    outlayList: any[];
    outlayListTotal: number;
    page: number;
    pageSize: number;
    onPageSizeChange: Function;
    onPageChange: Function;
    extData: { canApplyInvoice: boolean; statisticData: StatisticData };
    onTableSelect: Function;
    selectedRowKeys: string[];
    selectedRows: OutLayListItem[];
}

export interface ExtBill {
    belong_date: string;
    contract_history_id: string;
    id: string;
    type: string;
}

export interface ExtContract {
    end_date: string;
    id: string;
    sign_date: string;
    start_date: string;
}

export interface ExtPayment {
    amount: string;
    exchange_id: string;
    type: string;
}

export interface AddressInfo {
    id: string;
    name: string;
}

export interface ExtRenter {
    address_detail: string;
    address_info: AddressInfo[];
    attentions: any[];
    birthday: string | null;
    brands: any[];
    city_id: null | null;
    created_by: string;
    created_on: string;
    district_id: string | null;
    email: string;
    enterprise_type: string;
    enterprise_type_name: string;
    id: string;
    id_code: string;
    id_code_type: string;
    id_code_type_name: string;
    id_photos: string;
    in_blacklist: string;
    industry_id: string;
    industry_name: string;
    investment_consultant_id: string;
    investment_consultant_name: string;
    is_deleted: string;
    landline: string;
    merchant_id: string;
    mobile: string;
    modified_by: string;
    modified_on: string;
    name: string;
    organization_code: string;
    organization_name: string;
    organization_photos: string;
    project_id: string;
    project_name: string;
    province_id: string;
    qichacha_key_no: string | null;
    qualification_attachments: any[] | null;
    qualification_status: string;
    qualification_time: string | null;
    remark: string | null;
    renter_status: string | null;
    rp_id: string | null;
    sex: string;
    short: string;
    source_id: string | null;
    source_name: string | null;
    source_type_id: string | null;
    source_type_name: string | null;
    type: string;
}

export interface FeeItem {
    amount: string;
    attachment: any[];
    available_invoicing_amount: number;
    bill_item_id: string;
    brand_name: null;
    building_floor: string;
    building_name: string;
    building_unit: string | null;
    can_invoicing: number;
    contract_room_id: string;
    derated_amount: number;
    end_date: string | null;
    fee: string;
    fee_name: string;
    fee_type: string;
    full_room_name: string;
    id: string;
    intent_id: string | null;
    invoice: any[] | null;
    late_fee_amount: string;
    late_fee_derated_amount: string;
    lessor_name: string;
    meter_reading_id: string | null;
    package_name: string | null;
    receipt: any[];
    room_name: string;
    room_no: string;
    start_date: string | null;
    transference: any[];
}

export interface OutLayListItem {
    bill_code: string;
    bill_id: string;
    code: string;
    contract_code: string;
    contract_history_id: string;
    contract_id: string;
    derated_amount: number;
    exchanged_amount: number;
    exchanged_on: string;
    exchanged_to: string;
    exchanged_to_name: string;
    ext_bill: ExtBill;
    ext_contract: ExtContract;
    ext_payment: ExtPayment[];
    ext_renter: ExtRenter;
    fee_items: FeeItem[];
    id: string;
    is_repeal: string;
    lessor_account: string | null;
    lessor_account_id: string;
    lessor_account_name: string | null;
    lessor_bank: string | null;
    lessor_name: string;
    origin_exchanged_to: string;
    origin_exchanged_to_name: string;
    payment_mode: string;
    payment_remark: string;
    payment_time: string;
    proj_id: string;
    proj_name: string;
    repeal_remark: string | null;
    settled_note: string | null;
    stage_id: string;
    stage_name: string;
    system_remark: string | null;
    transference_info: string | null;
    type: string;
    workflow_instance_id: string | boolean;
}

export interface StageDataItem {
    id: string;
    name: string;
    print_template_id: string;
}

export interface CanApplyInvoice {
    apply_receipt: number;
    has_third_vat: number;
}

export interface StatisticData {
    income: string;
    refund: string;
}
