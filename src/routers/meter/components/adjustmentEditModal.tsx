import React, { useState, useEffect } from 'react';
import { Form, Input, Radio, Select, DatePicker, Modal, message, Button } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { find, pick } from 'lodash';
import { IAdjustmentItem, IMeterTypeItem, IAdjustmentAddItem, IStepData } from '@t/meter';
import { getMeterTypeList, postAdjustmentAdd } from '@s/meter';
import { unitTransfer } from '@/helper/sringUtils';
import moment from 'moment';

const { Item: FormItem } = Form;
const { TextArea } = Input;
const { Option } = Select;
const { Group: RadioGroup } = Radio;

interface IProps {
    editItem: IAdjustmentItem;
    onCancel: () => void;
    onOk?: () => void;
}

const EditModal = ({ editItem, onCancel, onOk }: IProps) => {
    const [form] = Form.useForm();
    const [meterTypeList, setMeterTypeList] = useState<IMeterTypeItem[]>([]); // 类型列表
    const [selectedMeterType, setSelectedMeterType] = useState<IMeterTypeItem>({
        id: '',
        value: '',
        unit: '',
    }); // 选中的类型

    // 获取类型列表 - 数据返回后，设置第一个类型为选中的类型
    const fetchMeterTypeList = async () => {
        const { data = [] } = await getMeterTypeList();
        setMeterTypeList(data);
        form.setFieldsValue({ meter_type_id: data[0]?.id || '' });
        setSelectedMeterType(
            data[0] || {
                id: '',
                value: '',
                unit: '',
            }
        );
    };

    useEffect(() => {
        fetchMeterTypeList();
    }, []);

    const handleMeterTypeChange = (value: string) => {
        form.setFieldsValue({ meter_type_id: value });
        setSelectedMeterType(
            find(meterTypeList, ['id', value]) || {
                id: '',
                value: '',
                unit: '',
            }
        );
    };

    const add = async (values: IAdjustmentAddItem) => {
        const { data, result } = await postAdjustmentAdd({ ...values });
        if (result) {
            message.success('操作成功');
            onOk && onOk();
        }
    };

    const handleSubmit = async () => {
        form.validateFields().then(values => {
          const params = pick(values, [
              'meter_standard_price_id',
          ]);
          // TODO unit
          // add({ ...params, unit: selectedMeterType.unit });
        });
    };

    return (
        <Modal
            visible={true}
            onCancel={() => onCancel()}
            onOk={() => handleSubmit()}
            title='发起调整'
        >
            <Form
                form={form}
                labelCol={{ span: 5 }}
                labelAlign="right"
                initialValues={editItem}
            >
            </Form>
        </Modal>
    );
};
export default EditModal;
