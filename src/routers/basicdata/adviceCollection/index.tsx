import React, { useState, useEffect, Fragment } from 'react';
import { Spin, PageHeader, Input, Table, Switch, Modal, Row, Col, Checkbox, Select, message } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { getUserList, getAdviceCollectionList, saveCollectionRemind, switchEnable } from '@s/basicdata';
import { isEmpty } from 'lodash';
const { Option } = Select;
const { Search } = Input;

const routes = [
    {
        path: '/static//basicdata',
        breadcrumbName: '基础数据',
    },
    {
        path: '',
        breadcrumbName: '收款通知',
    },
];

const plainOptions = ['合同创建人', '合同经办人', '合同运营人', '指定人员'];

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

function App() {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [currentItem, setCurrentItem] = useState({});
    const [showSelect, setShowSelect] = useState(false);
    const [chooseIds, setChooseIds] = useState([]);
    const [list, setList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [chooseType, setChooseType] = useState([]);
    const getList = async () => {
        setLoading(true);
        const res = await getAdviceCollectionList();
        if (res?.result) {
            setList(res?.data?.company);
        }
        setLoading(false);
    };
    useEffect(() => {
        getList();
    }, []);

    useEffect(() => {
        if (!isEmpty(currentItem)) {
            getUser();
        }
        const ids = JSON.parse(currentItem?.configs?.user_id || '[]');
        if (ids.length > 0) {
            const types = chooseType;
            types.push('指定人员');
            setChooseType(types);
            setShowSelect(true);
        } else {
            setShowSelect(false);
        }
    }, [currentItem]);

    const getUser = async () => {
        const res = await getUserList(currentItem.id);
        if (res?.result) {
            console.log(res, 'res');
            setUserList(res.data.items);
        }
    };

    const handleChange = (value: any) => {
        setChooseIds(value);
    };

    const handleOk = async () => {
        const haveAppoint = chooseType.find(item => item === '指定人员');
        const data = {
            stage_id: currentItem.id,
            user_type: chooseType.filter(item => item !== '指定人员'),
            user_id: haveAppoint ? chooseIds : [],
        };
        const res = await saveCollectionRemind(data);
        if (res?.result) {
            message.success('配置成功');
            getList();
        } else {
            message.success(res.msg || '配置失败');
        }
        setConfirmLoading(true);
        setVisible(false);
        setConfirmLoading(false);
        return;
    };

    const handleCancel = () => {
        setCurrentItem({});
        setVisible(false);
    };

    //处理切换
    const handleSwitchStatus = async record => {
        // const enabled = record.is_enable === '1' ? '0' : '1';
        setLoading(true);
        const res = await switchEnable({ stage_id: record.id });
        if (res?.result) {
            getList();
        } else {
            setLoading(false);
        }
        // actions.enableAutoAudit(
        //     {
        //         project_id: record.id,
        //         status: enabled,
        //     },
        //     json => {
        //         if (json && json.result) {
        //             record.is_enable = enabled;
        //             actions.initState({ autoAuditListData });
        //             message.success(record.is_enable === '1' ? '启用成功!' : '关闭成功!');
        //         } else {
        //             const msg = json.msg || (record.is_enable === '1' ? '关闭失败!' : '启用失败!');
        //             message.error(msg);
        //         }
        //     }
        // );
    };

    const columns = [
        {
            title: '项目名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '通知人员',
            dataIndex: 'view_name',
            key: 'view_name',
            render(text, record) {
                return record.is_end !== '1' ? null : record?.configs?.view_name || '-';
            },
        },
        {
            title: '启用状态',
            dataIndex: 'is_enable',
            key: 'is_enable',
            render(text, record) {
                return record.is_end !== '1' ? null : (
                    <div className="switch-container">
                        <Switch
                            onChange={() => handleSwitchStatus(record)}
                            checked={record?.configs?.is_enable === '1'}
                        />
                    </div>
                );
            },
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render(text: any, record: any) {
                return record.is_end !== '1' ? '' : <a onClick={() => handle(record)}>配置</a>;
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
        if (item?.configs?.user_id) {
            setChooseIds(JSON.parse(item.configs.user_id));
        } else {
            setChooseIds([]);
        }
        if (item?.configs?.user_type) {
            setChooseType(JSON.parse(item.configs.user_type));
        } else {
            setChooseType([]);
        }
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
        setChooseType(checkedValues);
    };

    return (
        <Spin spinning={loading}>
            <PageHeader
                breadcrumb={{ routes, itemRender, separator: '>' }}
                style={{ backgroundColor: '#fff' }}
                title="收款通知"
            />
            <div style={{ padding: '16px', backgroundColor: '#F5F6F7' }}>
                <div style={{ backgroundColor: '#fff', padding: 16 }}>
                    <Search placeholder="请输入项目" onSearch={value => console.log(value)} style={{ width: 200 }} />
                    <Table
                        expandRowByClick
                        expandIcon={props => customExpandIcon(props)}
                        columns={columns}
                        dataSource={list}
                        pagination={false}
                        scroll={{
                            y: 500,
                        }}
                        rowKey={rowData => rowData.id}
                        bordered
                        size="middle"
                    />
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
                style={{ width: 800 }}
            >
                <Row>
                    <Col span={4}>所属项目:</Col>
                    <Col span={8}>{currentItem.name}</Col>
                </Row>
                <Row>
                    <Col span={4}>通知方式:</Col>
                    <Col span={8}>App内通知</Col>
                </Row>
                <Row>
                    <Col span={4}>选择提醒人:</Col>
                    <Col span={18}>
                        <Checkbox.Group options={plainOptions} onChange={onChange} value={chooseType} />
                    </Col>
                </Row>

                {showSelect ? (
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="选择指定人员"
                        onChange={handleChange}
                        defaultValue={chooseIds}
                        menuItemSelectedIcon={<Checkbox checked />}
                        suffixIcon={<Checkbox />}
                    >
                        {userList.map((item: any) => {
                            return (
                                <Option value={item.id} key={item.id}>
                                    {item.name}
                                </Option>
                            );
                        })}
                    </Select>
                ) : null}
            </Modal>
        </Spin>
    );
}
export default App;
