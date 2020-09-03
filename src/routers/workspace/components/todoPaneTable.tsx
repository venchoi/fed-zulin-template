import React, { useState, useEffect } from 'react';
import { Badge, Spin, Button } from 'antd';
import { LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { FedTable, FedPagination } from '@c/index';
import { getTodoListByCategory } from '@s/workspace';
import { todoPaneTableProps, searchParamsType } from '../list.d';
import { getRidrectUrl } from './todoPaneUtil';
import { ColumnProps } from 'antd/es/table';
import { formatNum, comma, checkPermission } from '@/helper/commonUtils';
import { WorkspaceTracker } from '@/track';
import { Local } from '@/MemoryShare';

export const TodoPaneTable = (props: todoPaneTableProps) => {
    const { activeCategory, projs, type, onRefresh, isUpdating, setIsUpdating } = props;
    const [tableColumns, setTableColumns] = useState([]); // antd Table 的 column
    const [dataList, setDataList] = useState([]); // 表格数据
    const [totalNums, setTotalNums] = useState(0); // 表格数据总条数
    const [searchParams, setsearchParams] = useState<searchParamsType>({
        proj_id: '',
        page: 1,
        page_size: 20,
        code: activeCategory.id || '',
        type,
    }); // 列表搜索参数

    useEffect(() => {
        let params = {
            proj_id: (projs || []).join(','),
            code: activeCategory.id || '',
            page: 1,
        };
        setsearchParams(Object.assign({}, searchParams, params));
    }, [projs, activeCategory]);

    // 跳转到具体页面操作
    const handleToOp = (record: any) => {
        const url = getRidrectUrl(activeCategory.id, record);
        // url && window.open('https://rental-ykj-test.myfuwu.com.cn'+url);
        Local && Local.set('stageType', '多项目');
        setTimeout(() => {
            url && window.open(url);
        }, 100);
    };

    // 获取表格数据
    const getTableInfo = async (isGetColumns?: boolean) => {
        if (!searchParams.proj_id) {
            return;
        }
        setIsUpdating(true);
        const { data, result } = await getTodoListByCategory(searchParams);
        if (result && data) {
            let { column = [], list = [], total = 0 } = data;
            setDataList(list);
            setTotalNums(total);
            const tableColumns = (column || []).map((column: any) => {
                const { index, name, type } = column;
                let col: ColumnProps<any> = {
                    dataIndex: index,
                    title: name,
                    ellipsis: {
                        showTitle: true,
                    },
                    align: type === 'amount' ? 'right' : 'left',
                };
                const key = index;
                if (type === 'amount') {
                    col.render = (text: string, record: any, index: number) => {
                        return comma(formatNum(record[key]));
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
                        <Button
                            type="link"
                            className="link-btn"
                            onClick={handleToOp.bind(this, record)}
                            data-event={WorkspaceTracker[`workspace-${activeCategory?.id?.replace(/_/g, '-')}`]}
                        >
                            去处理
                        </Button>
                    );
                },
            });
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
        onRefresh && onRefresh();
    };

    return (
        <>
            <div className="table-bar">
                <span className="active-name">{activeCategory.name}</span>
                {isUpdating ? (
                    <Button type="link" style={{ color: '#313233' }} disabled>
                        <LoadingOutlined spin={true} style={{ color: '#248BF2' }} />
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
                        y: 'calc( 100vh - 525px )',
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