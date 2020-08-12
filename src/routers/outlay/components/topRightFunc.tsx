import React from 'react';
import TreeProjectSelect from '@/components/TreeProjectSelect';
import { Divider, Menu, Dropdown, Button, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { MenuInfo} from 'rc-menu/lib/interface.d'
import { projsValue } from '@/types/project';
import './TopRightFunc.less';
import { TopRightFuncProps } from '../index.d';
import { opLog } from '@/services/app';
import { getReportHref } from '@/helper/commonUtils';

interface BillItem  {
    bill_item_id: string;
    amount: number;
}

const TopRightFunc = (props: TopRightFuncProps) => {

    const { extData: {canApplyInvoice, stageData, user}, selectedRows, selectedRowKeys, projIds } = props;
    // 是否能打印。所勾选的项是否收据都开具了
    const isPrintEnabled = selectedRows.length > 0 && selectedRows.every(item => {
        const { fee_items } = item;
        const hasReceipt = fee_items && fee_items.length > 0 && fee_items[0].receipt && fee_items[0].receipt.length > 0;
        return hasReceipt;
    });
    // 是否能开发票
    const isInvoiceEnabled = selectedRows.length > 0 && selectedRows.every(item => {
        return item.fee_items && item.fee_items.some(feeItem => {
            return feeItem.can_invoicing == 1;
        });
    });
    // 是否能开收据
    const isBatchReceiptEnabled = !(selectedRows.length === 0 || selectedRows.some(item => {
        const { fee_items, exchanged_amount } = item;
        const hasReceipt =
            fee_items && fee_items.length > 0 && fee_items[0].receipt && fee_items[0].receipt.length > 0;
        return  hasReceipt;
    }));

    const getBatchInvoiceItems = () =>  {
        let billItems: BillItem[] = [];
        const billItemsMap: any = {};
        selectedRows.forEach(item => {
            const { fee_items } = item;
            billItems = billItems.concat(fee_items.map(innerItem => {
                return {
                    bill_item_id: innerItem.bill_item_id,
                    amount: innerItem.available_invoicing_amount * 1
                }
            }));
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
            return billItemsMap[itemId]
        });
        return billItems;
    }

    const handleBatchMenuClick = (param: MenuInfo) => {
        const { key } = param;
        const stageId = selectedRows[0].proj_id;
        if(!stageId) {
            return;
        }
        if(key === '1') { // 合并开收据
            window.location.href = `/fed/receipt/invoice?exchange_ids=${selectedRowKeys.join(',')}&stage_id=${stageId}`
        } else if(key === '2') { // 合并开发票
            const billItems = getBatchInvoiceItems();
            location.href = `/fed/invoice/invoice?bill_items=${JSON.stringify(billItems)}&stage_id=${stageId}`;
        } else if(key === '3') { // 合并申请开票
            const billItems = getBatchInvoiceItems();
            location.href = `/fed/invoice/apply-invoice?bill_items=${JSON.stringify(billItems)}&stage_id=${stageId}`;
        }
        console.log(param);
    };

    const handlePrintMenuClick = (param: MenuInfo) => {
        console.log(param);
        const { key } = param;
        const projId = selectedRows[0].proj_id;
        const exchangeIds: string[] = [];
        //租客 id 集合
        const renterIds: string[] = [];
        selectedRows.forEach((item) => {
            exchangeIds.push(item.id);
            if (Object.hasOwnProperty.call(item, 'ext_renter')) {
                renterIds.push(item.ext_renter.id);
            }
        });
        const filterStageData = stageData.find(item => item.id === projId);
        if (filterStageData && Object.hasOwnProperty.call(filterStageData, 'print_template_id') && filterStageData.print_template_id !== '') {
            const printTemplateId = filterStageData.print_template_id;
            const exchangeIdStr = exchangeIds.map(ex => `'${ex}'`).join(',');
            const currRenterId = renterIds[0];
            const isPass = renterIds.every((item) => item === currRenterId);
            if (key === '1' && !isPass) {
                message.error('所选交易中，存在不同交易方，不允许打印收据！');
                return;
            }
            const params = {
                id: printTemplateId,
                exchange_ids: exchangeIdStr,
                is_print_one: 0
            }
            if (key === '2') {
                params.is_print_one = 1
            }
            const url = getReportHref(params);
            window.open(url, '_blank');
            try {
                // 日志记录
                const detail = `${user.displayName + user.account} 打印了收据,交易号为 ${exchangeIdStr}`;
                console.log("opLog detail", detail);
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
            message.error('未设置打印模板')
        }
    };

    const handleTreeSelected = (selectedProject: projsValue) => {
        props.onChange('project', selectedProject);
    };

    const batchMenu = (
        <Menu onClick={handleBatchMenuClick}>
            <Menu.Item key="1" disabled={!isBatchReceiptEnabled}>合并开收据</Menu.Item>
            {!canApplyInvoice && <Menu.Item key="2" disabled={!isInvoiceEnabled}>合并开发票</Menu.Item>}
            {canApplyInvoice && <Menu.Item key="3" disabled={!isInvoiceEnabled}>合并申请开票</Menu.Item>}
        </Menu>
    );

    const printMenu = (
        <Menu onClick={handlePrintMenuClick}>
            <Menu.Item key="1" disabled={!isPrintEnabled}>批量打印</Menu.Item>
            <Menu.Item key="2" disabled={!isPrintEnabled}>逐一打印</Menu.Item>
        </Menu>
    );

    return (
        <div data-component="outlay-topRightFunc">
            <TreeProjectSelect onTreeSelected={handleTreeSelected} width={244}></TreeProjectSelect>
            <Divider type="vertical" style={{ height: '28px', margin: '0 16px' }}></Divider>
            <Dropdown overlay={batchMenu}>
                <Button type="primary">
                    批量操作 <DownOutlined />
                </Button>
            </Dropdown>
            <Dropdown overlay={printMenu}>
                <Button>
                    打印数据 <DownOutlined />
                </Button>
            </Dropdown>
        </div>
    );
};

export default TopRightFunc;
