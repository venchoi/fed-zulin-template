import React, { useState, useEffect } from 'react';
import { Form, Input, Radio, Select, DatePicker, Modal } from 'antd';
import { find, pick } from 'lodash'
import { IStandardPriceItem, IMeterTypeItem, IStandardPriceAddItem } from '@t/meter'
import { getMeterTypeList, postStandardAdd, postStandardEdit } from '@s/meter'
import { unitTransfer } from '@/helper/sringUtils'
import moment from 'moment';

const { Item: FormItem } = Form;
const { TextArea } = Input;
const { Option } = Select;
const { Group: RadioGroup } = Radio

interface IProps {
  editItem?: IStandardPriceItem,
  onCancel: () => void
}

const StepPriceEdit = () => {
  return (<>StepPriceEdit</>)
}

const EditModal = ({ editItem, onCancel }: IProps) => {
  const [form] = Form.useForm()
  const [isEdit, setIsEdit] = useState(!!editItem?.id)
  const [meterTypeList, setMeterTypeList] = useState<IMeterTypeItem[]>([]) // 类型列表
  const [selectedMeterType, setSelectedMeterType] = useState<IMeterTypeItem>({
    id: '',
    value: '',
    unit: '',
  }) // 选中的类型

  // 获取类型列表 - 数据返回后，设置第一个类型为选中的类型
  const fetchMeterTypeList = async () => {
    const { data = [] } = await getMeterTypeList()
    setMeterTypeList(data)
    setSelectedMeterType(data[0] && {
      id: '',
      value: '',
      unit: '',
    })
  }

  useEffect(() => {
    fetchMeterTypeList()
  }, [])

  // 提交 - 新增或编辑
  const handleMeterTypeChange = (value: string) => {
    form.setFieldsValue({ meter_type_id: value })
    setSelectedMeterType(find(meterTypeList, ['id', value]) || {
      id: '',
      value: '',
      unit: '',
    })
  }

  const submit = async (values: IStandardPriceAddItem) => {
    const { data, result } = await postStandardAdd({ ...values })

  }

  const handleSubmit = async () => {
    form.validateFields().then(values => {
      const params = pick(values, ['name', 'meter_type_id', 'unit', 'is_step', 'step_data', 'price', 'remark', 'effect_date'])
      submit({ ...params, unit: selectedMeterType.unit })
    })
  }

  return <Modal visible={true} onCancel={() => onCancel()} onOk={() => handleSubmit()} title={isEdit ? '编辑标准' : '新建标准'}>
    <Form form={form} labelCol={{ span: 5 }} labelAlign="right" initialValues={{
      name: '',
      meter_type_id: '',
      is_step: '0',
      price: '',
      // effect_date: moment().format('YYYY-MM-DD'),
      remark: ''
    }}>
      <FormItem name="name" label="标准名称" rules={[{ required: true, max: 20 }]}>
        <Input placeholder="请输入名称（限20字）" style={{ width: 240 }} />
      </FormItem>
      <FormItem name="meter_type_id" label="应用类型" rules={[{ required: true }]}>
        <Select onChange={(value: string)  => handleMeterTypeChange(value)} style={{ width: 240 }}>
          {meterTypeList.map(item => (
            <Option value={item.id} key={item.id}>{item.value}</Option>
          ))}
        </Select>
      </FormItem>
      <FormItem name="is_step" label="启用阶梯价" rules={[{ required: true }]}>
        <RadioGroup style={{ width: 240 }}>
          <Radio value={'1'}>是</Radio>
          <Radio value={'0'}>否</Radio>
        </RadioGroup>
      </FormItem>
      {/* TODO 阶梯价 */}
      <FormItem name="price" label="标准单价" rules={[{ required: true }]}>
        <Input placeholder="请输入单价" addonAfter={<>{unitTransfer(selectedMeterType.unit)}</>} style={{ width: 240 }} />
      </FormItem>
      <FormItem name="effect_date" label="生效日期" rules={[{ required: true }]}>
        <DatePicker
          placeholder="请选择生效日期"
          style={{ width: 240 }}
          format="YYYY-MM-DD"
        />
      </FormItem>
      <FormItem name="remark" label="标准说明" rules={[{ required: true }]}>
        <TextArea />
      </FormItem>
    </Form>
  </Modal> 
}
export default EditModal;