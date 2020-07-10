import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, message } from 'antd';
import { IAddAssetHolderBank } from '@t/assetHolder';
import { getAssetHolderBankDetail, postAddAssetHolderBank } from '@/services/assetHolder';

interface IProps {
    onCancel: () => void;
    onOk?: (object: IAddAssetHolderBank) => void;
    isSubmit?: boolean; // 是否直接提交银行账号信息
    bankId?: string; // 账户Id
    assetHolderId?: string; // 资产持有人Id
}
const { TextArea } = Input;
const AddBankForm = ({ onCancel, onOk, isSubmit = false, bankId = '', assetHolderId = '' }: IProps) => {
    const [form] = Form.useForm();
    const num = 5;
    const title = bankId ? '编辑账户' : '添加账户';
    const initDetail = {
        id: '',
        bank: '',
        account: '',
        account_name: '',
        remark: '',
    };
    const [detail, setDetail] = useState<IAddAssetHolderBank>(initDetail);

    const handleSubmit = () => {
        form.validateFields().then(async values => {
            if (isSubmit) {
                if (bankId) {
                    values.id = bankId;
                }
                const { data, result, msg } = await postAddAssetHolderBank(values as IAddAssetHolderBank);
                if (result) {
                    if (onOk) {
                        onOk(data);
                    }
                    message.success('操作成功');
                } else {
                    message.error(msg || '操作成功');
                }
            } else {
                const obj = Object.assign({}, values, { id: `${Math.random()}` });
                if (onOk) {
                    onOk(obj as IAddAssetHolderBank);
                }
            }
        });
    };

    const fetchDetail = async () => {
        const { data } = await getAssetHolderBankDetail({ id: bankId });
        const result = (data && data[0]) || initDetail;
        setDetail(result);
    };

    useEffect(() => {
        if (bankId) {
            fetchDetail();
        }
    }, []);

    return (
        <Modal visible={true} width={473} title={title} centered onCancel={() => onCancel()} onOk={handleSubmit}>
            <div className="add-base-form-wrap">
                <Form form={form}>
                    <Form.Item
                        name="bank"
                        label="开户行"
                        labelCol={{ span: num }}
                        labelAlign="right"
                        rules={[{ required: true, whitespace: true, message: '请输入开户行!' }]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                    <Form.Item
                        name="account"
                        label="银行帐户"
                        labelCol={{ span: num }}
                        labelAlign="right"
                        rules={[{ required: true, whitespace: true, message: '请输入银行帐户!' }]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                    <Form.Item
                        name="account_name"
                        label="户名"
                        labelCol={{ span: num }}
                        labelAlign="right"
                        rules={[{ required: true, whitespace: true, message: '请输入户名!' }]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                    <Form.Item
                        name="remark"
                        label="备注"
                        labelCol={{ span: num }}
                        labelAlign="right"
                        rules={[{ required: false, whitespace: true }]}
                    >
                        <TextArea rows={4} placeholder="请输入" />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};

export default AddBankForm;
