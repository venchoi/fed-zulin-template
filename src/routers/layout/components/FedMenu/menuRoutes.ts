/**
 * 由于菜单只能匹配一个地址，但某些菜单下的子页面可能是在内页中跳转，可能使用当前菜单无法高亮，这里另作配置，详见PageMenu.jsx实现
 * @type {Object}
 */

export const maps = [
    /**
     * key，菜单地址（不需把bastPath，以及它的查询参数写上，在PageMenu中会处理），value，正则表达式，用来匹配页面路由地址
     */
    { reg: '/static/project.*', key: 'Project', name: '项目管理' },
    { reg: '/static/assetmap.*', key: 'ResourceMap', name: '资产地图' },
    { reg: '/static/repay.*', key: 'Stage', name: '项目管理' },
    { reg: '/static/apartment.*', key: 'RoomType', name: '户型管理' },
    { reg: '/static/room.*', key: 'Room', name: '房间管理' },
    { reg: '/static/basicfee.*', key: 'Fee', name: '基本费项' },
    { reg: '/static/status.*', key: 'RoomStatus', name: '房态管理' },
    { reg: '/static/checkin.*', key: 'CheckIn', name: '入驻办理' },
    { reg: '/static/backrent.*', key: 'CheckOut', name: '退租办理' },
    { reg: '/static/lease.*', key: 'Relet', name: '续租管理' },
    { reg: '/static/property-change/list.*', key: 'PropertyContractChange', name: '变更管理' }, // 物业合同变更管理
    { reg: '/static/property-change/edit.*', key: 'PropertyContractChange', name: '变更管理' }, // 物业合同变更管理
    { reg: '/static/property-change/.*', key: 'PropertyContractChange', name: '变更管理' }, // 物业合同变更管理
    { reg: '/static/property-contract/list.*', key: 'PropertyContractList', name: '物业合同列表' },
    { reg: '/static/property-contract/add.*', key: 'PropertyContractAdd', name: '新签物业合同' },
    { reg: '/static/property-contract/edit.*', key: 'PropertyContractList', name: '物业合同列表' },
    { reg: '/static/property-contract/detail.*', key: 'PropertyContractList', name: '物业合同列表' },
    { reg: '/static/property-contract/temp.*', key: 'PropertyContractList', name: '物业合同列表' },
    { reg: '/static/property-contract/checkIn.*', key: 'PropertyContractList', name: '物业合同列表' },
    { reg: '/static/property-contract/backrent.*', key: 'PropertyContractList', name: '物业合同列表' },
    { reg: '/static/property-contract/.*', key: 'PropertyContractList', name: '物业合同列表' },
    { reg: '/static/contract/lease.*', key: 'Relet', name: '续租管理' },
    { reg: '/static/contract/add.*', key: 'ContractAdd', name: '新签合同' },
    { reg: '/static/contract/intent.*', key: 'ContractAdd', name: '新签合同' },
    { reg: '/static/contract/book.*', key: 'Contract', name: '合同列表' },
    { reg: '/static/contract/intent.*', key: 'Contract', name: '合同列表' },
    { reg: '/static/contract/edit.*', key: 'Contract', name: '合同列表' },
    { reg: '/static/contract/temp.*', key: 'Contract', name: '合同列表' },
    { reg: '/static/contract/contractlease.*', key: 'Contract', name: '合同列表' },
    { reg: '/static/contract/.*', key: 'Contract', name: '合同列表' },
    { reg: '/static/change.*', key: 'ContractChange', name: '变更管理' },
    { reg: '/static/contractlist.*', key: 'Contract', name: '合同列表' },
    { reg: '/static/contract/detail.*', key: 'Contract', name: '合同列表' },
    { reg: '/static/businessdata.*', key: 'Business', name: '营业额管理' },
    { reg: '/static/commission.*', key: 'Commission', name: '营业抽成' },
    { reg: '/static/meter.*', key: 'Meter', name: '抄表管理' },
    { reg: '/static/sundry.*', key: 'Sundry', name: '杂项费用' },
    { reg: '/middleground/report.*', key: 'Index', code: 'Report', name: '统计报表' },
    { reg: '/static/operational.*', key: 'Operational', name: '财务收支' },
    { reg: '/static/finance.*', key: 'Finance', name: '财务收支' },
    { reg: '/static/billing.*', key: 'Bill', name: '账单管理' },
    { reg: '/static/receipt.*', key: 'Receipt', name: '票据管理' },
    { reg: '/static/outlay.*', key: 'Outlay', name: '收支管理' },
    { reg: '/static/tenant.*', key: 'ManageRenter', name: '租客管理' },
    { reg: '/static/member.*', key: 'Renter', name: '会员管理' },
    { reg: '/static/basicdata.*', key: 'Parameter', name: '基础数据' },
    { reg: '/fed/basicdata.*', key: 'System', code: 'Parameter', name: '基础数据' },
    { reg: '/static/template.*', key: 'Parameter', name: '基础数据' },
    { reg: '/static/print.*', key: 'Parameter', name: '基础数据' },
    { reg: '/static/globaldata.*', key: 'Global', name: '全局参数' },
    { reg: '/static/static/merchantInfo.*', key: 'Renter', name: '客商信息' },
    { reg: '/static/merchantNew.*', key: 'MerchantAdminNew', name: '商机分配' },
    { reg: '/static/merchant.*', key: 'MerchantAdminNew', name: '商机分配' },
    { reg: '/static/customers.*', key: 'RenterNew', name: '跟客管理' },
    { reg: '/static/enquiry.*', key: 'Enquiry', name: '问询管理' },
    { reg: '/static/refund.*', key: 'Refund', name: '退款管理' },
    { reg: '/static/derate.*', key: 'Derate', name: '减免管理' },
    { reg: '/static/intent/add.*', key: 'IntentAdd', name: '新签意向书' },
    { reg: '/static/intent.*', key: 'Intent', name: '意向书列表' },
    { reg: '/static/deposit.*', key: 'Deposit', name: '预存金管理' },
    { reg: '/static/workflowApproval.*', key: 'WorkflowApproval', name: '办理的流程' },
    { reg: '/static/establishWorkflowApproval.*', key: 'EstablishWorkflowApproval', name: '发起的流程' },
    { reg: '/static/priceStrategy.*', key: 'PriceStrategy', name: '底价策略' },
    { reg: '/static/brandplan.*', key: 'RoomStatus', name: '房态管理' },
    { reg: '/static/brand.*', key: 'Brand', name: '品牌管理' },
    { reg: '/static/foregift.*', key: 'Bill', name: '账单管理' },
    { reg: '/static/earnest.*', key: 'Bill', name: '账单管理' },
    { reg: '/static/prestore.*', key: 'Bill', name: '账单管理' },
    { reg: '/static/tally.*', key: 'Bill', name: '账单管理' },
    { reg: '/static/settle.*', key: 'Bill', name: '账单管理' },
    { reg: '/static/meeting-room-order.*', key: 'MeetingRoomOrder', name: '会议室订单' },
    { reg: '/static/meeting-room.*', key: 'MeetingRoomManage', name: '会议室' },
    { reg: '/static/workflowManage.*', key: 'WorkflowManage', name: '流程管理' },
    { reg: '/static/dashboard.*', key: 'Dashboard', name: '仪表盘' },
    { reg: '/static/archives.*', key: 'Room', name: '资产档案' },
    { reg: '/static/inner-tools.*', key: 'Parameter', name: '基础数据' },
    { reg: '/static/renter-customers-service.*', key: 'RenterCustomersService', name: '租户服务' },
    { reg: '/fed/billing.*', key: 'Finance', code: 'Bill', name: '账单管理' },
    { reg: '/fed/business-volume.*', key: 'LeaseManage', code: 'Business', name: '营业额管理' },
    { reg: '/fed/bill-reminder.*', key: 'Finance', code: 'BillReminder', name: '账单催款' },
    { reg: '/fed/invoice-manage.*', key: 'InvoiceManage', code: 'InvoiceManage', name: '票据管理' },
    { reg: '/fed/voucher.*', key: 'Finance', code: 'VoucherList', name: '凭证管理' },
    { reg: '/fed/invoice.*', key: 'Finance', code: 'Receipt', name: '票据管理' },
    { reg: '/fed/receipt.*', key: 'Finance', code: 'Receipt', name: '票据管理' },
];

export function getKey(pathName: any) {
    let key, code;
    for (const k in maps) {
        if (!Object.prototype.hasOwnProperty.call(maps, k)) continue;
        const reg = new RegExp(maps[k].reg);
        if (reg.test(pathName)) {
            key = maps[k].key;
            code = maps[k].code;
            break;
        }
    }
    return {
        key,
        code,
    };
}
