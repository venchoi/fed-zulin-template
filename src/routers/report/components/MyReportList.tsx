/*
 * @作者: 陈文惠
 * @创建日期: 2020-05-06 14:37:20
 * @最近一次修改人:   陈文惠
 * @最近一次修改时间: 2020-05-06 14:37:20
 * @文件说明: 统计报表 - 我的报表tab
 */

import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { ExclamationCircleOutlined, DownloadOutlined, LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { Tabs, Card, Pagination, Button, Modal, message, Spin } from 'antd';
import { getMyReportList, deleteReport, getUpdateStatus, updateReportRDS, editReport } from '../../../services/report';
import Filter from '../components/Filter';
import FedTable from '../../../components/FedTable';
import FedPagination from '../../../components/FedPagination';
import Edit from '../Edit';

// types
import { ColumnProps } from 'antd/es/table';
import IRecordType from '../types';

const { confirm } = Modal;
const { TabPane } = Tabs;

interface IProps {
    columns: ColumnProps<IRecordType>[];
    setActiveTabKey: Dispatch<SetStateAction<string>>;
}

const MyReportList = ({ columns: propsColumns = [], setActiveTabKey }: IProps) => {
    const defaultEditItem: IRecordType = {
        id: '',
        name: '',
        desc: '',
        standard_id: '',
        rds_type: 'rds_tenant',
        upload_on: '',
        download_url: '',
        upload_by: '',
        report_file: '',
    }; // 默认编辑字段
    let updaterTimer: NodeJS.Timeout;
    const [loading, setLoading] = useState(false); // loading
    const [updating, setUpdating] = useState(false); // 报表更新中
    const [myReportTotal, setMyReportTotal] = useState(0); // 列表数据总记录数
    const [editItem, setEditItem] = useState(defaultEditItem); // 编辑的数据
    const [updateTime, setUpdateTime] = useState(''); // 最后更新时间
    const [keyword, setKeyword] = useState('');
    const [myReportParams, setMyReportParams] = useState({
        page_index: 1,
        page_size: 20,
    }); // 请求列表接口的参数
    const [myReportDataSource, setMyReportDataSource] = useState([]); // 列表表格数据源
    const [showEditModal, setShowEditModal] = useState(false); // 显示新增编辑弹窗

    const columns = propsColumns.concat([
        {
            title: '操作',
            dataIndex: 'id',
            width: 194,
            render: (text, record, index) => {
                return (
                    <>
                        <Button type="link" onClick={() => handleEdit(record)} className="f-hidden rental-report-edit">
                            修改
                        </Button>
                        <Button
                            type="link"
                            onClick={() => handleDelete(record)}
                            className="f-hidden rental-report-delete"
                        >
                            删除
                        </Button>
                        <Button type="link" href={record.download_url} className="f-hidden rental-report-download">
                            下载
                        </Button>
                    </>
                );
            },
        },
    ]);

    /**
     * 删除操作
     * @param record 被删除的记录
     */
    const handleDelete = (record: IRecordType) => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            title: '确定删除该项？',
            onOk: async () => {
                setLoading(true);
                const { result, data } = await deleteReport({ id: record.id });
                setLoading(false);
                if (result) {
                    message.success('操作成功');
                    fetchMyReportList();
                }
            },
        });
    };

    /**
     * 新增编辑弹窗回调
     * @param params 修改或新增的item
     */
    const handleOk = async (params: Object) => {
        const { result } = await editReport(params);
        if (result) {
            message.success(editItem.id ? '修改成功' : '添加成功');
            setShowEditModal(false);
            setMyReportParams({ ...myReportParams, page_index: 1 });
        }
    };

    /**
     * 获取列表数据
     */
    const fetchMyReportList = async () => {
        setLoading(true);
        const { result, data } = await getMyReportList({ keyword, ...myReportParams });
        setLoading(false);
        if (result) {
            setMyReportDataSource(data.list);
            setMyReportTotal(data.total);
        }
    };

    /**
     * 下载报表工具
     */
    const handleDownload = () => {
        const agent = navigator.userAgent.toLocaleLowerCase();
        if (agent.indexOf('mac os') !== -1) {
            window.location.href =
                'https://fine-build.oss-cn-shanghai.aliyuncs.com/finereport/10.0/stable/exe/macos_FineReport-CN.dmg';
        } else {
            window.location.href =
                agent.indexOf('win64') >= 0 || agent.indexOf('wow64') >= 0
                    ? 'https://fine-build.oss-cn-shanghai.aliyuncs.com/finereport/10.0/stable/exe/windows_x64_FineReport-CN.exe'
                    : 'https://fine-build.oss-cn-shanghai.aliyuncs.com/finereport/10.0/stable/exe/windows_x86_FineReport-CN.exe';
        }
    };

    /**
     * 更新报表
     */
    const handleUpdateStatus = () => {
        confirm({
            title: '确定更新？',
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
                setLoading(true);
                const { result, data } = await updateReportRDS().finally(() => {
                    setLoading(false);
                    Modal.destroyAll();
                });
                if (result) {
                    message.success('操作成功');
                    fetchReportUpdateStatus(false);
                }
            },
        });
    };

    /**
     * 获取更新时间
     * @param waiting 是否在5秒后重新请求，用于轮询
     */
    const fetchReportUpdateStatus = (waiting = false) => {
        clearTimeout(updaterTimer);
        updaterTimer = setTimeout(
            async () => {
                setUpdating(true);
                const { result, data } = await getUpdateStatus();
                if (result) {
                    setTimeout(() => {
                        setUpdating(data.status === '未完成');
                    }, 2000);
                    setUpdateTime((data.status === '已完成' ? data.modified_on : data.last_finish_time) || '');
                    data.status === '未完成' && fetchReportUpdateStatus(true);
                }
            },
            waiting ? 5000 : 0
        );
    };

    /**
     * 点击修改报表项
     * @param record 被编辑item
     */
    const handleEdit = (record: IRecordType) => {
        setEditItem(record);
        setShowEditModal(true);
    };

    /**
     * 初始化请求报表列表数据及更新时间
     */
    useEffect(() => {
        fetchMyReportList();
        fetchReportUpdateStatus(false);
    }, []);

    /**
     * 当搜索关键词变化时修改页码为1
     */
    useEffect(() => {
        setMyReportParams({ ...myReportParams, page_index: 1 });
    }, [keyword]);

    /**
     * 列表数据参数更新后就请求报表列表数据
     * 这里不需要监听keyword的改变，因为keyword改变已经引起myReportParams的改变了
     */
    useEffect(() => {
        fetchMyReportList();
    }, [myReportParams]);

    return (
        <>
            <Spin spinning={loading}>
                <Filter
                    onFilterChange={filters => {
                        setKeyword(filters?.keyword || '');
                    }}
                    rightSlot={
                        <>
                            {updateTime ? (
                                <span className="report-updating-text report-updating-tip">上次更新: {updateTime}</span>
                            ) : null}
                            {updating ? (
                                <>
                                    <LoadingOutlined style={{ color: '#248BF2', padding: '0 8px' }} />
                                    <span className="report-updating-text report-updating-tip report-updating-ing">
                                        报表刷新中…
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Button
                                        onClick={() => handleUpdateStatus()}
                                        type="link"
                                        className="f-hidden rental-report-update"
                                    >
                                        <SyncOutlined style={{ color: '#248BF2' }} spin={false} />
                                        <span className="report-updating-text report-updating-action">更新报表</span>
                                    </Button>
                                </>
                            )}
                            <Button icon={<DownloadOutlined />} onClick={handleDownload}>
                                下载报表工具
                            </Button>
                            <Button
                                type="primary"
                                ghost
                                onClick={() => setActiveTabKey('basicreport')}
                                className="f-hidden rental-report-add"
                            >
                                从报表库中添加
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => setShowEditModal(true)}
                                className="f-hidden rental-report-add"
                            >
                                添加报表
                            </Button>
                        </>
                    }
                />
                <FedTable<IRecordType>
                    vsides={false}
                    rowKey="id"
                    columns={columns}
                    dataSource={myReportDataSource}
                    scroll={{
                        y: 'calc( 100vh - 350px )',
                    }}
                />
                <FedPagination
                    onShowSizeChange={(current, page_size) => {
                        setMyReportParams({ page_index: 1, page_size });
                    }}
                    onChange={(page_index, page_size) => {
                        setMyReportParams({ page_index, page_size: page_size || 20 });
                    }}
                    current={myReportParams.page_index}
                    pageSize={myReportParams.page_size}
                    showTotal={total => `共${Math.ceil(+total / +(myReportParams.page_size || 1))}页， ${total}条记录`}
                    total={+myReportTotal}
                />
            </Spin>
            {showEditModal ? (
                <Edit onOk={data => handleOk(data)} onCancel={() => setShowEditModal(false)} detail={editItem} />
            ) : null}
        </>
    );
};
export default MyReportList;
