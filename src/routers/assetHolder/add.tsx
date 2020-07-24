import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Link } from 'dva/router';
import { Card, Form, Button, message, PageHeader, Divider } from 'antd';
import { Route } from 'antd/es/breadcrumb/Breadcrumb';
import { cloneDeep } from 'lodash';
import AddBaseForm from './components/addBaseForm';
import AddBankForm from './components/addBankForm';
import BankTable from './components/bankTable';
import { getAssetHolderBankList, getAssetHolderDetail, postAddAssetHolder } from '@s/assetHolder';
import { IAddAssetHolder, IAddAssetHolderBank } from '@t/assetHolder';
import './add.less';

const Add = ({ history, match }: RouteComponentProps) => {
    const [form] = Form.useForm();
    const [showAddBankAccount, setShowAddBankAccount] = useState(false);
    const [bankList, setBankList] = useState<IAddAssetHolderBank[]>([]);
    let id = '';
    if (match && match.params) {
        if (match.params.id) {
            id = match.params.id;
        }
    }
    // 获取 基本信息
    const fetchDetail = async () => {
        const { data } = await getAssetHolderDetail({ id });
        const result = data;
        if (result) {
            const keys = Object.keys(result);
            if (keys) {
                keys.forEach(name => {
                    if (name === 'project_id') {
                        form.setFieldsValue({ [name]: [data[name]] });
                    } else {
                        form.setFieldsValue({ [name]: data[name] });
                    }
                });
            }
        }
    };
    // 获取 收款账户
    const fetchAccountData = async () => {
        const { data } = await getAssetHolderBankList({ page: 1, page_size: 10000, id });
        const result = data && data;
        if (result) {
            setBankList(result);
        }
    };
    useEffect(() => {
        if (id) {
            fetchDetail().then();
            fetchAccountData().then();
        }
    }, []);
    // 页面保存数据
    const finishHandle = async (values: IAddAssetHolder) => {
        if (id) {
            // 编辑
            values.id = id;
            const { data, result, msg } = await postAddAssetHolder(values as IAddAssetHolder);
            if (result) {
                message.success('编辑成功');
                setTimeout(() => {
                    history.push('/asset-holder/list');
                }, 500);
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
                setTimeout(() => {
                    history.push('/asset-holder/list');
                }, 500);
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
            breadcrumbName: id ? '编辑' : '新增',
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
            <PageHeader
                title={`${id ? '编辑' : '新增'}资产持有人`}
                breadcrumb={{ routes, itemRender, separator: '>' }}
                ghost={false}
            />
            <Form onFinish={finishHandle} form={form} style={{ height: '88%', display: 'flex' }}>
                <div className="layout-detail asset-holder-add-wrap">
                    <Card className="report-card" title="基本信息" bordered={false} style={{ height: '330px' }}>
                        <AddBaseForm id="" />
                    </Card>
                    <Card
                        className="report-card"
                        title="收款账户"
                        bordered={false}
                        extra={extra}
                        style={{ height: 'calc(100% - 330px)' }}
                    >
                        <div className="account-table">
                            <BankTable
                                data={bankList}
                                isCanOperate
                                onDelete={onDeleteAccount}
                                onUpdate={onUpdateAccount}
                            />
                        </div>

                        <div className="layout-detail-footer">
                            <Divider />
                            <div className="layout-detail-footer-content layout-detail-footer-content-text-right">
                                <Link className="ant-btn" to="/asset-holder/list">
                                    取 消
                                </Link>
                                <Button className="add-button ant-btn-primary btn-margin-left-16" htmlType="submit">
                                    {' '}
                                    保 存
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </Form>
            {showAddBankAccount ? <AddBankForm onCancel={onCancel} onOk={onSave} /> : null}
        </>
    );
};
export default Add;
