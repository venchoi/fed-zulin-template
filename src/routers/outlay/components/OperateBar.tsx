import React from 'react';
import { Divider, Button, message } from 'antd';
import { getReportHref } from '@/helper/commonUtils';

import './OperateBar.less';
import { OutLayListItem, StageDataItem } from '../type';

enum OperateType {
    combinedInvoice,
    combinedReceipt,
    combinedApplyInvoice,
    batchCombinedPrint,
    batchLineByLinePrint,
}

interface BillItem {
    bill_item_id: string;
    amount: number;
}

interface Props {
    selectedRowKeys: string[];
    selectedRows: OutLayListItem[];
    stageData: StageDataItem[];
    user: any;
    onClear: Function;
    canApplyInvoice: boolean;
}

function OperateBar(props: Props) {
    const { selectedRows, selectedRowKeys, stageData, user, canApplyInvoice, onClear } = props;

    console.log('====OperateBar canApplyInvoice', canApplyInvoice);

    // 是否能开发票
    const isInvoiceEnabled =
        selectedRows.length > 0 &&
        selectedRows.every(item => {
            return (
                item.fee_items &&
                item.fee_items.some(feeItem => {
                    return feeItem.can_invoicing === 1;
                })
            );
        });

    // 是否能开收据
    const isBatchReceiptEnabled =
        selectedRows.length > 0 &&
        selectedRows.every(item => {
            return (
                item.fee_items &&
                item.fee_items.some(feeItem => {
                    return feeItem.can_receipt === 1;
                })
            );
        });

    // 是否能打印。所勾选的项是否收据都开具了
    const isPrintEnabled =
        selectedRows.length > 0 &&
        selectedRows.every(item => {
            const { fee_items } = item;
            const hasReceipt =
                fee_items && fee_items.length > 0 && fee_items[0].receipt && fee_items[0].receipt.length > 0;
            return hasReceipt;
        });

    const getBatchInvoiceItems = () => {
        let billItems: BillItem[] = [];
        const billItemsMap: any = {};
        selectedRows.forEach(item => {
            const { fee_items } = item;
            billItems = billItems.concat(
                fee_items.map(innerItem => {
                    return {
                        bill_item_id: innerItem.bill_item_id,
                        amount: innerItem.available_invoicing_amount * 1,
                    };
                })
            );
        });
        billItems.forEach(item => {
            const billId = item.bill_item_id;
            if (billItemsMap[billId]) {
                billItemsMap[billId].amount += (item.amount || 0) * 1;
            } else {
                billItemsMap[billId] = item;
            }
        });
        billItems = Object.keys(billItemsMap).map(itemId => {
            return billItemsMap[itemId];
        });
        return billItems;
    };
    const handleClear = () => {
        onClear();
    };
    const handleClick = (type: OperateType) => {
        const stageId = selectedRows[0].proj_id;
        let billItems;
        if (!stageId) {
            return;
        }
        switch (type) {
            case OperateType.combinedReceipt:
                window.location.href = `/fed/receipt/invoice?exchange_ids=${selectedRowKeys.join(
                    ','
                )}&stage_id=${stageId}`;
                break;
            case OperateType.combinedInvoice:
                billItems = getBatchInvoiceItems();
                window.location.href = `/fed/invoice/invoice?bill_items=${JSON.stringify(
                    billItems
                )}&stage_id=${stageId}`;
                break;
            case OperateType.combinedApplyInvoice:
                billItems = getBatchInvoiceItems();
                window.location.href = `/fed/invoice/apply-invoice?bill_items=${JSON.stringify(
                    billItems
                )}&stage_id=${stageId}`;
                break;
            case OperateType.batchCombinedPrint:
            case OperateType.batchLineByLinePrint:
                const exchangeIds: string[] = [];
                //租客 id 集合
                const renterIds: string[] = [];
                selectedRows.forEach(item => {
                    exchangeIds.push(item.id);
                    if (Object.hasOwnProperty.call(item, 'ext_renter')) {
                        renterIds.push(item.ext_renter.id);
                    }
                });
                const filterStageData = stageData.find(item => item.id === stageId);
                if (
                    filterStageData &&
                    Object.hasOwnProperty.call(filterStageData, 'print_template_id') &&
                    filterStageData.print_template_id !== ''
                ) {
                    const printTemplateId = filterStageData.print_template_id;
                    const exchangeIdStr = exchangeIds.map(ex => `'${ex}'`).join(',');
                    const currRenterId = renterIds[0];
                    const isPass = renterIds.every(item => item === currRenterId);
                    if (type === OperateType.batchCombinedPrint && !isPass) {
                        message.error('所选交易中，存在不同交易方，不允许打印收据！');
                        return;
                    }
                    const params = {
                        id: printTemplateId,
                        exchange_ids: exchangeIdStr,
                        is_print_one: 0,
                    };
                    if (type === OperateType.batchLineByLinePrint) {
                        params.is_print_one = 1;
                    }
                    const url = getReportHref(params);
                    window.open(url, '_blank');
                    try {
                        // 日志记录
                        const detail = `${user.displayName + user.account} 打印了收据,交易号为 ${exchangeIdStr}`;
                        console.log('opLog detail', detail);
                        // TODO user还没准备好
                        /* opLog({
                            key_name: 'rental_receipt_print',
                            desc: '收据打印',
                            detail
                        }) */
                    } catch (e) {
                        // console.log(e)
                    }
                } else {
                    message.error('未设置打印模板');
                }
                break;
        }
    };
    return (
        <div className="outlay-operate-bar">
            <span className="text">
                已选中<strong>{selectedRows.length}</strong>项
            </span>
            <Divider type="vertical" className="divider"></Divider>
            <Button className="clear-btn" type="link" onClick={handleClear}>
                清空
            </Button>
            <Button
                className="f-hidden rental-receipt-add-receipt"
                disabled={!isBatchReceiptEnabled}
                onClick={() => handleClick(OperateType.combinedReceipt)}
            >
                合并开收据
            </Button>
            {!canApplyInvoice && (
                <Button
                    className="f-hidden rental-receipt-add"
                    disabled={!isInvoiceEnabled}
                    onClick={() => handleClick(OperateType.combinedInvoice)}
                >
                    合并开发票
                </Button>
            )}
            {canApplyInvoice && (
                <Button
                    className="rental-receipt-add-apply"
                    disabled={!isInvoiceEnabled}
                    onClick={() => handleClick(OperateType.combinedApplyInvoice)}
                >
                    合并申请开票
                </Button>
            )}
            <Button disabled={!isPrintEnabled} onClick={() => handleClick(OperateType.batchCombinedPrint)}>
                批量合并打印
            </Button>
            <Button disabled={!isPrintEnabled} onClick={() => handleClick(OperateType.batchLineByLinePrint)}>
                批量逐条打印
            </Button>
        </div>
    );
}

export default OperateBar;
