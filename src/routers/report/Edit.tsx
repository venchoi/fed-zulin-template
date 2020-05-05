import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Form, Input, Button, Select, Upload, Modal } from 'antd';
import FedUpload from '../../components/FedUpload';
import './Edit.less';
import { FormInstance } from 'antd/lib/form';
import { ModalProps } from 'antd/lib/modal';

import IRecordType from './types';

const { TextArea } = Input;
const { Item: FormItem } = Form;
const { Option } = Select;

interface IProps extends ModalProps {
    onOk: (data: Object) => void;
    detail: IRecordType;
}

const Edit = ({ ...props }: IProps) => {
    const { detail } = props;
    const [file, setFile] = useState<string | Blob>('');
    const [form] = Form.useForm();
    const onOk = () => {
        form.validateFields()
            .then(values => {
                const formData = new FormData();
                Object.keys(values).map(key => {
                    formData.append(key, values[key]);
                });
                formData.append('report_file', file);
                formData.append('report_mode', 'FineReport');
                props.onOk && props.onOk(formData);
            })
            .catch(error => {
                console.log(error);
            });
    };
    const handleUpload = (file: File) => {
        setFile(file);
        return new Promise((resolve, reject) => resolve);
    };
    return (
        <Modal
            title={detail.id ? '修改报表' : '添加报表'}
            visible={true}
            onOk={() => onOk()}
            onCancel={e => {
                props.onCancel && props.onCancel(e);
            }}
        >
            <div className="report-edit">
                <Form
                    labelCol={{ span: 4 }}
                    labelAlign="right"
                    initialValues={{ name: detail.name, desc: detail.desc, rds_type: detail.rds_type }}
                    form={form}
                >
                    <FormItem label="报表名称" name="name" rules={[{ required: true }]}>
                        <Input type="text" placeholder="请输入" onChange={() => {}} />
                    </FormItem>
                    <FormItem label="报表说明" name="desc">
                        <TextArea placeholder="(选填) 请输入" onChange={() => {}} />
                    </FormItem>
                    <FormItem label="数据源" name="rds_type">
                        <Select>
                            <Option value="rds_tenant">租户数据源</Option>
                            <Option value="rds_dm">DM数据源</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="上传文件" name="report_file" rules={[{ required: true }]}>
                        <Upload accept=".cpt" action="/" customRequest={({ file }) => handleUpload(file)}>
                            <Button>
                                <UploadOutlined /> 上传
                            </Button>
                        </Upload>
                        <span className="fed-upload-tip">注：请选择.cpt格式的文件</span>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    );
};
export default Edit;
