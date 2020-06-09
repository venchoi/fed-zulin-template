import React from 'react';
import { Form, Input, Radio, Select, DatePicker } from 'antd';

const { Item: FormItem } = Form;
const { TextArea } = Input

const EditModal = () => {
  const [form] = Form.useForm()
  return <>
    <Form>
      <FormItem name="" label="标准名称" hasFeedback rules={[{ required: true }]}>
      </FormItem>
      <FormItem name="" label="应用类型" hasFeedback rules={[{ required: true }]}>
      </FormItem>
      <FormItem name="" label="启用阶梯价" hasFeedback rules={[{ required: true }]}>
      </FormItem>
      <FormItem name="" label="标准单价" hasFeedback rules={[{ required: true }]}>
      </FormItem>
      <FormItem name="" label="生效日期" hasFeedback rules={[{ required: true }]}>
      </FormItem>
      <FormItem name="" label="标准说明" hasFeedback rules={[{ required: true }]}>
      </FormItem>
    </Form>
  </> 
}
export default EditModal;