import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Link, routerRedux } from 'dva/router';
import { Card, Form, Button, message, Modal, Tag, PageHeader } from 'antd';
import { cloneDeep } from 'lodash';
import AddBaseForm from './components/addBaseForm';
import AddBankForm from './components/addBankForm';
import BankTable from './components/bankTable';
import { postAddAssetHolder } from '@s/assetHolder';
import { IAddAssetHolder, IAddAssetHolderBank } from '@t/assetHolder';
import './index.less';
import { Route } from 'antd/es/breadcrumb/Breadcrumb';

const Add = ({ location, history }: RouteComponentProps) => {
    const [form] = Form.useForm();
    const [showAddBankAccount, setShowAddBankAccount] = useState(false);
    const [bankList, setBankList] = useState<IAddAssetHolderBank[]>([]);
    const id = '';
    // 页面保存数据
    const finishHandle = async (values: IAddAssetHolder) => {
        if (id) {
            // 编辑
            values.id = id;
            const { data, result, msg } = await postAddAssetHolder(values as IAddAssetHolder);
            if (result) {
                message.success('编辑成功');
            } else {
                message.error(msg || '编辑失败');
            }
        } else {
            if (bankList) {
                const filterBankList = cloneDeep(bankList);
                if (filterBankList) {
                    filterBankList.map(account => {
                        if ((account.id || '').indexOf('0.') > -1) {
                            delete account.id;
                        }
                        return account;
                    });
                }
                values.accounts = filterBankList;
            }
            // 新增
            const { result, msg } = await postAddAssetHolder(values as IAddAssetHolder);
            if (result) {
                message.success('操作成功');
                history.push('/asset-holder/list');
            } else {
                message.error(msg || '操作失败');
            }
        }
    };
    // 收款账户 显示弹框
    const handleShowModal = () => {
        setShowAddBankAccount(true);
    };
    // 收款账户 弹框 取消
    const onCancel = () => {
        setShowAddBankAccount(false);
    };
    // 收款账户 弹框 确定
    const onSave = (values: IAddAssetHolderBank) => {
        setShowAddBankAccount(false);
        setBankList([...bankList, values]);
    };
    // 收款账户 删除
    const onDeleteAccount = (id: string) => {
        const result = bankList.filter(item => item.id !== id);
        setBankList([...result]);
    };
    // 收款账户 修改
    const onUpdateAccount = (value: IAddAssetHolderBank) => {
        const updateList = cloneDeep(bankList);
        let index = updateList.findIndex(item => item.id === value.id);
        if (index > -1) {
            updateList.splice(index, 1, value);
        }
        setBankList([...updateList]);
    };
    // 新增、筛选区域
    const extra = (
        <>
            <a onClick={handleShowModal}>+添加账户</a>
        </>
    );
    const routes = [
        {
            path: '/asset-holder/list',
            breadcrumbName: '租入管理',
        },
        {
            path: '',
            breadcrumbName: '新增',
        },
    ];
    const itemRender = (route: Route) => {
        if (route.path) {
            return (
                <Link to={route.path} key={route.path}>
                    {route.breadcrumbName}
                </Link>
            );
        }
        return <span key={route.path}>{route.breadcrumbName}</span>;
    };
    return (
        <>
            <PageHeader title="新增资产持有人" breadcrumb={{ routes, itemRender, separator: '>' }} ghost={false} />
            <Form onFinish={finishHandle} form={form}>
                <div className="layout-list">
                    <Card className="report-card" title="基本信息" bordered={false}>
                        <AddBaseForm id="" />
                    </Card>
                    <Card className="report-card" title="收款账户" bordered={false} extra={extra}>
                        <BankTable data={bankList} isCanOperate onDelete={onDeleteAccount} onUpdate={onUpdateAccount} />
                    </Card>
                    <Link className="ant-btn" to="/asset-holder/list">
                        取消
                    </Link>
                    <Button className="add-button" htmlType="submit">
                        新增
                    </Button>
                </div>
            </Form>
            {showAddBankAccount ? <AddBankForm onCancel={onCancel} onOk={onSave} /> : null}
        </>
    );
};
export default Add;
