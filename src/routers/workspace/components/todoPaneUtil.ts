export const getRidrectUrl = (code: string, record: any) => {
    if (!code) {
        return;
    }
    switch (code) {
        // 账单待审核
        case 'bill_reviewed':
            return `/static/billing/list?selectStatusParents=${window.encodeURIComponent(
                '待收款'
            )}&selectedStatus=${window.encodeURIComponent('待审核')}&keyword=${record.code}`;
            break;
        // 账单待退款
        case 'bill_refunded':
            return `/static/billing/list?selectStatusParents=${window.encodeURIComponent('待退款')}&keyword=${
                record.code
            }`;
            break;
        // 押金账单待审核
        case 'deposit_bill_refunded':
            return `/static/billing/list?type=foregift&foregiftStatusOption=${window.encodeURIComponent('待审核')}&foregiftStatus=${window.encodeURIComponent('待收款')}&keyword=${
                record.code
            }`;
            break;
        // 账单待完成收款
        case 'bill_collected':
            return `/static/billing/list?selectStatusParents=${window.encodeURIComponent(
                '待收款'
            )}&selectedStatus=${window.encodeURIComponent('已审核')}&payEndDateType=${window.encodeURIComponent(
                '自定义筛选'
            )}&today=1&keyword=${record.code}`;
            break;
        // 账单已逾期未处理
        case 'bill_overdue':
            return `/static/billing/list?selectStatusParents=${window.encodeURIComponent(
                '待收款'
            )}&selectedStatus=${window.encodeURIComponent('已逾期')}&keyword=${record.code}`;
            break;
        // 营业额抽成待审核
        case 'turnover_reviewed':
            return `/static/commission/list?commissionSelectedStatus=${window.encodeURIComponent('待审核')}&keyword=${
                record.contract_code
            }&proj_id=${record.proj_id}&proj_name=${record.proj_name}&_smp=Rental.Commission`;
            break;
        // 资源待生成抽成
        case 'resources_generated':
            return `/static/commission/list?proj_id=${record.proj_id}&proj_name=${record.proj_name}&_smp=Rental.Commission`;
            break;
        // 押金账单待完成收款
        case 'deposit_bill_collection':
            return `/static/billing/list?type=foregift&foregiftStatus=${window.encodeURIComponent('待收款')}&keyword=${
                record.code
            }`;
            break;
        // 本月待完成收款账单
        case 'bill_collection':
            return `/static/billing/list?selectStatusParents=${window.encodeURIComponent(
                '待收款'
            )}&selectedStatus=${window.encodeURIComponent('已审核')}&payEndDateType=${window.encodeURIComponent(
                '本月'
            )}&keyword=${
                record.code
            }`;
            break;
        // 本月未开具缴费通知单账单
        case 'bill_not_note':
            return `/fed/bill-reminder/pay-note-open?proj_id=${record.proj_id}&proj_name=${record.proj_name}&currentMonth=1`;
            break;
    }
};
