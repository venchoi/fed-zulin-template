import { IOutLayDetailItem, IOutLayDetailItemObj, OutLayListItem } from './type';

// 计算收支记录收入，支出，总额
export function calcOutlayAmount(list: IOutLayDetailItem[] | IOutLayDetailItemObj = []) {
    const exchange = {
        inAll: 0,
        outAll: 0,
        demuurageAll: 0,
        amountAll: 0,
        derated_amount: 0,
    };

    let amount;
    if (Array.isArray(list)) {
        list.forEach(item => {
            amount = parseFloat(item.amount || '0');
            if (amount > 0) {
                exchange.inAll = +exchange.inAll + amount;
            } else {
                exchange.outAll = +exchange.outAll + amount;
            }
            exchange.demuurageAll += parseFloat(item.late_fee_amount || '0');
            exchange.demuurageAll += parseFloat(item.fee || '0'); // 加上手续费
            exchange.derated_amount += Number(item.derated_amount) || 0;
        });
    } else {
        //该段逻辑是处理 账单合并 收款的数据返回处理
        const keyArr = Object.keys(list || {}) || [];
        keyArr.forEach((key: any) => {
            const arr = list[key];
            arr &&
                arr.forEach((item: IOutLayDetailItemObj) => {
                    amount = parseFloat(item.amount || '0');
                    if (amount > 0) {
                        exchange.inAll += amount;
                    } else {
                        exchange.outAll += amount;
                    }
                    exchange.demuurageAll += parseFloat(item.late_fee_amount || '0');
                    exchange.demuurageAll += parseFloat(item.fee || '0'); // 加上手续费
                    exchange.derated_amount += Number(item.derated_amount) || 0;
                });
        });
    }
    exchange.inAll += exchange.demuurageAll;
    exchange.amountAll = exchange.inAll + exchange.outAll;
    return {
        inAll: exchange.inAll.toFixed(2),
        outAll: exchange.outAll.toFixed(2),
        demuurageAll: exchange.demuurageAll.toFixed(2),
        amountAll: exchange.amountAll.toFixed(2),
        derated_amount: exchange.derated_amount.toFixed(2),
    };
}

// 处理数据，由于返回的数据结构跟显示的不一致
export function getExchangeList(exchangeList: IOutLayDetailItem[] = []) {
    const arr = [];
    let amount = '0';

    // 【20180702】目前只会有一行数据
    if (exchangeList && exchangeList.length === 1) {
        arr.push(exchangeList[0]);
        amount = exchangeList[0].amount.replace('-', '');
    }
    exchangeList &&
        exchangeList.map(item => {
            if (item && item.transference && item.transference.transference_type) {
                const obj = JSON.parse(JSON.stringify(item.transference));
                if (obj.room_name) {
                    obj.full_room_name = obj.room_name;
                }
                // 这里偷了一个懒 后端数据没有正确返回 只是在前端人为的让两个金额强制一致
                obj.amount = amount;
                arr.push(obj);
            }
            return item;
        });
    return arr;
}

const CAN_NOT_CHECKED_MAP = ['1100', '1000', '1001', '0110', '0010', '0011'];

enum RECEIPT_STATUS {
    '未开票',
    '开票中',
    '已开票',
}

// 收支列表记录项是否可以勾选
export function isOutlayListRecordCanChecked(record: OutLayListItem, selectedRows: OutLayListItem[]) {
    /*  1、勾选了未开收据-未开发票的[1, 1]，不能勾选已开收据/开收据中-已开发票/开发票中的[0, 0]，可做合并开收据操作、合并开票/申请开票；
        2、勾选了未开收据-已开发票/开发票中的[1, 0]，不能勾选已开收据/收据中的[0, 0]|[0, 1]，合并开收据操作；
        3、勾选了已开收据-未开发票的[0, 1]，不可勾选未开收据/开收据中的-已开发票的[1, 0]|[-, 0]，可做合并开发票/申请开票、批量合并打印、批量逐条打印；
        4、勾选了已开收据-已开发票/开发票中的[0, 0]，不可勾选未开收据/开收据中的[1, 0]|[1, 1]|[-, 0]|[-, 1]，可做批量合并打印、批量逐条打印；
        5、勾选了开收据中-未开发票[-, 1]，不可勾选已开发票/开发票中的[0, 0]|[1, 0]，可做合并开发票/申请开票
        6、开收据中-已开发票/开发票中[-, 0]，不可勾选
        备注：未开收据：可开收据；已开收据/开收据中：不可开收据；未开发票：可开发票；已开发票/开发票中：不可开发票。
            can_invoicing/can_receipt为1表示可开（未开），0表示不可开（已开/正在开中）
        
    */
    const { fee_items = [] } = record;
    for (let i = 0, len = selectedRows.length; i < len; i++) {
        const { fee_items: feeItems = [] } = selectedRows[i];
        const key = `${feeItems[0]?.can_receipt}${feeItems[0]?.can_invoicing}${fee_items[0]?.can_receipt}${fee_items[0]?.can_invoicing}`;
        console.log('key', key);
        if (CAN_NOT_CHECKED_MAP.includes(key)) {
            return false;
        }
        if (
            feeItems[0]?.can_receipt === 0 &&
            feeItems[0]?.can_invoicing === 1 &&
            fee_items[0]?.receipt_status === '开票中' &&
            fee_items[0]?.can_invoicing === 0
        ) {
            // 后端数据有点乱（开票中的但是确实已经开票了），先在前端解决，后续优化
            if (fee_items[0]?.receipt?.length > 0) {
                return true;
            }
            return false;
        }
        if (
            feeItems[0]?.can_receipt === 0 &&
            feeItems[0]?.can_invoicing === 0 &&
            fee_items[0]?.receipt_status === '开票中'
        ) {
            // 后端数据有点乱（开票中的但是确实已经开票了），先在前端解决，后续优化
            if (fee_items[0]?.receipt?.length > 0) {
                return true;
            }
            return false;
        }
        if (
            feeItems[0]?.receipt_status === '开票中' &&
            feeItems[0]?.can_invoicing === 1 &&
            fee_items[0]?.can_invoicing === 0
        ) {
            return false;
        }
    }
    if (fee_items[0]?.receipt_status === '开票中' && fee_items[0]?.can_invoicing === 0) {
        // 后端数据有点乱（开票中的但是确实已经开票了），先在前端解决，后续优化
        if (fee_items[0]?.receipt?.length > 0) {
            return true;
        }
        return false;
    }
    return true;
}
