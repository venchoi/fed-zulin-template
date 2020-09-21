import React, { useState, useEffect, Fragment } from 'react';
import { Spin, PageHeader, Input, Table, Switch, Modal, Row, Col, Checkbox, Select, message } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { getUserList, getAdviceCollectionList, saveCollectionRemind, switchEnable } from '@s/basicdata';
import { isEmpty, cloneDeep } from 'lodash';
const { Option } = Select;
const { Search } = Input;

const routes = [
    {
        path: '/static/basicdata/',
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
    const [initList, setInitList] = useState([]);
    const [keyword, setKeyword] = useState('');
    const getList = async (isFirst?: string) => {
        setLoading(true);
        const res = await getAdviceCollectionList();
        if (res?.result) {
            if (keyword) {
                setList(getFilterAutoAuditListData(res?.data?.company));
            } else {
                setList(res?.data?.company);
            }
        }
        setLoading(false);
    };
    useEffect(() => {
        getList('isFirst');
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
        setLoading(true);
        const res = await switchEnable({ stage_id: record.id });
        if (res?.result) {
            getList();
        } else {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: '项目名称',
            dataIndex: 'name',
            key: 'name',
            render(text) {
                return <span style={{ marginLeft: 8 }}>{text}</span>;
            },
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
            width: 80,
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render(text: any, record: any) {
                return record.is_end !== '1' ? '' : <a onClick={() => handle(record)}>配置</a>;
            },
            width: 80,
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

    //过滤搜索数据
    const getFilterAutoAuditListData = data => {
        if (data && data.length) {
            const result = data.filter(item => {
                if (item.is_end == '1') {
                    return (item.name || item.stage_name) && (item.name || item.stage_name).indexOf(keyword) >= 0;
                } else {
                    const temp = getFilterAutoAuditListData(item.children);
                    item.children = temp;
                    return temp && temp.length > 0;
                }
            });
            data = result;
            return data;
        } else {
            return [];
        }
    };

    const onSearch = () => {
        getList();
    };

    return (
        <Spin spinning={loading}>
            <PageHeader
                breadcrumb={{ routes, itemRender, separator: '>' }}
                style={{ backgroundColor: '#fff' }}
                title="收款通知"
            />
            <div style={{ padding: '16px', backgroundColor: '#F5F6F7' }}>
                <div style={{ backgroundColor: '#fff', padding: '24px 24px 8px 24px' }}>
                    <Search
                        placeholder="请输入项目"
                        onSearch={onSearch}
                        style={{ width: 216, marginBottom: 16 }}
                        onChange={e => setKeyword(e.target.value)}
                    />
                    {list.length > 0 ? (
                        <Table
                            expandRowByClick
                            expandIcon={props => customExpandIcon(props)}
                            columns={columns}
                            dataSource={list}
                            pagination={false}
                            defaultExpandAllRows={true}
                            scroll={{
                                y: 'calc(100vh - 380px)',
                            }}
                            rowKey={rowData => rowData.id}
                            bordered
                            size="small"
                            expandable={{
                                defaultExpandAllRows: true,
                            }}
                        />
                    ) : null}
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
                width={600}
                bodyStyle={{ width: 700 }}
                centered
            >
                <Row>
                    <Col span={4} style={{ textAlign: 'right', color: '#868B8F', marginRight: 14 }}>
                        所属项目:
                    </Col>
                    <Col span={8}>{currentItem.name}</Col>
                </Row>
                <Row>
                    <Col span={4} style={{ textAlign: 'right', color: '#868B8F', marginRight: 14 }}>
                        通知方式:
                    </Col>
                    <Col span={8}>App内通知</Col>
                </Row>
                <Row>
                    <Col span={4} style={{ textAlign: 'right', color: '#868B8F', marginRight: 14 }}>
                        选择提醒人:
                    </Col>
                    <Col span={18}>
                        <Checkbox.Group options={plainOptions} onChange={onChange} value={chooseType} />
                    </Col>
                </Row>
                <Row>
                    <Col span={4}></Col>
                    <Col span={18} style={{ marginLeft: 14 }}>
                        {showSelect ? (
                            <Select
                                mode="multiple"
                                style={{ width: 400, marginTop: 8 }}
                                placeholder="选择指定人员"
                                onChange={handleChange}
                                defaultValue={chooseIds}
                                menuItemSelectedIcon={<Checkbox checked />}
                                suffixIcon={<Checkbox />}
                                maxTagCount={5}
                                optionFilterProp="lable"
                                optionLabelProp="lable"
                            >
                                {userList.map((item: any) => {
                                    return (
                                        <Option value={item.id} key={item.id} lable={item.name}>
                                            {`${item.name} (${item.organization_name})`}
                                        </Option>
                                    );
                                })}
                            </Select>
                        ) : null}
                    </Col>
                </Row>
            </Modal>
        </Spin>
    );
}
export default App;
