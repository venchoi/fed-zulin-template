import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Form, Input, Button, Select, Upload, Modal } from 'antd';
import FedUpload from '../../components/FedUpload';
import './Edit.less';
import { FormInstance } from 'antd/lib/form';
import { ModalProps } from 'antd/lib/modal';

const { TextArea } = Input;
const { Item: FormItem } = Form;
const { Option } = Select;

interface IProps extends ModalProps {
    onOk: (data: Object) => void;
}

const Edit = ({ ...props }: IProps) => {
    const [form] = Form.useForm();
    const onOk = () => {
        form.validateFields()
            .then(values => {
                console.log(values);
                props.onOk && props.onOk(values);
            })
            .catch(error => {
                console.log(error);
            });
    };
    return (
        <Modal
            title="添加报表"
            visible={true}
            onOk={() => onOk()}
            onCancel={e => {
                props.onCancel && props.onCancel(e);
            }}
        >
            <div className="report-edit">
                <Form labelCol={{ span: 4 }} labelAlign="right" form={form}>
                    {/* <input type="hidden" value={id} name="id" />
                    <input type="hidden" value="FineReport" name="report_mode" /> */}

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
                    {/* <FormItem label="上传文件" name="fileName">
                        <FedUpload accept=".cpt" />
                    </FormItem> */}
                </Form>
            </div>
        </Modal>
    );
};
export default Edit;
