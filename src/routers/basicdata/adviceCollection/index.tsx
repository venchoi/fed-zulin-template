import React, { useState, useEffect } from 'react';
import { Spin, PageHeader, Input, Table, Switch, Modal, Button, Row, Col, Checkbox, Select } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
const { Option } = Select;
const { Search } = Input;

const routes = [
    {
        path: '/static//basicdata',
        breadcrumbName: '杂项费用',
    },
    {
        path: '',
        breadcrumbName: '收款通知',
    },
];

const plainOptions = ['合同创办人', '合同经办人', '合同运营人', '指定人员'];

function App() {
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [currentItem, setCurrentItem] = useState({});
    const [showSelect, setShowSelect] = useState(false);
    const [chooseNames, setChooseNames] = useState([]);

    const itemRender = (route: any) => {
        if (route.path) {
            return (
                <a href={route.path} key={route.path}>
                    {route.breadcrumbName}
                </a>
            );
        }
        return <span key={route.path}>{route.breadcrumbName}</span>;
    };

    const handleChange = (value, option) => {
        setChooseNames(value);
    };

    const handleOk = () => {
        setConfirmLoading(true);
        setVisible(false);
        setConfirmLoading(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    //处理切换
    const handleSwitchStatus = record => {
        const enabled = record.is_enable === '1' ? '0' : '1';
        actions.enableAutoAudit(
            {
                project_id: record.id,
                status: enabled,
            },
            json => {
                if (json && json.result) {
                    record.is_enable = enabled;
                    actions.initState({ autoAuditListData });
                    message.success(record.is_enable === '1' ? '启用成功!' : '关闭成功!');
                } else {
                    const msg = json.msg || (record.is_enable === '1' ? '关闭失败!' : '启用失败!');
                    message.error(msg);
                }
            }
        );
    };

    const columns = [
        {
            title: '项目名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '通知人员',
            dataIndex: 'man',
            key: 'man',
        },
        {
            title: '启用状态',
            dataIndex: 'is_enable',
            key: 'is_enable',
            render(text, record) {
                return record.is_end !== '1' ? null : (
                    <div className="switch-container">
                        <Switch onChange={() => handleSwitchStatus(record)} checked={record.is_enable === '1'} />
                    </div>
                );
            },
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render(text: any, record: any) {
                return record.is_end !== '1' ? '' : <a onClick={() => handleSetAudit(record)}>设置</a>;
            },
        },
    ];

    const customExpandIcon = ({ expanded, onExpand, record }: any) => {
        if (record.children && record.children.length > 0) {
            return expanded ? (
                <UpOutlined onClick={e => onExpand(record, e)} />
            ) : (
                <DownOutlined onClick={e => onExpand(record, e)} />
            );
        } else {
            return <span style={{ marginRight: 8 }}></span>;
        }
    };

    const handle = (item: any) => {
        setChooseNames(['china']);
        setCurrentItem(item);
        setVisible(true);
    };

    const onChange = checkedValues => {
        const res = checkedValues.find(item => item === '指定人员');
        if (res) {
            setShowSelect(true);
        } else {
            setShowSelect(false);
        }
        console.log('checked = ', checkedValues);
    };
    return (
        <Spin spinning={false}>
            <PageHeader
                breadcrumb={{ routes, itemRender, separator: '>' }}
                style={{ backgroundColor: '#fff' }}
                title="收款通知"
            />
            <div style={{ padding: '16px', backgroundColor: '#F5F6F7' }}>
                <div style={{ backgroundColor: '#fff', padding: 16 }}>
                    <Search placeholder="请输入项目" onSearch={value => console.log(value)} style={{ width: 200 }} />
                    <Table expandRowByClick expandIcon={props => customExpandIcon(props)} />
                </div>
            </div>
            <Modal
                title="配置"
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                keyboard={false}
                maskClosable={false}
            >
                <Row>
                    <Col span={4}>所属项目:</Col>
                    <Col span={8}>花园城项目</Col>
                </Row>
                <Row>
                    <Col span={4}>通知方式:</Col>
                    <Col span={8}>App内通知</Col>
                </Row>
                <Row>
                    <Col span={4}>选择提醒人:</Col>
                    <Col span={18}>
                        <Checkbox.Group options={plainOptions} defaultValue={['Apple']} onChange={onChange} />
                    </Col>
                </Row>
                {showSelect ? (
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="选择指定人员"
                        onChange={handleChange}
                        optionLabelProp="value"
                        defaultValue={chooseNames}
                    >
                        <Option value="china" label="China">
                            <div className="demo-option-label-item">
                                <span role="img" aria-label="China">
                                    🇨🇳
                                </span>
                                China (中国)
                            </div>
                        </Option>
                        <Option value="usa" label="USA">
                            <div className="demo-option-label-item">
                                <span role="img" aria-label="USA">
                                    🇺🇸
                                </span>
                                USA (美国)
                            </div>
                        </Option>
                        <Option value="japan" label="Japan">
                            <div className="demo-option-label-item">
                                <span role="img" aria-label="Japan">
                                    🇯🇵
                                </span>
                                Japan (日本)
                            </div>
                        </Option>
                        <Option value="korea" label="Korea">
                            <div className="demo-option-label-item">
                                <span role="img" aria-label="Korea">
                                    🇰🇷
                                </span>
                                Korea (韩国)
                            </div>
                        </Option>
                    </Select>
                ) : null}
            </Modal>
            <Button
                onClick={() => {
                    handle(true);
                }}
            >
                测试
            </Button>
        </Spin>
    );
}
export default App;
