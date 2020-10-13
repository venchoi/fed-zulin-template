import React, { useState, useEffect } from 'react';
import FedPagination from '@/components/FedPagination';

import { ColumnProps } from 'antd/lib/table';
import { Popover, Dropdown, Button, Checkbox, Tooltip } from 'antd';
import { ExclamationCircleOutlined, SettingOutlined } from '@ant-design/icons';
import config from '@/config';

import './OutlayTable.less';
import { throttle, cloneDeep, hasIn } from 'lodash';
import { ResizeTable, DragSelect } from 'ykj-ui';
import { IField } from '@/types/common';
import { comma } from '@/helper/commonUtils';
import { StatisticData, OutLayListItem, FeeItem, ExtPayment } from '../type';
import ReceiptTag from '@/components/ReceiptTag';
import InvoiceTag from '@/components/InvoiceTag';
import { Link } from 'dva/router';
import { isOutlayListRecordCanChecked } from '../provider';
import RenderRentalResourcePopover from './RenderRentalResourcePopover';

interface OutLayTableProps {
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
    isTableLoading: boolean;
}

const OutLayTable = (props: OutLayTableProps) => {
    const {
        outlayList,
        onTableSelect,
        extData: { statisticData, canApplyInvoice },
        selectedRowKeys,
        selectedRows,
        isTableLoading,
    } = props;
    const total = (parseFloat(statisticData.income || '0') + parseFloat(statisticData.refund || '0')).toFixed(2);
    const income = parseFloat(statisticData.income || '0').toFixed(2);
    const refund = parseFloat(statisticData.refund || '0').toFixed(2);
    const [columns, setColumns] = useState<any>([]);
    const [visible, setVisible] = useState(false); // 列配置的弹窗显示/隐藏
    const [fields, setFields] = useState<any>([]);
    const [rowSelection, setRowSelection] = useState({});

    // canApplyInvoice会影响columns的展示
    useEffect(() => {
        const tempColumn = getColumns();
        setColumns(cloneDeep(tempColumn));
        // 去掉左右固定的列
        tempColumn.shift();
        tempColumn.pop();
        setFields(
            tempColumn.map((col, index) => ({
                field: col.dataIndex,
                is_default: true,
                key: `${index}`,
                name: col.title,
                selected: true,
            }))
        );
    }, [canApplyInvoice]);

    // 点击了复选框需要做数据双向绑定
    useEffect(() => {
        const tempRowSelection = getRowSelection();
        setRowSelection(tempRowSelection);
    }, [props]);

    const onHandleResize = throttle((index: number, size: { width: number; height: number }) => {
        const nextColumns = cloneDeep(columns);
        nextColumns[index].width = size.width;
        setColumns(nextColumns);
    }, 100);

    // 渲染可配置列弹框
    const renderExtraNode = () => {
        // 确定点击事件
        const onFinish = (resultArr: any) => {
            setVisible(false);
            // 为了保留已设置的值和使用原始全数据，跟原数据diff
            const tempColumns = getColumns().map(item => {
                const index = columns.findIndex((col: ColumnProps<OutLayListItem>) => col.dataIndex === item.dataIndex);
                if (index === -1) {
                    return item;
                } else {
                    return columns[index];
                }
            });
            const sortColumns = resultArr.map((fieldItem: IField) => tempColumns[+fieldItem.key + 1]); // 由于左边去掉一列补上
            const selectedColumns = sortColumns.filter((item: ColumnProps<OutLayListItem>) =>
                resultArr.some((fieldItem: IField) => fieldItem.field === item.dataIndex && fieldItem.selected)
            );
            // 加上左右固定的列
            selectedColumns.unshift(tempColumns[0]);
            selectedColumns.push(tempColumns[tempColumns.length - 1]);
            setColumns(selectedColumns);
        };
        // 取消点击事件
        const onCancel = () => {
            setVisible(false);
        };
        // 配置列数据 如果layoutData返回值为空时，默认使用fieldData数据
        return <DragSelect options={fields} onFinish={onFinish} onCancel={onCancel} />;
    };

    const handleVisibleChange = (val: boolean) => {
        setVisible(val);
    };

    /**
     * 开发票/申请开发票
     * @param record
     * @param isApply 是否是申请开票
     */
    const handleOpenInvoice = (record: OutLayListItem, isApply?: boolean) => {
        const { fee_items, proj_id } = record;
        let billItems: any = [];
        billItems = billItems.concat(
            fee_items.map(innerItem => {
                return {
                    bill_item_id: innerItem.bill_item_id,
                    amount: innerItem.available_invoicing_amount,
                };
            })
        );
        const hrefName = isApply ? 'apply-invoice' : 'invoice';
        location.href = `/fed/invoice/${hrefName}?bill_items=${JSON.stringify(billItems)}&stage_id=${proj_id}`;
    };

    const handleClickCheckbox = (checked: boolean, key: string) => {
        let tempSelectedRowsKey = cloneDeep(selectedRowKeys);
        let tempSelectedRows = cloneDeep(selectedRows);
        if (checked) {
            tempSelectedRowsKey.push(key);
            tempSelectedRows.push(outlayList.find(item => item.id === key));
        } else {
            tempSelectedRowsKey.splice(
                tempSelectedRowsKey.findIndex(value => value === key),
                1
            );
            tempSelectedRows.splice(tempSelectedRows.findIndex(item => item.id === key));
        }
        onTableSelect && onTableSelect(tempSelectedRowsKey, tempSelectedRows);
    };

    const getColumns = (): ColumnProps<OutLayListItem>[] => [
        {
            dataIndex: 'code',
            title: '交易号',
            width: 249,
            fixed: 'left',
            render: (code: string, record: OutLayListItem, index: number) => {
                const { exchanged_on, id, fee_items = [] } = record;
                let exChangeDate = '-';
                let isReceipted = fee_items[0]?.receipt?.length > 0; // 是否已经开了票据
                let isInvoiced = fee_items[0]?.invoice?.length > 0; // 是否已经开了发票
                if (exchanged_on) {
                    const arr = exchanged_on.split(' ');
                    if (arr && arr.length >= 0) {
                        exChangeDate = arr[0];
                    }
                }
                return (
                    <div>
                        <Link to={`/outlay/detail/${id}`}>{code}</Link>
                        {isReceipted && <ReceiptTag data={record.fee_items[0]?.receipt} />}
                        {isInvoiced && <InvoiceTag data={record.fee_items[0]?.invoice}></InvoiceTag>}
                    </div>
                );
            },
        },
        {
            dataIndex: 'proj_name',
            title: '项目名称',
            width: 160,
            ellipsis: true,
            render: (text: string) => {
                return <span title={text}>{text || '-'}</span>;
            },
        },
        {
            dataIndex: 'exchanged_to_name',
            title: '交易对方',
            width: 140,
            ellipsis: true,
            render: (exchanged_to_name: string, record: OutLayListItem, index: number) => {
                const {
                    ext_renter: { name, type, organization_name },
                    ext_contract,
                    payment_mode,
                    proj_name,
                } = record;
                const rentalName = type === '个人' ? name : organization_name;
                const isShowPopover = ext_contract && rentalName && payment_mode !== '预存结转';
                return <span title={exchanged_to_name}>{exchanged_to_name || '-'}</span>;
            },
        },
        {
            dataIndex: 'rental_resource',
            title: '租赁资源',
            width: 200,
            ellipsis: true,
            render: (title, record: OutLayListItem, index: number) => {
                const roomPackageName = record.fee_items[0]?.package_name;
                const roomName = record.fee_items[0]?.full_room_name;
                return (
                    <span title={roomPackageName || roomName}>
                        <span>{roomPackageName || roomName || '-'}</span>
                        {roomPackageName && (
                            <Popover
                                trigger="hover"
                                placement="bottom"
                                className="popover"
                                overlayClassName="rental-resource-popover"
                                title={roomPackageName}
                                content={<RenderRentalResourcePopover record={record} />}
                            >
                                <ExclamationCircleOutlined style={{ color: '#BEC3C7' }} />
                            </Popover>
                        )}
                    </span>
                );
            },
        },
        {
            dataIndex: 'fee_items',
            title: '费项',
            width: 120,
            ellipsis: true,
            render: (fee_items: FeeItem[], record: OutLayListItem, index: number) => {
                let feeItemName = '';
                if (Array.isArray(fee_items)) {
                    feeItemName = fee_items.map(fee => fee.fee_name).join();
                }
                return <span title={feeItemName}>{feeItemName || '-'}</span>;
            },
        },
        {
            dataIndex: 'lessor_name',
            title: '甲方名称',
            width: 140,
            ellipsis: true,
            render: (text: string) => {
                return <span title={text}>{text || '-'}</span>;
            },
        },
        {
            dataIndex: 'lessor_account_name',
            title: '收款账号',
            width: 200,
            ellipsis: true,
            render: (text: string) => {
                return <span title={text}>{text || '-'}</span>;
            },
        },
        {
            dataIndex: 'total_amount',
            title: '交易总额(元)',
            width: 140,
            align: 'right',
            render: (text: string, record: OutLayListItem) => {
                const { ext_payment } = record;
                let amount = '-';
                let operator = '';
                if (Array.isArray(ext_payment)) {
                    ext_payment.forEach(item => {
                        amount = item.amount;
                    });
                }
                if (+amount > 0) {
                    operator = '+';
                }
                return (
                    <span>
                        {operator}
                        {comma(amount)}
                    </span>
                );
            },
        },
        {
            dataIndex: 'ext_payment',
            title: '收入(元)',
            width: 140,
            align: 'right',
            render: (ext_payment: ExtPayment[], record: OutLayListItem, index: number) => {
                let inPay = '-';
                if (Array.isArray(ext_payment)) {
                    ext_payment.forEach(item => {
                        if (+item.amount >= 0) {
                            inPay = item.amount;
                        }
                    });
                }

                return <span>{comma(inPay)}</span>;
            },
        },
        {
            dataIndex: 'ext_payment_out',
            title: '支出(元)',
            width: 140,
            align: 'right',
            render: (value: ExtPayment[], record: OutLayListItem, index: number) => {
                const ext_payment = record.ext_payment;
                let outPay = '-';
                if (Array.isArray(ext_payment)) {
                    ext_payment.forEach(item => {
                        if (+item.amount <= 0) {
                            outPay = item.amount;
                        }
                    });
                }

                return <span>{comma(outPay)}</span>;
            },
        },
        {
            dataIndex: 'fee_items_fee',
            title: '手续费(元)',
            width: 140,
            align: 'right',
            render: (value: ExtPayment[], record: OutLayListItem, index: number) => {
                const { fee_items } = record;
                let fee = '-';
                if (Array.isArray(fee_items)) {
                    fee_items.forEach(item => {
                        fee = item.fee;
                    });
                }
                return <span>{comma(fee)}</span>;
            },
        },
        {
            dataIndex: 'exchanged_on',
            title: '交易日期',
            width: 160,
            render: (exchanged_on: string) => {
                let exChangeDate = '-';
                if (exchanged_on) {
                    const arr = exchanged_on.split(' ');
                    if (arr && arr.length >= 0) {
                        exChangeDate = arr[0];
                    }
                }
                return <span>{exChangeDate || '-'}</span>;
            },
        },
        {
            dataIndex: 'payment_time',
            title: '支付日期',
            width: 160,
            render: (text: string) => {
                return <span>{text || '-'}</span>;
            },
        },
        {
            dataIndex: 'payment_mode',
            title: '支付方式',
            width: 140,
            ellipsis: true,
            render: (text: string, record: OutLayListItem) => {
                let result = `${text}${record.system_remark ? `(${record.system_remark})` : ''}`;
                return <span title={result}>{result || '-'}</span>;
            },
        },
        {
            dataIndex: 'operate',
            title: '操作',
            width: 148,
            fixed: 'right',
            render: (text: string, record: OutLayListItem, index: number) => {
                const { id, fee_items = [], proj_id, exchanged_amount } = record;
                const canReceipt = fee_items[0]?.can_receipt === 1; // 是否可以开收据
                const canInvoice = fee_items[0]?.can_invoicing === 1; // 是否可以开发票
                const isRefund = exchanged_amount < 0;
                return (
                    <span>
                        {!isRefund && canReceipt && (
                            <a
                                className="operate-btn f-hidden rental-receipt-add-receipt"
                                href={`/fed/receipt/invoice?exchange_ids=${id}&stage_id=${proj_id}`}
                            >
                                开收据
                            </a>
                        )}
                        {!canApplyInvoice && canInvoice && (
                            <a
                                className="operate-btn f-hidden rental-receipt-add"
                                onClick={() => handleOpenInvoice(record)}
                            >
                                开发票
                            </a>
                        )}
                        {canApplyInvoice && canInvoice && (
                            <a
                                className="operate-btn f-hidden rental-receipt-add-apply"
                                onClick={() => handleOpenInvoice(record, true)}
                            >
                                申请开票
                            </a>
                        )}
                    </span>
                );
            },
        },
    ];

    const getRowSelection = () => ({
        hideSelectAll: true,
        columnWidth: '48px',
        renderCell: (checked: boolean, record: OutLayListItem, index: number, originNode: any) => {
            const { id, exchanged_amount, proj_id, fee_items } = record;
            const isChecked = selectedRowKeys.includes(id); // 数据双向绑定，用于清空
            let selectedStageId;
            if (selectedRows.length > 0) {
                selectedStageId = selectedRows[0].proj_id;
            }
            const isRefund = exchanged_amount < 0;
            const canChecked = isOutlayListRecordCanChecked(record, selectedRows);
            const disabled = (selectedStageId && proj_id !== selectedStageId) || !canChecked;

            // 1)退款或者，2)跟已选择的不属于同一个项目或者，3)根据已选的开发票、开收据状态
            if (isRefund || disabled) {
                return (
                    <Tooltip title="无相关操作，不可选中" align={{ offset: [0, 4] }}>
                        <Checkbox disabled={true} onChange={e => handleClickCheckbox(e.target.checked, id)}></Checkbox>
                    </Tooltip>
                );
            } else {
                return (
                    <Checkbox onChange={e => handleClickCheckbox(e.target.checked, id)} checked={isChecked}></Checkbox>
                );
            }
        },
    });

    return (
        <div data-component="outlay-table">
            <div className="field-setting-btn">
                <Tooltip title="列设置">
                    <Dropdown
                        placement="bottomRight"
                        visible={visible}
                        onVisibleChange={handleVisibleChange}
                        overlay={renderExtraNode}
                        trigger={['click']}
                    >
                        <Button className="btn-setting" icon={<SettingOutlined />} />
                    </Dropdown>
                </Tooltip>
            </div>
            <ResizeTable
                rowKey="id"
                align="left"
                size="small"
                bordered
                columns={columns}
                dataSource={outlayList}
                scroll={{ y: selectedRowKeys.length > 0 ? 'calc( 100vh - 458px )' : 'calc( 100vh - 410px )' }}
                loading={isTableLoading}
                onHandleResize={onHandleResize}
                pagination={false}
                rowSelection={rowSelection}
            />

            <div className="total">
                收入(元)：{income}&emsp;支出(元)：{refund}&emsp;总计(元)：{total}&emsp;
            </div>
            <FedPagination
                onShowSizeChange={(current, page_size) => {
                    props.onPageSizeChange(page_size);
                }}
                onChange={(page_index, page_size) => {
                    props.onPageChange(page_index, page_size);
                }}
                current={props.page}
                pageSize={props.pageSize}
                showTotal={total => `共${Math.ceil(+total / +(props.pageSize || 1))}页， ${total}条记录`}
                total={+props.outlayListTotal}
            />
        </div>
    );
};

export default OutLayTable;