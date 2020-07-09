import React from 'react';
import { Form, Input, Modal, message } from 'antd';
import { IAddAssetHolderBank } from '@t/assetHolder';
import { postAddAssetHolderBank } from '@/services/assetHolder';

interface IProps {
    onCancel: () => void;
    onOk?: (object: IAddAssetHolderBank) => void;
    isSubmit?: boolean; // 是否直接提交银行账号信息
    assetHolderId?: string; // 资产持有人Id
}
const AddBankForm = ({ onCancel, onOk, isSubmit = false, assetHolderId = '' }: IProps) => {
    const [form] = Form.useForm();
    const handleSubmit = () => {
        form.validateFields().then(async values => {
            if (isSubmit) {
                values.id = assetHolderId;
                const { data, result, msg } = await postAddAssetHolderBank(values as IAddAssetHolderBank);
                if (result) {
                    onOk && onOk(data);
                    message.success('操作成功');
                } else {
                    message.error(msg || '操作成功');
                }
            } else {
                onOk && onOk(values);
            }
        });
    };
    return (
        <Modal visible={true} width={720} title="新增账户" centered onCancel={() => onCancel()} onOk={handleSubmit}>
            <div className="add-base-form-wrap">
                <Form form={form}>
                    <Form.Item
                        name="bank"
                        label="开户行"
                        className="form-item"
                        rules={[{ required: true, max: 20, whitespace: true, message: '请输入开户行!' }]}
                    >
                        <Input placeholder="请输入" style={{ width: 240 }} />
                    </Form.Item>
                    <Form.Item
                        name="account"
                        label="银行帐户"
                        className="form-item"
                        rules={[{ required: true, max: 100, whitespace: true, message: '请输入银行帐户!' }]}
                    >
                        <Input placeholder="请输入" style={{ width: 240 }} />
                    </Form.Item>
                    <Form.Item
                        name="account_name"
                        label="户名"
                        className="form-item"
                        rules={[{ required: true, max: 20, whitespace: true, message: '请输入户名!' }]}
                    >
                        <Input placeholder="请输入" style={{ width: 240 }} />
                    </Form.Item>
                    <Form.Item
                        name="remark"
                        label="备注"
                        className="form-item"
                        rules={[{ required: false, max: 20, whitespace: true }]}
                    >
                        <Input placeholder="请输入" style={{ width: 240 }} />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};

export default AddBankForm;
