import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Form, Input, Button, Select, Upload, Modal } from 'antd';
import FedIcon from '../../components/FedIcon';
import './Edit.less';
import { ModalProps } from 'antd/lib/modal';

import IRecordType from './types';

const { TextArea } = Input;
const { Item: FormItem } = Form;
const { Option } = Select;

interface IProps extends ModalProps {
    onOk: (data: Object) => void;
    detail: IRecordType;
}

const Edit = (props: IProps) => {
    const { detail } = props;
    const [report_file, setFile] = useState(detail.report_file || '');
    const [fileName, setFileName] = useState('');
    const [form] = Form.useForm();
    const onOk = () => {
        form.validateFields()
            .then(values => {
                const formData = new FormData();
                delete values.report_file;
                Object.keys(values).map(key => {
                    formData.append(key, values[key]);
                });
                report_file && formData.append('report_file', report_file);
                detail.id && formData.append('id', detail.id);
                detail.report_url && formData.append('report_url', detail.report_url);
                const reportMode = detail.rds_type === 'DMP' ? 'DmpReport' : 'FineReport';
                formData.append('report_mode', reportMode);
                props.onOk && props.onOk(formData);
            })
            .catch(error => {
                console.log(error);
            });
    };
    const handleUpload = (file: File) => {
        setFile(file);
        setFileName(file.name);
        return new Promise((resolve, reject) => resolve());
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
                    initialValues={{ ...detail, report_file }}
                    form={form}
                    hideRequiredMark
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
                    <FormItem label="上传文件" name="report_file">
                        <Upload accept=".cpt" action="/" customRequest={({ file }) => handleUpload(file)}>
                            <Button>
                                <UploadOutlined /> 上传
                            </Button>
                            <span className="fed-upload-tip">注：请选择.cpt格式的文件</span>
                        </Upload>
                        {fileName ? (
                            <div className="upload-file">
                                <div className="attachment-list">
                                    <FedIcon
                                        className="icon-file"
                                        type="icon-attachment-cpt"
                                        style={{ color: 'rgb(113, 172, 241)', fontSize: '40px' }}
                                    />
                                    <div>
                                        <div className="file-name">{fileName}</div>
                                        {/* <div className="file-description">{report_file}</div> */}
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </FormItem>
                </Form>
            </div>
        </Modal>
    );
};
export default Edit;
