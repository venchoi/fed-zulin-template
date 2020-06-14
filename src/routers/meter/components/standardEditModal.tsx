import React, { useState, useEffect } from 'react';
import { Form, Input, Radio, Select, DatePicker, Modal, message, Table, Button } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { find, pick } from 'lodash';
import { IStandardPriceItem, IMeterTypeItem, IStandardPriceAddItem, IStandardPriceEditItem, IStepData } from '@t/meter';
import { getMeterTypeList, postStandardAdd, postStandardEdit } from '@s/meter';
import { unitTransfer } from '@/helper/sringUtils';
import moment from 'moment';

const { Item: FormItem } = Form;
const { TextArea } = Input;
const { Option } = Select;
const { Group: RadioGroup } = Radio;

interface IProps {
    editItem?: IStandardPriceItem;
    onCancel: () => void;
    onOk?: () => void;
}

const EditModal = ({ editItem, onCancel, onOk }: IProps) => {
    const [form] = Form.useForm();
    const [isEdit, setIsEdit] = useState(!!editItem?.id);
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
        // @ts-ignore
        (editItem || {}).effect_date = moment(editItem?.effect_date);
        fetchMeterTypeList();
    }, []);

    // 提交 - 新增或编辑
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

    const add = async (values: IStandardPriceAddItem) => {
        const { data, result } = await postStandardAdd({ ...values });
        if (result) {
            message.success('操作成功');
            onOk && onOk();
        }
    };
    const edit = async (values: IStandardPriceEditItem) => {
        const { data, result } = await postStandardEdit({ ...values });
        if (result) {
            message.success('操作成功');
            onOk && onOk();
        }
    };

    const handleSubmit = () => {
        form.validateFields()
            .then(values => {
                if (isEdit) {
                    const params = pick(values, ['id', 'name', 'remark']);
                    edit({ ...params });
                } else {
                    const params = pick(values, [
                        'name',
                        'meter_type_id',
                        'unit',
                        'is_step',
                        'step_data',
                        'price',
                        'remark',
                        'effect_date',
                    ]);
                    add({ ...params, unit: selectedMeterType.unit, step_data: JSON.stringify(params.step_data) });
                }
            })
            .catch(errorInfo => {
                console.error(errorInfo);
            });
    };

    return (
        <Modal
            visible={true}
            width={720}
            onCancel={() => onCancel()}
            onOk={() => handleSubmit()}
            title={isEdit ? '编辑标准' : '新建标准'}
        >
            <Form
                form={form}
                labelCol={{ span: 5 }}
                labelAlign="right"
                initialValues={
                    isEdit
                        ? editItem
                        : {
                              name: '',
                              meter_type_id: '',
                              is_step: '0',
                              price: '',
                              effect_date: moment(),
                              remark: '',
                          }
                }
            >
                <FormItem name="name" label="标准名称" rules={[{ required: true, max: 20, whitespace: true }]}>
                    <Input placeholder="请输入名称（限20字）" style={{ width: 240 }} />
                </FormItem>
                <FormItem name="meter_type_id" label="应用类型">
                    <Select
                        disabled={isEdit}
                        onChange={(value: string) => handleMeterTypeChange(value)}
                        style={{ width: 240 }}
                    >
                        {meterTypeList.map(item => (
                            <Option value={item.id} key={item.id}>
                                {item.value}
                            </Option>
                        ))}
                    </Select>
                </FormItem>
                <FormItem name="is_step" label="启用阶梯价">
                    <RadioGroup disabled={isEdit} style={{ width: 240 }}>
                        <Radio value={'1'}>是</Radio>
                        <Radio value={'0'}>否</Radio>
                    </RadioGroup>
                </FormItem>
                {/* TODO 阶梯价 */}
                <Form.Item
                    required
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.is_step !== currentValues.is_step}
                >
                    {({ getFieldValue }) => {
                        return getFieldValue('is_step') === '0' ? (
                            <FormItem name="price" label="标准单价" rules={[{ required: true }]}>
                                <Input
                                    disabled={isEdit}
                                    placeholder="请输入单价"
                                    addonAfter={<>{unitTransfer(selectedMeterType.unit)}</>}
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
                                                        阶梯上限({unitTransfer(selectedMeterType.unit)})
                                                    </th>
                                                    <th className="ant-table-cell">
                                                        阶梯下限({unitTransfer(selectedMeterType.unit)})
                                                    </th>
                                                    <th className="ant-table-cell">
                                                        单价(元/{unitTransfer(selectedMeterType.unit)})
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
                                                                <Input
                                                                    placeholder={index === 0 ? '不限' : '请输入'}
                                                                    disabled
                                                                />
                                                            </Form.Item>
                                                        </td>
                                                        <td className="ant-table-cell">
                                                            <Form.Item
                                                                {...field}
                                                                name={[field.name, 'max']}
                                                                rules={[
                                                                    {
                                                                        required: index !== fields.length - 1,
                                                                        message: '请输入阶梯下限',
                                                                    },
                                                                    {
                                                                        validator: (rule, value) => {
                                                                            if (index === fields.length - 1) {
                                                                                return Promise.resolve();
                                                                            }
                                                                            const after = getFieldValue('step_data')[
                                                                                index + 1
                                                                            ];
                                                                            if (!/^(\-|\+)?\d+(\.\d+)?$/.test(value)) {
                                                                                return Promise.reject('请输入数字类型');
                                                                            }
                                                                            if (
                                                                                after &&
                                                                                after.max &&
                                                                                +value > after.max
                                                                            ) {
                                                                                return Promise.reject(
                                                                                    '不可大于下一等级的上限'
                                                                                );
                                                                            }
                                                                            if (index > 0) {
                                                                                const before = getFieldValue(
                                                                                    'step_data'
                                                                                )[index - 1];
                                                                                if (
                                                                                    before &&
                                                                                    before.max &&
                                                                                    +value < before.max
                                                                                ) {
                                                                                    return Promise.reject(
                                                                                        '不可小于上一等级的下限'
                                                                                    );
                                                                                }
                                                                            }
                                                                            return Promise.resolve();
                                                                        },
                                                                    },
                                                                ]}
                                                            >
                                                                <Input
                                                                    placeholder={
                                                                        index === fields.length - 1 ? '不限' : '请输入'
                                                                    }
                                                                    disabled={index === fields.length - 1 || isEdit}
                                                                    onChange={e => {
                                                                        const before = getFieldValue('step_data');
                                                                        const value = e.target.value;
                                                                        before[index + 1]
                                                                            ? (before[index + 1].min = value)
                                                                            : (before[index + 1] = {
                                                                                  min: value,
                                                                                  max: '',
                                                                                  price: '',
                                                                              });
                                                                        form.setFieldsValue({ step_data: before });
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </td>
                                                        <td className="ant-table-cell">
                                                            <Form.Item
                                                                {...field}
                                                                name={[field.name, 'price']}
                                                                rules={[{ required: true, message: '请输入单价' }]}
                                                            >
                                                                <Input disabled={isEdit} />
                                                            </Form.Item>
                                                        </td>
                                                        <td className="ant-table-cell">
                                                            <Button
                                                                type="link"
                                                                disabled={isEdit}
                                                                onClick={() => {
                                                                    remove(field.name);
                                                                }}
                                                            >
                                                                <DeleteOutlined />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                block
                                                className="add-button"
                                                onClick={() => add()}
                                                disabled={isEdit}
                                            >
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
                <FormItem name="effect_date" label="生效日期">
                    <DatePicker
                        disabled={isEdit}
                        placeholder="请选择生效日期"
                        style={{ width: 240 }}
                        format="YYYY-MM-DD"
                    />
                </FormItem>
                <FormItem name="remark" label="标准说明" rules={[{ max: 200 }]}>
                    <TextArea />
                </FormItem>
            </Form>
        </Modal>
    );
};
export default EditModal;
