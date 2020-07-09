import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Link } from 'dva/router';
import { Card, Form, Button, message, Modal } from 'antd';
import AddBaseForm from './components/addBaseForm';
import AddBankForm from './components/addBankForm';
import BankTable from './components/bankTable';
import { postAddAssetHolder } from '@s/assetHolder';
import { IAddAssetHolder } from '@t/assetHolder';
import './index.less';

const Add = ({ location }: RouteComponentProps) => {
    const [form] = Form.useForm();
    const [showAddBankAccount, setShowAddBankAccount] = useState(false);
    const finishHandle = (values: IAddAssetHolder) => {
        // console.log(values)
        // async (values: IAddAssetHolder) => {
        //     // 获取银行账号数据
        //     const { data, result } = await postAddAssetHolder(values as IAddAssetHolder);
        //     if (result) {
        //         message.success('操作成功');
        //     }
        // }
    };
    const onCancel = () => {
        setShowAddBankAccount(false);
    };
    const handleSubmit = () => {
        // console.log('sssss')
    };
    const handleShowModal = () => {
        setShowAddBankAccount(true);
    };
    const onSave = values => {
        console.log('values:', values);
    };
    // console.log('showAddBankAccount', showAddBankAccount)
    return (
        <>
            <Form onFinish={finishHandle}>
                <div className="layout-list meter-list">
                    <Card className="report-card" title="基本信息" bordered={false}>
                        <AddBaseForm id="" />
                    </Card>
                    <Card className="report-card" title="收款账户" bordered={false}>
                        <BankTable />
                    </Card>
                    <Button className="add-button" htmlType="submit">
                        新增
                    </Button>

                    <Button className="add-button" onClick={handleShowModal}>
                        新增
                    </Button>
                </div>
            </Form>
            {showAddBankAccount ? <AddBankForm onCancel={onCancel} onOk={onSave} /> : null}
        </>
    );
};
export default Add;
