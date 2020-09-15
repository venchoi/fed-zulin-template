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
                exchange.inAll = `${+exchange.inAll + amount}`;
            } else {
                exchange.outAll = `${+exchange.outAll + amount}`;
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
