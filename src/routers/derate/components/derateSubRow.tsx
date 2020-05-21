import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Table, message, Input } from 'antd';
import { ColumnProps } from 'antd/es/table';
import FedButton from '@c/FedButton';
import FedSection from '@c/FedSection';
import Uploader from '@c/Uploader';
import { getDerateDetail } from '@s/derate';
import InputWithCount from './InputWithCount';
import { formatNum, comma } from '@/helper/commonUtils';
import { derateType, feeItem } from '../list.d';
import './derateSubRow.less';

interface derateSubRowProps {
    record: derateType;
}

type status = '' | 'success' | 'warning' | 'error' | 'validating';

interface feeItemType {
    renter_organization_name: string;
    contract_code?: string;
    room_name: string;
    full_room_name: string;
    derated_amount: number | string;
    tempDerateAmount: number | string;
    demurrage_derated_amount: number;
    stayDemurrageAmount: number;
    stay_demurrage_amount: number;
    stay_amount: number;
    stayAmount: number;
    renter_name: string;
    start_date: string;
    end_date: string;
    amount: string;
    rowSpan?: number;
    validateStatus?: status;
    isDemurrage: boolean;
}

interface derateDetail {
    items: feeItemType[];
    proj_name: string;
    remark: string;
    attachment: any[];
}

interface derateDetailType {}

const layout = {
    labelCol: {
        style: {
            width: '96px',
        },
    },
    wrapperCol: { span: 20 },
};

