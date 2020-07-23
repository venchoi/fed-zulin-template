import React, { useState, useEffect } from 'react';
import { Form, Button, Input, Select, Modal, Spin, message } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { renterListType } from '../list.d';
import { SelectValue } from 'antd/lib/select';
import { getContractDetail, addContractAdmin } from '@s/renterCustomerService';
import { formatPhone } from '../../../helper/commonUtils';
interface addAdminModalType {
    isShowModal?: Boolean;
    record?: renterListType;
    onClose(isSuccess?: boolean): void;
    setLoading(val: boolean): void;
}

interface contractInfoType {
    stage_name?: string;
    start_date?: string;
    end_date?: string;
}

const layout = {
    labelCol: { 
        style: {
            width: 100
        }
    },
    wrapperCol: { span: 16 },
};
const { useForm } = Form;
const { Option } = Select;
export const addAdminModal = function(props: addAdminModalType): JSX.Element {
    const [form] = useForm();
    const [contractInfo, setContractInfo] = useState<contractInfoType>({});
    const [loading, setLoading] = useState(false);
    const {record, isShowModal, onClose} = props;
    useEffect(() => {
        if (!isShowModal) {
            setContractInfo({});
            form.resetFields([
                'contract_code',
                'phone',
                'admin_user_name',
                'email'
            ]);
        }
    }, [isShowModal]);

    // 当有数据传入的时候代表是编辑状态
    const isEdit = record && record.id;
    const title = isEdit ? '更换管理员' : '新增管理员';

    const validateForm = (): Promise<any> => {
        if (!contractInfo.stage_name && !!form.getFieldValue('contract_code')) {
            message.error('请检查合同有效性');
            return Promise.reject();
        }
        return form.validateFields()
    };

    const handleOk = async () => {
        validateForm().then(async () => {
            const params = form.getFieldsValue();
            params.phone = params.phone.replace(/\s/g, '');
            if (isEdit) {
                params.contract_code = record?.code;
            }
            const { result } = await addContractAdmin(params);
            if (result) {
                onClose && onClose(true);
                const msg = isEdit ? '更换管理员成功' : '新增管理员成功';
                message.success(msg);
            }
        }).catch(err => {
            console.log(err);
        });
    };

    const handleCancel = () => {
        onClose && onClose();
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e?.target?.value;
        if (value) {
            form.setFieldsValue({
                phone: formatPhone(value.replace(/\s/g, ''))
            });
        }
    };

    const handleSearchContract = async (value: string) => {
        const params = {
            contract_code: value
        };
        setLoading(true);
        const { result, data } = await getContractDetail(params);
        setLoading(false);
        if (result && data) {
            const { stage_name, start_date, end_date } = data;
            setContractInfo({ 
                stage_name,
                start_date,
                end_date
            });
        } else {
            message.error('未查询到此合同信息');
        }
    }

    return (
        <Modal
            centered
            width={480}            
            title={title}
            visible={!!isShowModal}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Spin spinning={loading}>
                <Form {...layout} form={form} name="add-form" validateTrigger="onBlur">
                    {
                        !isEdit ? 
                            <div style={{marginBottom: 16}}>
                                <Form.Item name="contract_code" label="合同编号" rules={[{ required: true }]}>
                                    <Input.Search placeholder="请输入" onSearch={handleSearchContract}  style={{ width: 232 }} />
                                </Form.Item>
                                <Form.Item label="项目名称">
                                    { contractInfo.stage_name || '-'}
                                </Form.Item>
                                <Form.Item label="合同有效期">
                                    { contractInfo.start_date ? `${contractInfo.start_date} 至 ${contractInfo.end_date}` : '-'}
                                </Form.Item>
                            </div>
                            :
                            null
                    }
                    <Form.Item name="admin_user_name" label="管理员姓名" rules={[{ required: true }]}>
                        <Input placeholder="请输入" style={{ width: 160 }} />
                    </Form.Item>
                    <Form.Item 
                        name="phone" 
                        label="手机号" 
                        rules={[
                            { required: true },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    const phoneReg = /^\d{3}\s\d{4}\s\d{4}$/;
                                    if (!value || phoneReg.test(value)) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('请填写正确格式的手机号');
                                },
                            }),
                        ]}
                    >
                        <Input placeholder="请输入" style={{ width: 160 }} onChange={handlePhoneChange} />
                    </Form.Item>
                    <Form.Item 
                        name="email" 
                        label="邮箱"
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    const emailReg = /^.+\@.+\..+$/
                                    if (!value || emailReg.test(value)) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('请填写正确格式的邮箱');
                                },
                            }),
                        ]}
                    >
                        <Input placeholder="请输入" style={{ width: 232 }} />
                    </Form.Item>
                </Form>
            </Spin>
            
        </Modal>  
    );
};

export default addAdminModal;
