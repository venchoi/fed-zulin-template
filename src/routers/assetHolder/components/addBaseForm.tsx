import React, { useState, useEffect } from 'react';
import { Form, Input, Radio, Select, DatePicker, Modal, message, Table, Button } from 'antd';
import { getIdCardList, postAddAssetHolder, postAddAssetHolderBank, getManageList } from '@/services/assetHolder';
import { IAddAssetHolder, IAddAssetHolderBank } from '@t/assetHolder';
import TreeProjectSelect from '@c/TreeProjectSelect';
import { projsValue } from '@t/project';
import './addBaseForm.less';

interface IProps {
    id?: string;
    onCancel: () => void;
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
const AddBaseForm = ({ id, onCancel, onOk }: IProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [idCardTypeList, setIdCardTypeList] = useState<IIdCardTypeList[]>([]);
    const [managerList, setManagerList] = useState<IManagerList[]>([]);
    const fetchIdCardDetail = async () => {
        setLoading(true);
        const { data } = await getIdCardList({ code: 'IdType' });
        const result = data || [];
        setIdCardTypeList(result);
    };
    const fetchManagerList = async () => {
        const { data } = await getManageList();
        setLoading(false);
        const result = data || [];
        setManagerList(result);
    };

    useEffect(() => {
        fetchIdCardDetail();
        fetchManagerList();
    }, []);

    const handleIdCodeTypeChange = (value: string) => {
        //form.setFieldsValue({ id_code_type: value });
    };
    const handleManagerChange = (value: string) => {
        // form.setFieldsValue({ manager: value });
    };
    const handleTreeSelected = (selecctedProject: projsValue) => {
        form.setFieldsValue({ project_id: selecctedProject.projIds.join(',') });
    };
    const num = 6;
    const title = id ? '编辑基本信息' : '新增基本信息';
    const handleSubmit = () => {
        form.validateFields().then(async values => {
            if (id) {
                // 编辑
                values.id = id;
                const { data, result, msg } = await postAddAssetHolder(values as IAddAssetHolder);
                if (result) {
                    if (onOk) {
                        onOk(data);
                    }
                    message.success('编辑成功');
                } else {
                    message.error(msg || '编辑失败');
                }
            } else {
                // 新增
                const { data, result, msg } = await postAddAssetHolder(values as IAddAssetHolder);
                if (result) {
                    if (onOk) {
                        onOk(data);
                    }
                    message.success('操作成功');
                } else {
                    message.error(msg || '操作成功');
                }
            }
        });
    };

    return (
        <>
            <Modal visible={true} width={480} title={title} centered onCancel={() => onCancel()} onOk={handleSubmit}>
                <div className="add-base-form-wrap">
                    <Form form={form}>
                        <Form.Item
                            name="name"
                            label="持有人名称"
                            labelCol={{ span: num }}
                            labelAlign="right"
                            rules={[{ required: true, whitespace: true, message: '请输入持有人名称!' }]}
                        >
                            <Input placeholder="请输入" />
                        </Form.Item>
                        <Form.Item
                            name="short_name"
                            label="持有人简称"
                            labelCol={{ span: num }}
                            labelAlign="right"
                            rules={[{ required: false, whitespace: true }]}
                        >
                            <Input placeholder="请输入" style={{ width: 104 }} />
                        </Form.Item>
                        <Form.Item
                            name="english_name"
                            label="英文名称"
                            labelCol={{ span: num }}
                            labelAlign="right"
                            rules={[{ required: false, whitespace: true }]}
                        >
                            <Input placeholder="请输入" />
                        </Form.Item>
                        <Form.Item
                            name="english_short_name"
                            label="英文简称"
                            labelCol={{ span: num }}
                            labelAlign="right"
                            rules={[{ required: false, whitespace: true }]}
                        >
                            <Input placeholder="请输入" style={{ width: 104 }} />
                        </Form.Item>
                        <Form.Item
                            name="type"
                            label="客户类型"
                            labelCol={{ span: num }}
                            labelAlign="right"
                            rules={[{ required: true, whitespace: true }]}
                        >
                            <Select placeholder="请选择">
                                <Option value="企业" key="企业">
                                    企业
                                </Option>
                                <Option value="工商个体" key="工商个体">
                                    工商个体
                                </Option>
                                <Option value="个人" key="个人">
                                    个人
                                </Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="project_id"
                            label="关联项目"
                            labelCol={{ span: num }}
                            labelAlign="right"
                            rules={[{ required: true, whitespace: true, message: '请选择关联项目!' }]}
                        >
                            <TreeProjectSelect
                                onTreeSelected={handleTreeSelected}
                                width={324}
                                isJustSelect
                                notInitSelect
                            />
                        </Form.Item>
                        <Form.Item
                            name="id_code_type"
                            label="证件类型"
                            labelCol={{ span: num }}
                            labelAlign="right"
                            rules={[{ required: true, max: 100, whitespace: true, message: '请选择证件类型!' }]}
                        >
                            <Select style={{ width: 240 }} placeholder="请选择">
                                {idCardTypeList.map(item => (
                                    <Option value={item.id} key={item.id}>
                                        {item.value}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="id_code"
                            label="证件号码"
                            labelCol={{ span: num }}
                            labelAlign="right"
                            rules={[{ required: true, max: 20, whitespace: true, message: '请输入证件号码!' }]}
                        >
                            <Input placeholder="请输入" />
                        </Form.Item>
                        <Form.Item
                            name="contacter"
                            label="联系人"
                            labelCol={{ span: num }}
                            labelAlign="right"
                            rules={[{ required: true, max: 20, whitespace: true, message: '请输入联系人!' }]}
                        >
                            <Input placeholder="请输入" style={{ width: 104 }} />
                        </Form.Item>
                        <Form.Item
                            name="mobile"
                            label="电话号码"
                            labelCol={{ span: num }}
                            labelAlign="right"
                            rules={[{ required: true, max: 20, whitespace: true, message: '请输入电话号码!' }]}
                        >
                            <Input placeholder="请输入" />
                        </Form.Item>

                        <Form.Item
                            name="address"
                            label="联系地址"
                            labelCol={{ span: num }}
                            labelAlign="right"
                            rules={[{ required: false, max: 20, whitespace: true }]}
                        >
                            <Input placeholder="请输入" />
                        </Form.Item>

                        <Form.Item
                            name="manager"
                            label="负责人"
                            labelCol={{ span: num }}
                            labelAlign="right"
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
                    </Form>
                </div>
            </Modal>
        </>
    );
};

export default AddBaseForm;
