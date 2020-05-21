import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Table, message } from 'antd';
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

interface feeItemType {
    renter_organization_name: string;
    contract_code?: string;
    room_name: string;
    full_room_name: string;
    derated_amount: number;
    tempDerateAmount: number;
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
            data.items.forEach((item: feeItemType) => {
                if (roomsMap[item.room_name]) {
                    roomsMap[item.room_name].push(item);
                } else {
                    roomsMap[item.room_name] = [item];
                }
                if (Array.isArray(item.full_room_name)) {
                    item.full_room_name = item.full_room_name.join('、');
                }
                item.tempDerateAmount = item.derated_amount;
                item.stay_demurrage_amount =
                    +item.demurrage_derated_amount > 0 ? item.demurrage_derated_amount : item.stayDemurrageAmount;
                item.stay_amount = item.stayAmount;
                item.renter_name = item.renter_organization_name;
            });
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
    const columns: ColumnProps<feeItemType>[] = [
        {
            dataIndex: 'room_name',
            title: '资源',
            width: 240,
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
            width: 144,
            render: (text: string, record: feeItemType, index: number) => {
                return text;
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
            render: (text: string, record: feeItemType, index: number) => {
                return comma(formatNum(+record.amount || '0.00'));
            },
        },
        {
            dataIndex: 'derate',
            title: '本金减免金额',
            width: 120,
            render: (text: string, record: feeItemType, index: number) => {
                return !isEditMode ? comma(formatNum(record.derated_amount || '0.00')) : null;
            },
        },
        {
            dataIndex: 'demurrageDerate',
            title: '滞纳金减免金额',
            width: 120,
            render: (text: string, record: feeItemType, index: number) => {
                return !isEditMode ? comma(formatNum(record.demurrage_derated_amount || '0.00')) : null;
            },
        },
        {
            dataIndex: 'totalDerate',
            title: '本次减免金额',
            width: 120,
            render: (text: string, record: feeItemType, index: number) => {
                const totalDeratedAmount =
                    +(record.derated_amount || 0) * 1 + (record.demurrage_derated_amount || 0) * 1;
                return comma(formatNum(totalDeratedAmount));
            },
        },
    ];
    if (isEditMode) {
        columns.push({
            dataIndex: 'op',
            title: '操作',
            width: 120,
            render: (text: string, record: feeItemType, index: number) => {
                return <FedButton type="link">删除</FedButton>;
            },
        });
    }
    // 合计减免
    const totalDeratedAmount = detail.items.reduce((total: number, item) => {
        total = total + (item.derated_amount || 0) * 1 + (item.demurrage_derated_amount || 0) * 1;
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
                                            value={detail.remark}
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
                        <Table pagination={false} columns={columns} dataSource={detail.items} />
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
                        description="注：单个附件最大支持10M，支持jpg/gif/png/pdf格式，已上传1/15"
                    />
                </FedSection>
            </div>
        </div>
    );
};

export default DerateSubRow;
