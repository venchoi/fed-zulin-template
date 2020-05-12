/*
 * @作者: 陈文惠
 * @创建日期: 2020-05-06 14:54:06
 * @最近一次修改人:   陈文惠
 * @最近一次修改时间: 2020-05-06 14:54:06
 * @文件说明: 统计报表 - 标准报表tab
 */

import React, { useState, useEffect } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal, message, Spin } from 'antd';
import { getBasicReportList, importReport, checkIsExit } from '../../../services/report';
import Filter from '../components/Filter';
import FedTable from '../../../components/FedTable';
import FedPagination from '../../../components/FedPagination';

// types
import { ColumnProps } from 'antd/es/table';
import IRecordType from '../types';

const { confirm } = Modal;

const StandReportList = ({ columns: propsColumns = [] }: { columns: ColumnProps<IRecordType>[] }) => {
    const [keyword, setKeyword] = useState('');
    const [basicReportParams, setBasicReportParams] = useState({
        page_index: 1,
        page_size: 20,
    });
    const [basicReportTotal, setBasicReportTotal] = useState(0);
    const [basicReportDataSource, setBasicReportDataSource] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = propsColumns.concat([
        {
            title: '操作',
            dataIndex: 'id',
            width: 194,
            render: (text, record, index) => {
                return (
                    <>
                        <Button
                            type="link"
                            onClick={() => handleAddToMyReport(record)}
                            className="f-hidden rental-report-add"
                        >
                            添加到我的报表库
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
     * 添加到“我的报表”
     * @param record 被添加到“我的报表”的项
     */
    const handleAddToMyReport = async (record: IRecordType) => {
        setLoading(true);
        const { result, data, errcode } = await checkIsExit({ id: record.id });
        setLoading(false);
        result && message.success('操作成功');
        if (errcode === 5001) {
            confirm({
                title: '报表已存在，是否覆盖？',
                icon: <ExclamationCircleOutlined />,
                onOk: async () => {
                    setLoading(true);
                    const { result } = await importReport({ id: record.id });
                    setLoading(false);
                    if (result) {
                        message.success('操作成功');
                        // TODO fetchMyReportList();
                    }
                },
            });
        }
    };

    /**
     * 获取标准报表库列表数据
     */
    const fetchBasicReportList = async () => {
        setLoading(true);
        const { result, data } = await getBasicReportList({ keyword, ...basicReportParams });
        setLoading(false);
        if (result) {
            setBasicReportDataSource(data.list);
            setBasicReportTotal(data.total);
        }
    };

    /**
     * 初始化获取列表数据
     */
    useEffect(() => {
        fetchBasicReportList();
    }, []);

    /**
     *
     */
    useEffect(() => {
        setBasicReportParams({ ...basicReportParams, page_index: 1 });
    }, [keyword]);

    /**
     * 列表数据参数更新后就请求报表列表数据
     */
    useEffect(() => {
        fetchBasicReportList();
    }, [basicReportParams]);

    return (
        <Spin spinning={loading}>
            <Filter
                onFilterChange={filters => {
                    setKeyword(filters?.keyword || '');
                }}
                rightSlot={<></>}
            />
            <FedTable<IRecordType>
                vsides={false}
                rowKey="id"
                columns={columns}
                dataSource={basicReportDataSource}
                scroll={{
                    y: 'calc( 100vh - 350px )',
                }}
            />
            <FedPagination
                onShowSizeChange={(current, page_size) => setBasicReportParams({ page_index: 1, page_size })}
                onChange={(page_index, page_size) => {
                    setBasicReportParams({
                        page_index: 1,
                        page_size: page_size || 20,
                    });
                }}
                current={basicReportParams.page_index}
                pageSize={basicReportParams.page_size}
                showTotal={total => `共${Math.ceil(+total / +(basicReportParams.page_size || 1))}页， ${total}条记录`}
                total={+basicReportTotal} /*  */
            />
        </Spin>
    );
};
export default StandReportList;
