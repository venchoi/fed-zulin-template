import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input } from 'antd';
import FedButton from '@c/FedButton';
import FedSection from '@c/FedSection';
import InputWithCount from './InputWithCount';
import { derateType } from '../list.d';
import './derateSubRow.less';

interface derateSubRowProps {
    record: derateType;
}

interface derateDetail {
    [index: string]: string;
    renter_organization_name: string;
}

export const DerateSubRow = (props: derateSubRowProps) => {
    const [form] = Form.useForm();
    const [detail, setDetail] = useState<derateDetail>({
        renter_organization_name: '',
    }); // 减免详情
    const [isEditMode, setIsEditMode] = useState(false); // 是否编辑模式

    const handleCancelEdit = () => {
        setIsEditMode(false);
    };
    const basicInfoForms = [
        {
            name: '租客',
            field: 'renter_organization_name',
            required: true,
        },
        {
            name: '合同编号',
            field: 'contract_code',
            required: true,
        },
        {
            name: '项目名称',
            field: 'proj_name',
            required: true,
        },
        {
            name: '品牌',
            field: 'renter_organization_name',
            required: true,
        },
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
                    <Form form={form} name="advanced_search" className="ant-advanced-search-form">
                        <Row gutter={24}>
                            {basicInfoForms.map((formItem, i) => {
                                return (
                                    <Col span={8} key={i}>
                                        <Form.Item
                                            name={formItem.field}
                                            label={formItem.name}
                                            rules={[
                                                {
                                                    required: formItem.required,
                                                },
                                            ]}
                                        >
                                            {detail[formItem.field] || '-'}
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
                    <span>3</span>
                </FedSection>
                <FedSection title="减免附件" key="减免附件">
                    <span>3</span>
                </FedSection>
            </div>
        </div>
    );
};

export default DerateSubRow;
