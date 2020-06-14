import React, { useState, useEffect } from 'react';
import { Form, Input, Radio, Select, DatePicker, Modal, message, Button } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { find, pick } from 'lodash';
import { IAdjustmentItem, IMeterTypeItem, IAdjustmentAddItem, IStepData, AdjustmentType } from '@t/meter';
import { getMeterTypeList, postAdjustmentAdd } from '@s/meter';
import { unitTransfer } from '@/helper/sringUtils';
import moment from 'moment';
import FedUpload from '@/components/FedUpload';

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
        <Modal visible={true} width={720} onCancel={() => onCancel()} onOk={() => handleSubmit()} title="发起调整">
            <Form
                form={form}
                labelCol={{ span: 5 }}
                labelAlign="right"
                initialValues={{
                    meter_standard_price_id: '',
                    type: AdjustmentType.PRICE,
                    start_date: moment(),
                    is_step: '0',
                    price: '',
                    unit: '',
                    reason: '',
                    attachment: [],
                }}
            >
                <FormItem name="type" label="调整类型">
                    <Select onChange={(value: string) => handleMeterTypeChange(value)} style={{ width: 240 }}>
                        {adjustmentType.map(item => (
                            <Option value={item.value} key={item.value}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </FormItem>
                <Form.Item
                    required
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.is_step !== currentValues.is_step}
                >
                    {({ getFieldValue }) => {
                        return getFieldValue('type') === AdjustmentType.PRICE ? (
                            <FormItem name="start_date" label="生效日期" rules={[{ type: 'object', required: true }]}>
                                <DatePicker />
                            </FormItem>
                        ) : (
                            <FormItem
                                name="range-time-picker"
                                label="有效日期"
                                rules={[{ type: 'array', required: true }]}
                            >
                                <RangePicker />
                            </FormItem>
                        );
                    }}
                </Form.Item>
                <FormItem name="is_step" label="启用阶梯价">
                    <RadioGroup style={{ width: 240 }}>
                        <Radio value={'1'}>是</Radio>
                        <Radio value={'0'}>否</Radio>
                    </RadioGroup>
                </FormItem>
                <Form.Item
                    required
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.is_step !== currentValues.is_step}
                >
                    {({ getFieldValue }) => {
                        return getFieldValue('is_step') === '0' ? (
                            <FormItem name="price" label="标准单价" rules={[{ required: true }]}>
                                <Input
                                    placeholder="请输入单价"
                                    addonAfter={<>{unitTransfer(editItem.unit)}</>}
                                    style={{ width: 240 }}
                                />
                            </FormItem>
                        ) : (
                            <Form.List name="step_data">
                                {(fields, { add, remove }) => (
                                    <Form.Item label="标准单价" rules={[{ required: true }]}>
                                        <table className="step-edit-container" style={{ width: '100%' }}>
                                            <thead className="step-edit-thead ant-table-thead">
                                                <tr>
                                                    <th className="ant-table-cell">
                                                        阶梯下限({unitTransfer(editItem.unit)})
                                                    </th>
                                                    <th className="ant-table-cell">
                                                        阶梯上限({unitTransfer(editItem.unit)})
                                                    </th>
                                                    <th className="ant-table-cell">
                                                        单价(元/{unitTransfer(editItem.unit)})
                                                    </th>
                                                    <th className="ant-table-cell" style={{ width: '64px' }}>
                                                        操作
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="step-edit-tbody ant-table-tbody">
                                                {fields.map((field, index) => (
                                                    <tr key={index}>
                                                        <td className="ant-table-cell">
                                                            <Form.Item {...field} name={[field.name, 'min']}>
                                                                <Input />
                                                            </Form.Item>
                                                        </td>
                                                        <td className="ant-table-cell">
                                                            <Form.Item {...field} name={[field.name, 'max']}>
                                                                <Input />
                                                            </Form.Item>
                                                        </td>
                                                        <td className="ant-table-cell">
                                                            <Form.Item {...field} name={[field.name, 'price']}>
                                                                <Input />
                                                            </Form.Item>
                                                        </td>
                                                        <td className="ant-table-cell">
                                                            <DeleteOutlined
                                                                onClick={() => {
                                                                    remove(field.name);
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <Form.Item>
                                            <Button type="dashed" block className="add-button" onClick={() => add()}>
                                                <PlusOutlined />
                                                新增
                                            </Button>
                                        </Form.Item>
                                    </Form.Item>
                                )}
                            </Form.List>
                        );
                    }}
                </Form.Item>
                <FormItem name="reason" label="调整原因" rules={[{ max: 200 }]}>
                    <TextArea />
                </FormItem>
                <FormItem label="调整附件">
                    <FedUpload />
                </FormItem>
            </Form>
        </Modal>
    );
};
export default EditModal;
