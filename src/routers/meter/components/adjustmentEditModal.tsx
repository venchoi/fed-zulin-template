import React, { useState, useEffect } from 'react';
import { Form, Input, Radio, Select, DatePicker, Modal, message, Button } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { find, pick } from 'lodash';
import { IAdjustmentItem, IMeterTypeItem, IAdjustmentAddItem, IStepData, AdjustmentType } from '@t/meter';
import { getMeterTypeList, postAdjustmentAdd } from '@s/meter';
import { unitTransfer } from '@/helper/sringUtils';
import moment from 'moment';

const { Item: FormItem } = Form;
const { TextArea } = Input;
const { Option } = Select;
const { Group: RadioGroup } = Radio;
const { RangePicker } = DatePicker;

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
            const params = pick(values, ['meter_standard_price_id']);
            // TODO unit
            // add({ ...params, unit: selectedMeterType.unit });
        });
    };

    const adjustmentType = [
        {
            name: AdjustmentType.PRICE,
            value: AdjustmentType.PRICE,
        },
        {
            name: AdjustmentType.FUTUREPRICE,
            value: AdjustmentType.FUTUREPRICE,
        },
    ];

    return (
        <Modal visible={true} onCancel={() => onCancel()} onOk={() => handleSubmit()} title="发起调整">
            <Form form={form} labelCol={{ span: 5 }} labelAlign="right" initialValues={editItem}>
                <FormItem name="type" label="调整类型">
                    <Select onChange={(value: string) => handleMeterTypeChange(value)} style={{ width: 240 }}>
                        {adjustmentType.map(item => (
                            <Option value={item.value} key={item.value}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </FormItem>
                <FormItem name="start_date" label="生效日期">
                    <DatePicker />
                </FormItem>
                <FormItem name="start_date" label="有效日期">
                    <RangePicker />
                </FormItem>
                <FormItem name="is_step" label="启用阶梯价">
                    <RadioGroup style={{ width: 240 }}>
                        <Radio value={'1'}>是</Radio>
                        <Radio value={'0'}>否</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem name="reason" label="调整原因" rules={[{ max: 200 }]}>
                    <TextArea />
                </FormItem>
            </Form>
        </Modal>
    );
};
export default EditModal;
