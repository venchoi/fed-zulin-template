import { IOutLayDetailItem, IOutLayDetailItemObj } from './type';

// 计算收支记录收入，支出，总额
export function calcOutlayAmount(list: IOutLayDetailItem[] | IOutLayDetailItemObj = []) {
    const exchange = {
        inAll: '0',
        outAll: '0',
        demuurageAll: '0',
        amountAll: '0',
        derated_amount: '0',
    };

    let amount;
    if (Array.isArray(list)) {
        list.forEach(item => {
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
    exchange.amountAll = (+exchange.inAll + +exchange.outAll).toFixed(2);
    exchange.inAll = (+exchange.inAll).toFixed(2);
    exchange.outAll = (+exchange.outAll).toFixed(2);
    exchange.derated_amount = parseFloat(exchange.derated_amount).toFixed(2);
    return exchange;
}
