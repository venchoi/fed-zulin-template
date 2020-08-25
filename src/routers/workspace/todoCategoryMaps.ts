import { categoryMapType } from './list.d';
export const categoryMap: categoryMapType = {
    finance: {
        name: '财务待办',
        type: 'finance',
        categories: [
            {
                name: '账单待审核',
                id: '账单待审核',
                columns: [],
            },
            {
                name: '账单待收款',
                id: '账单待收款',
                columns: [],
            },
            {
                name: '押金账单待审核',
                id: '押金账单待审核',
                columns: [],
            },
            {
                name: '押金账单待完成收款',
                id: '押金账单待完成收款',
                columns: [],
            },
            {
                name: '订单待退款',
                id: '订单待退款',
                columns: [],
            },
            {
                name: '资源待生成抽成',
                id: '资源待生成抽成',
                columns: [],
            },
            {
                name: '营业额抽成待审核',
                id: '营业额抽成待审核',
                columns: [],
            },
            {
                name: '逾期账单未处理',
                id: '逾期账单未处理',
                columns: [],
            },
            {
                name: '本月账单待收款',
                id: '本月账单待收款',
                columns: [],
            },
            {
                name: '本月待开具缴费通知单',
                id: '本月待开具缴费通知单',
                columns: [],
            },
        ],
    },
};

export const requestCodeGroup = {
    finance: [
        ['bill_reviewed', 'bill_collection', 'bill_collected'],
        ['bill_overdue', 'bill_not_note', 'bill_refunded'],
        ['deposit_bill_refunded', 'deposit_bill_collection'],
        ['turnover_reviewed', 'resources_generated'],
    ],
};
