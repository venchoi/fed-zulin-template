import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Table, message } from 'antd';
import { ColumnProps } from 'antd/es/table';
import FedButton from '@c/FedButton';
import FedSection from '@c/FedSection';
import { getDerateDetail } from '@s/derate';
import InputWithCount from './InputWithCount';
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
}

interface derateDetail {
    items: feeItemType[];
    proj_name: string;
    remark: string;
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
            data.rooms = {};
            data.items.forEach((item: feeItemType) => {
                if (data.rooms[item.room_name]) {
                    data.rooms[item.room_name].push(item);
                } else {
                    data.rooms[item.room_name] = [item];
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
            required: false,
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
    const columns: ColumnProps<feeItem>[] = [
        {
            dataIndex: 'code',
            title: '资源',
            width: 168,
            render: (text: string, record: feeItem, index: number) => {
                return {};
            },
        },
        // {
        //     dataIndex: 'proj_name',
        //     title: '项目名称',
        //     width: 120,
        //     render: (text: string, record: derateDetailType, index: number) => {
        //         return <>{text || '-'}</>;
        //     },
        // },
        // {
        //     dataIndex: 'renter_organization_names',
        //     title: '租客',
        //     width: 136,
        //     render: (text: string, record: derateDetailType, index: number) => {
        //         let renterOrganizationNames = record.items.map(bill => bill.renter_organization_name);
        //         renterOrganizationNames = [...new Set(renterOrganizationNames)];
        //         return renterOrganizationNames.join(',');
        //     },
        // },
        // {
        //     dataIndex: 'items',
        //     title: '资源',
        //     width: 144,
        //     render: (text: string, record: derateDetailType, index: number) => {
        //         const items = record.items;
        //         const resource = items.length > 0 ? items[0].full_room_name : '';
        //         return <>{resource || '-'}</>;
        //     },
        // },
        // {
        //     dataIndex: 'created_on',
        //     title: '申请日期',
        //     width: 112,
        //     render: (text: string, record: derateDetailType, index: number) => {
        //         const createdOn = record.created_on && record.created_on.replace(/(.*)\s.*/, '$1');
        //         return <>{createdOn || '-'}</>;
        //     },
        // },
        // {
        //     dataIndex: 'fee_item',
        //     title: '减免费项',
        //     width: 112,
        //     render: (text: string, record: derateDetailType, index: number) => {
        //         let feeName: any = Array.from(new Set(record.items.map(bill => bill.fee_name)));
        //         feeName = feeName.join(',');
        //         return <>{feeName || '-'}</>;
        //     },
        // }
    ];
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
                                            required: true,
                                        },
                                    ]}
                                >
                                    {isEditMode ? (
                                        <InputWithCount placeholder="请输入" maxLength={255} />
                                    ) : (
                                        detail.remark || '-'
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </FedSection>
                <FedSection title="减免明细" key="减免明细">
                    <Table columns={columns} />
                </FedSection>
                <FedSection title="减免附件" key="减免附件">
                    <span>3</span>
                </FedSection>
            </div>
        </div>
    );
};

export default DerateSubRow;
