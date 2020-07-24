import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Select, message, Row, Col } from 'antd';
import { getIdCardList, postAddAssetHolder, getManageList } from '@/services/assetHolder';
import { IAddAssetHolder, IAddAssetHolderBank } from '@t/assetHolder';
import { customType } from '../../../constants/index';
import TreeProjectSelect from '@c/TreeProjectSelect';
import './addBaseForm.less';

interface IProps {
    id?: string;
    onOk?: (object: IAddAssetHolderBank) => void;
}
interface IIdCardTypeList {
    id: string;
    value: string;
}
interface IManagerList {
    id: string;
    name: string;
}
const { Option } = Select;
const AddBaseForm = ({ id, onOk }: IProps) => {
    const [idCardTypeList, setIdCardTypeList] = useState<IIdCardTypeList[]>([]);
    const [managerList, setManagerList] = useState<IManagerList[]>([]);
    const fetchIdCardDetail = async () => {
        const { data } = await getIdCardList({ code: 'IdType' });
        const result = data || [];
        setIdCardTypeList(result);
    };
    const fetchManagerList = async () => {
        const { data } = await getManageList();
        const result = data || [];
        setManagerList(result);
    };
    useEffect(() => {
        fetchIdCardDetail().then();
        fetchManagerList().then();
    }, []);
    const num = id ? 5 : 24;
    const spanNum = id ? 24 : 6;
    return (
        <>
            <div className={id ? 'edit add-base-form-wrap' : 'add-base-form-wrap'}>
                <Row>
                    <Col span={spanNum}>
                        <Form.Item
                            name="name"
                            label="持有人名称"
                            labelCol={{ span: num }}
                            labelAlign="right"
                            className="form-item-left"
                            rules={[{ required: true, whitespace: true, message: '请输入持有人名称!' }]}
                        >
                            <Input placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={spanNum}>
                        <Form.Item
                            name="short_name"
                            label="持有人简称"
                            labelCol={{ span: num }}
                            labelAlign="right"
                            className="form-item-center"
                            rules={[{ required: false, whitespace: true }]}
                        >
                            <Input placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={spanNum}>
                        <Form.Item
                            name="english_name"
                            label="英文名称"
                            labelCol={{ span: num }}
                            labelAlign="right"
                            className="form-item-center"
                            rules={[{ required: false, whitespace: true }]}
                        >
                            <Input placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={spanNum}>
                        <Form.Item
                            name="english_short_name"
                            label="英文简称"
                            labelCol={{ span: num }}
                            labelAlign="right"
                            className="form-item-right"
                            rules={[{ required: false, whitespace: true }]}
                        >
                            <Input placeholder="请输入" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={spanNum}>
                        <Form.Item
                            name="type"
                            label="客户类型"
                            labelCol={{ span: num }}
                            labelAlign="right"
                            className="form-item-left"
                            rules={[{ required: true, whitespace: true }]}
                        >
                            <Select placeholder="请选择">
                                {customType.map(cType => (
                                    <Option value={cType.value} key={cType.value}>
                                        {cType.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={spanNum}>
                        <Form.Item
                            name="project_id"
                            label="关联项目"
                            labelCol={{ span: num }}
                            labelAlign="right"
                            className="form-item-center"
                            rules={[{ required: true, whitespace: true, message: '请选择关联项目!' }]}
                        >
                            <TreeProjectSelect onTreeSelected={() => {}} width="100%" isJustSelect notInitSelect />
                        </Form.Item>
                    </Col>
                    <Col span={spanNum}>
                        <Form.Item
                            name="id_code_type"
                            label="证件类型"
                            labelCol={{ span: num }}
                            labelAlign="right"
                            className="form-item-center"
                            rules={[{ required: true, max: 100, whitespace: true, message: '请选择证件类型!' }]}
                        >
                            <Select placeholder="请选择">
                                {idCardTypeList.map(item => (
                                    <Option value={item.id} key={item.id}>
                                        {item.value}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={spanNum}>
                        <Form.Item
                            name="id_code"
                            label="证件号码"
                            labelCol={{ span: num }}
                            labelAlign="right"
                            className="form-item-right"
                            rules={[{ required: true, max: 20, whitespace: true, message: '请输入证件号码!' }]}
                        >
                            <Input placeholder="请输入" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={spanNum}>
                        <Form.Item
                            name="contacter"
                            label="联系人"
                            labelCol={{ span: num }}
                            labelAlign="right"
                            className="form-item-left"
                            rules={[{ required: true, max: 20, whitespace: true, message: '请输入联系人!' }]}
                        >
                            <Input placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={spanNum}>
                        <Form.Item
                            name="mobile"
                            label="电话号码"
                            labelCol={{ span: num }}
                            labelAlign="right"
                            className="form-item-center"
                            rules={[{ required: true, max: 20, whitespace: true, message: '请输入电话号码!' }]}
                        >
                            <Input placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={spanNum}>
                        <Form.Item
                            name="address"
                            label="联系地址"
                            labelCol={{ span: num }}
                            labelAlign="right"
                            className="form-item-center"
                            rules={[{ required: false, max: 20, whitespace: true }]}
                        >
                            <Input placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={spanNum}>
                        <Form.Item
                            name="manager"
                            label="负责人"
                            labelCol={{ span: num }}
                            labelAlign="right"
                            className="form-item-right"
                            rules={[{ required: true, whitespace: true, message: '请选择负责人!' }]}
                        >
                            <Select
                                showSearch
                                placeholder="请选择"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {managerList.map(user => (
                                    <Option key={user.id} value={user.id}>
                                        {user.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default AddBaseForm;
