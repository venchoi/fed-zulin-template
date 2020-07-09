import React, { useState, useEffect } from 'react';
import { Form, Input, Radio, Select, DatePicker, Modal, message, Table, Button } from 'antd';
import './addBaseForm.less';
import { getIdCardList, postAddAssetHolder } from '@/services/assetHolder';
import { IAddAssetHolder } from '@t/assetHolder';

interface IProps {
    id?: string;
}
interface IIdCardTypeList {
    id: string;
    value: string;
}
const { Option } = Select;
const AddBaseForm = ({ id }: IProps) => {
    const [loading, setLoading] = useState(true);
    const [idCardTypeList, setIdCardTypeList] = useState<IIdCardTypeList[]>([]);
    const fetchIdCardDetail = async () => {
        setLoading(true);
        const { data } = await getIdCardList({ code: 'IdType' });
        setLoading(false);
        const result = data || [];
        setIdCardTypeList(result);
    };
    useEffect(() => {
        fetchIdCardDetail();
    }, []);

    const handleIdCodeTypeChange = (value: string) => {
        //form.setFieldsValue({ id_code_type: value });
    };

    const save = () => {
        // form.validateFields()
        //     .then(async (values: IAddAssetHolder) => {
        //         // 获取银行账号数据
        //         const { data, result } = await postAddAssetHolder(values as IAddAssetHolder);
        //         if (result) {
        //             message.success('操作成功');
        //         }
        //     })
    };

    return (
        <>
            <div className="add-base-form-wrap">
                <Form.Item
                    name="name"
                    label="持有人姓名"
                    className="form-item"
                    rules={[{ required: true, max: 20, whitespace: true, message: '请输入持有人姓名!' }]}
                >
                    <Input placeholder="请输入" style={{ width: 240 }} />
                </Form.Item>
                <Form.Item
                    name="id_code_type"
                    label="证件类型"
                    className="form-item"
                    rules={[{ required: true, max: 100, whitespace: true, message: '请选择证件类型!' }]}
                >
                    <Select style={{ width: 240 }} onChange={(value: string) => handleIdCodeTypeChange(value)}>
                        {idCardTypeList.map(item => (
                            <Option value={item.id} key={item.id}>
                                {item.value}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="short_name"
                    label="持有人简称"
                    className="form-item"
                    rules={[{ required: false, max: 20, whitespace: true }]}
                >
                    <Input placeholder="请输入" style={{ width: 240 }} />
                </Form.Item>
                <Form.Item
                    name="id_code"
                    label="证件号码"
                    className="form-item"
                    rules={[{ required: true, max: 20, whitespace: true, message: '请输入证件号码!' }]}
                >
                    <Input placeholder="请输入" style={{ width: 240 }} />
                </Form.Item>
                <Form.Item
                    name="english_name"
                    label="英文名称"
                    className="form-item"
                    rules={[{ required: false, max: 20, whitespace: true }]}
                >
                    <Input placeholder="请输入" style={{ width: 240 }} />
                </Form.Item>
                <Form.Item
                    name="contacter"
                    label="联系人"
                    className="form-item"
                    rules={[{ required: true, max: 20, whitespace: true, message: '请输入联系人!' }]}
                >
                    <Input placeholder="请输入" style={{ width: 240 }} />
                </Form.Item>
                <Form.Item
                    name="english_short_name"
                    label="英文简称"
                    className="form-item"
                    rules={[{ required: false, max: 20, whitespace: true }]}
                >
                    <Input placeholder="请输入" style={{ width: 240 }} />
                </Form.Item>
                <Form.Item
                    name="mobile"
                    label="电话号码"
                    className="form-item"
                    rules={[{ required: true, max: 20, whitespace: true, message: '请输入电话号码!' }]}
                >
                    <Input placeholder="请输入" style={{ width: 240 }} />
                </Form.Item>
                <Form.Item
                    name="type"
                    label="客户类型"
                    className="form-item"
                    rules={[{ required: false, max: 20, whitespace: true }]}
                >
                    <Input placeholder="请输入" style={{ width: 240 }} />
                </Form.Item>
                <Form.Item
                    name="address"
                    label="联系地址"
                    className="form-item"
                    rules={[{ required: false, max: 20, whitespace: true }]}
                >
                    <Input placeholder="请输入" style={{ width: 240 }} />
                </Form.Item>
                <Form.Item
                    name="project_id"
                    label="关联项目"
                    className="form-item"
                    rules={[{ required: true, max: 20, whitespace: true, message: '请选择关联项目!' }]}
                >
                    <Input placeholder="请输入" style={{ width: 240 }} />
                </Form.Item>
                <Form.Item
                    name="manager"
                    label="负责人"
                    className="form-item"
                    rules={[{ required: true, max: 20, whitespace: true, message: '请选择负责人!' }]}
                >
                    <Input placeholder="请输入" style={{ width: 240 }} />
                </Form.Item>
            </div>
        </>
    );
};

export default AddBaseForm;
