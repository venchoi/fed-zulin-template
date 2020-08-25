import React, { useState, useEffect } from 'react';
import { Badge, Spin, Button } from 'antd';
import { LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { FedTable, FedPagination } from '@c/index';
import { getTodoListByCategory } from '@s/workspace';
import { todoPaneTableProps, searchParamsType } from '../list.d';
import { getRidrectUrl } from './todoPaneUtil';
import { ColumnProps } from 'antd/es/table';
import { formatNum, comma, checkPermission } from '@/helper/commonUtils';

export const TodoPaneTable = (props: todoPaneTableProps) => {
    const { activeCategory, projs } = props;
    const [isUpdating, setIsUpdating] = useState(false); // 是否正在加载待办列表数据
    const [tableColumns, setTableColumns] = useState([]);
    const [dataList, setDataList] = useState([]); // 表格数据
    const [totalNums, setTotalNums] = useState(0); // 表格数据总条数
    const [searchParams, setsearchParams] = useState<searchParamsType>({
        proj_id: '',
        page: 1,
        page_size: 20,
        code: activeCategory.id || '',
    }); // 列表搜索参数

    useEffect(() => {
        let params = {
            proj_id: (projs || []).join(','),
            code: activeCategory.id || '',
        };
        setsearchParams(Object.assign({}, searchParams, params));
    }, [projs, activeCategory]);

    // 跳转到具体页面操作
    const handleToOp = (record: any) => {
        const url = getRidrectUrl(activeCategory.id, record);
        url && window.open(url);
    };

    // 获取表格数据
    const getTableInfo = async (isGetColumns?: boolean) => {
        setIsUpdating(true);
        console.log(searchParams);
        const { data, result } = await getTodoListByCategory(searchParams);
        if (result && data) {
            let { column = [], list = [], total = 0 } = data;
            list = [
                {
                    id: '243434',
                    code: 'AR20200429105730526',
                    contract_code: 'test',
                    name: '342423432',
                    age: 234234,
                },
            ];
            column = [
                {
                    index: 'contract_code',
                    name: '合同编号',
                    type: 'text',
                },
                {
                    index: 'name',
                    name: '名字',
                    type: 'text',
                },
                {
                    index: 'age',
                    name: '年龄',
                    type: 'amount',
                },
            ];
            total = 20;
            setDataList(list);
            setTotalNums(total);
            const tableColumns = column.map((column: any) => {
                const { index, name, type } = column;
                let col: ColumnProps<any> = {
                    dataIndex: index,
                    title: name,
                };
                if (type === 'amount') {
                    col.render = (text: string, record: any, index: number) => {
                        return comma(formatNum(record[index]));
                    };
                }
                return col;
            });
            tableColumns.push({
                title: '操作',
                key: 'action',
                fixed: 'right',
                width: 74,
                // 返回的表格字段是不确定的，所以暂时用any
                render(text: string, record: any, index: number) {
                    return (
                        <Button type="link" className="link-btn" onClick={handleToOp.bind(this, record)}>
                            去操作
                        </Button>
                    );
                },
            });
            console.log(tableColumns);
            setTableColumns(tableColumns);
        }
        setIsUpdating(false);
    };

    useEffect(() => {
        getTableInfo();
    }, [searchParams]);

    // 刷新列表数据
    const handleUpdateTableList = () => {
        searchParams.page = 1;
        setsearchParams(Object.assign({}, searchParams));
    };

    return (
        <>
            <div className="table-bar">
                <span className="active-name">{activeCategory.name}</span>
                {isUpdating ? (
                    <Button type="link" style={{ color: '#313233' }} disabled>
                        <LoadingOutlined spin={true} />
                        <span>刷新中…</span>
                    </Button>
                ) : (
                    <>
                        <Button
                            onClick={() => handleUpdateTableList()}
                            type="link"
                            className="f-hidden rental-report-update"
                        >
                            <SyncOutlined style={{ color: '#248BF2' }} spin={false} />
                            <span className="report-updating-text report-updating-action">刷新</span>
                        </Button>
                    </>
                )}
            </div>
            <Spin spinning={isUpdating} wrapperClassName="table-spin-container">
                <FedTable
                    vsides={false}
                    rowKey="id"
                    columns={tableColumns}
                    dataSource={dataList}
                    scroll={{
                        x: 800,
                        y: 'calc( 100vh - 340px )',
                    }}
                />
            </Spin>
            {dataList.length > 0 ? (
                <FedPagination
                    wrapperClassName="derate-list-pagination"
                    onShowSizeChange={(current, page_size) => {
                        setsearchParams({ ...searchParams, page: 1, page_size });
                    }}
                    onChange={(page_index, page_size) => {
                        setsearchParams({ ...searchParams, page: page_index, page_size: page_size || 10 });
                    }}
                    current={searchParams.page}
                    pageSize={searchParams.page_size}
                    showTotal={total => `共${Math.ceil(+total / +(searchParams.page_size || 1))}页， ${total}条记录`}
                    total={+totalNums}
                />
            ) : null}
        </>
    );
};

export default TodoPaneTable;
