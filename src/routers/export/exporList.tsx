import React, { useState, useEffect } from 'react';
import { Card, Input, Select, DatePicker } from 'antd';
import { Moment } from 'moment';
import FedTable from '@c/FedTable';
import FedPagination from '@c/FedPagination';

// types
import { ColumnProps } from 'antd/es/table';
import IExportItemType, { IExportListParams, Status, IExportCardParams, ExportType } from '@/types/export';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface IProps {
    total: number;
    dataSource: IExportItemType[];
    paramsChange: (params: IExportCardParams) => void;
}

const exportCard = ({ dataSource, paramsChange, total }: IProps) => {
    const [pagination, setPagination] = useState({
        page: 1,
        page_size: 20,
    });
    const [params, setParams] = useState({
        status: Status.DEFAULT,
        keyword: '',
        start_date: '',
        end_date: '',
    });
    const columns: ColumnProps<IExportItemType>[] = [
        {
            dataIndex: 'created_on',
            title: '导出时间',
        },
        {
            dataIndex: 'created_by',
            title: '导出人',
        },
        {
            dataIndex: 'status',
            title: '状态',
            render: text => {
                return text === Status.SUCCESS ? '成功' : text;
            },
        },
        {
            dataIndex: 'file_path',
            title: '操作',
            width: 88,
            render: text => {
                return (
                    <a href={text} target="_blank">
                        下载
                    </a>
                );
            },
        },
    ];

    const options = [
        {
            value: Status.DEFAULT,
            name: '全部状态',
        },
        {
            value: Status.SUCCESS,
            name: '成功',
        },
        {
            value: Status.FAILED,
            name: '失败',
        },
        {
            value: Status.ING,
            name: '导出中',
        },
    ];

    // 修改日期
    const onDatesChange = (dateStrings: [string, string]) => {
        handleChangeParams('start_date', dateStrings[0]);
        handleChangeParams('end_date', dateStrings[1]);
    };
    const handleChangeParams = <T extends keyof IExportListParams>(key: T, value: IExportListParams[T]) => {
        setParams(prvState => ({ ...prvState, ...{ [key]: value } }));
    };
    useEffect(() => {
        setPagination(prvState => ({ ...prvState, page: 1 }));
    }, [params]);

    useEffect(() => {
        paramsChange({ ...params, ...pagination });
    }, [pagination]);

    return (
        <Card>
            <div className="filter">
                <div className="filter-left">
                    <span className="filter-item">
                        <Search
                            placeholder="操作人"
                            style={{ width: '224px' }}
                            value={params.keyword}
                            onChange={e => handleChangeParams('keyword', e.target.value)}
                        />
                    </span>
                    <span className="filter-item">
                        <Select
                            onChange={value => handleChangeParams('status', value)}
                            placeholder="全部状态"
                            value={params.status}
                            style={{ width: '144px' }}
                        >
                            {options.map(item => {
                                return (
                                    <Option key={item.value} value={item.value}>
                                        {item.name}
                                    </Option>
                                );
                            })}
                        </Select>
                    </span>
                    <span className="filter-item">
                        <RangePicker
                            placeholder={['导出日期', '导出日期']}
                            onChange={(dates, dateStrings) => onDatesChange(dateStrings)}
                        />
                    </span>
                </div>
            </div>
            <FedTable<IExportItemType>
                dataSource={dataSource}
                columns={columns}
                vsides={false}
                scroll={{ y: 'calc(100vh - 363px)' }}
            />
            <FedPagination
                onShowSizeChange={(current, page_size) => {
                    setPagination({ page: 1, page_size });
                }}
                onChange={(page, page_size) => {
                    setPagination({ page, page_size: page_size || 20 });
                }}
                current={pagination.page}
                pageSize={pagination.page_size}
                showTotal={total => `共${Math.ceil(+total / +(pagination.page_size || 1))}页， ${total}条记录`}
                total={+total}
            />
        </Card>
    );
};
export default exportCard;