export const DerateSubRow = (props: derateSubRowProps) => {
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
    const [selectedRows, setSelectedRows] = useState<any>([]);
    const [detail, setDetail] = useState<derateDetail>({
        items: [],
        proj_name: '',
        remark: '',
        attachment: [],
    }); // 减免详情
    const [isEditMode, setIsEditMode] = useState(false); // 是否编辑模式

    useEffect(() => {
        const id = props.record.id;
        if (!id) {
            return;
        }
        getDerateDetail({ id }).then(res => {
            if (!res.result) {
                message.error(res.msg || '获取失败');
                return;
            }
            const { data = { items: [] } } = res;
            const roomsMap: { [index: string]: feeItemType[] } = {};
            data.copyItems = [];
            data.items.forEach((item: feeItemType) => {
                const copyItem = {
                    isDemurrage: false,
                    ...item,
                };
                const copyDemurrageItem = {
                    isDemurrage: true,
                    ...item,
                };
                if (!roomsMap[item.room_name]) {
                    roomsMap[item.room_name] = [];
                }
                if ((copyItem.stayAmount || 0) * 1 > 0) {
                    roomsMap[item.room_name].push(copyItem);
                }
                if ((copyItem.stayDemurrageAmount || 0) * 1 > 0) {
                    roomsMap[item.room_name].push(copyDemurrageItem);
                }
                if (Array.isArray(copyItem.full_room_name)) {
                    copyItem.full_room_name = copyItem.full_room_name.join('、');
                }
                if (Array.isArray(copyDemurrageItem.full_room_name)) {
                    copyDemurrageItem.full_room_name = copyDemurrageItem.full_room_name.join('、');
                }
                copyItem.renter_name = copyItem.renter_organization_name;
                copyDemurrageItem.renter_name = copyDemurrageItem.renter_organization_name;
                if ((copyItem.stayAmount || 0) * 1 > 0) {
                    data.copyItems.push(copyItem);
                }
                if ((copyItem.stayDemurrageAmount || 0) * 1 > 0) {
                    data.copyItems.push(copyDemurrageItem);
                }
            });
            data.items = data.copyItems;
            const roomNames: string[] = Object.keys(roomsMap);
            roomNames.forEach(roomName => {
                const len = roomsMap[roomName].length;
                for (let j = 0; j < len; j++) {
                    if (j === 0) {
                        roomsMap[roomName][j].rowSpan = len;
                    } else {
                        roomsMap[roomName][j].rowSpan = 0;
                    }
                }
            });
            setDetail(data);
        });
    }, [props.record.id]);

    const handleCancelEdit = () => {
        setIsEditMode(false);
    };

    const handleRemarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const remark = e.target.value;
        setDetail({
            ...detail,
            remark: remark,
        });
    };

    const handleDerateAmountChange = (record: feeItemType) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            console.log(e);
            let value: any = e.target.value || '';
            value = value.replace(/[^0-9\.]/g, '');
            value = value.replace(/(\d*\.\d{1,2})(.*)/, '$1');
            if (value * 100 - (record.stayAmount || 0) * 100 > 0) {
                record.validateStatus = 'error';
            } else {
                record.validateStatus = '';
            }
            record.derated_amount = value;
            setDetail({
                ...detail,
            });
        };
    };

    const basicInfoForms = [
        {
            name: '租客',
            field: 'renter_organization_name',
            required: true,
            value: (detail: derateDetail) => {
                let renterOrganizationNames = detail.items.map(bill => bill.renter_organization_name);
                renterOrganizationNames = [...new Set(renterOrganizationNames)];
                return renterOrganizationNames.join(',');
            },
        },
        {
            name: '合同编号',
            field: 'contract_code',
            required: true,
            value: (detail: derateDetail) => {
                return (detail.items && detail.items[0] && detail.items[0].contract_code) || '';
            },
        },
        {
            name: '项目名称',
            field: 'proj_name',
            required: false,
            value: (detail: derateDetail) => {
                return detail['proj_name'];
            },
        },
        {
            name: '品牌',
            field: 'renter_organization_name',
            required: false,
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: any, selectedRows: any[]) => {
            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows);
        },
    };

    const columns: ColumnProps<feeItemType>[] = [
        {
            dataIndex: 'room_name',
            title: '资源',
            width: 192,
            render: (text: string, record: feeItemType, index: number) => {
                const tempObj = {
                    children: record.full_room_name,
                    props: {
                        rowSpan: record.rowSpan,
                    },
                };
                return tempObj;
            },
        },
        {
            dataIndex: 'fee_name',
            title: '费项',
            width: 137,
            render: (text: string, record: feeItemType, index: number) => {
                return record.isDemurrage ? '滞纳金' : text;
            },
        },
        {
            dataIndex: 'start_date',
            title: '账期',
            width: 224,
            render: (text: string, record: feeItemType, index: number) => {
                return `${record.start_date} 至 ${record.end_date}`;
            },
        },
        {
            dataIndex: 'amount',
            title: '应收金额',
            width: 120,
            align: 'right',
            render: (text: string, record: feeItemType, index: number) => {
                return record.isDemurrage
                    ? comma(formatNum(+record.stayDemurrageAmount || '0.00'))
                    : comma(formatNum(+record.amount || '0.00'));
            },
        },
        {
            dataIndex: 'amount',
            title: '可减免金额',
            width: 120,
            align: 'right',
            render: (text: string, record: feeItemType, index: number) => {
                return record.isDemurrage
                    ? comma(formatNum(+record.stayDemurrageAmount || '0.00'))
                    : comma(formatNum(+record.stayAmount || '0.00'));
            },
        },
        {
            dataIndex: 'derate',
            title: '减免金额',
            width: 120,
            align: 'right',
            render: (text: string, record: feeItemType, index: number) => {
                const deratedAmount = record.isDemurrage
                    ? comma(formatNum(record.demurrage_derated_amount || '0.00'))
                    : comma(formatNum(record.derated_amount || '0.00'));
                const deratedFormItem = record.isDemurrage ? (
                    <Form.Item validateStatus={record.validateStatus}>
                        <Input disabled value={record.demurrage_derated_amount} />
                    </Form.Item>
                ) : (
                    <Form.Item validateStatus={record.validateStatus}>
                        <Input onChange={handleDerateAmountChange(record)} value={record.derated_amount} />
                    </Form.Item>
                );
                return !isEditMode ? deratedAmount : deratedFormItem;
            },
        },
    ];
    // 合计减免
    const totalDeratedAmount = detail.items.reduce((total: number, item) => {
        total =
            total + (!item.isDemurrage ? (+item.derated_amount || 0) * 1 : (item.demurrage_derated_amount || 0) * 1);
        console.log(total);
        return total;
    }, 0);

    return (
        <div className="derate-detail">
            <div className="head-area">
                <span className="title">减免详情</span>
                <div className="op-btns">
                    {isEditMode ? (
                        <>
                            <FedButton type="primary" size="small" ghost>
                                保存
                            </FedButton>
                            <FedButton size="small" onClick={handleCancelEdit}>
                                取消
                            </FedButton>
                        </>
                    ) : (
                        <FedButton size="small" onClick={() => setIsEditMode(true)}>
                            编辑
                        </FedButton>
                    )}
                </div>
            </div>
            <div className="content-area">
                <FedSection title="基本信息" key="基本信息">
                    <Form {...layout} form={form} name="advanced_search" className="ant-advanced-search-form">
                        <Row gutter={24}>
                            {basicInfoForms.map((formItem, i) => {
                                return (
                                    <Col span={8} key={i} className="derate-detail-form-item">
                                        <Form.Item
                                            name={formItem.field}
                                            label={formItem.name}
                                            rules={[
                                                {
                                                    required: formItem.required,
                                                },
                                            ]}
                                        >
                                            {formItem.value ? formItem.value(detail) : '-'}
                                        </Form.Item>
                                    </Col>
                                );
                            })}
                            <Col span={16} key={5}>
                                <Form.Item
                                    name="remark"
                                    label="减免原因"
                                    rules={[
                                        {
                                            required: false,
                                        },
                                    ]}
                                >
                                    {isEditMode ? (
                                        <InputWithCount
                                            defaultValue={detail.remark}
                                            placeholder="请输入"
                                            maxLength={255}
                                            // onChange={handleRemarkChange}
                                        />
                                    ) : (
                                        detail.remark || '-'
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </FedSection>
                <FedSection title="减免明细" key="减免明细">
                    <>
                        <Table
                            rowSelection={rowSelection}
                            pagination={false}
                            columns={columns}
                            dataSource={detail.items}
                        />
                        <div className="total-bar">
                            <span>本次合计减免：</span>
                            <span>{comma(formatNum(totalDeratedAmount))}</span>
                        </div>
                    </>
                </FedSection>
                <FedSection title="减免附件" key="减免附件">
                    <Uploader
                        files={detail.attachment}
                        onChange={() => {}}
                        // description="注：单个附件最大支持10M，支持jpg/gif/png/pdf格式，已上传1/15"
                    />
                </FedSection>
            </div>
        </div>
    );
};

export default DerateSubRow;
