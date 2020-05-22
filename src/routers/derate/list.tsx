import React, { useState, useEffect, useCallback } from 'react';
import { message, Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import ContentLayout from './components/contentLayout';
import SearchArea from './components/searchArea';
import TreeProjectSelect from '@c/TreeProjectSelect';
import FedPagination from './components/pagination';
import DerateTable from './components/derateTable';
import { getDerateList, batchAuditDerate } from '@s/derate';
import { getDerateListParams } from '@/types/derateTypes';
import { Props, projsValue, derateType } from './list.d';
import './list.less';
const baseAlias = 'static';
const { confirm } = Modal;
export const DerateList = (props: Props) => {
    const { user, history } = props;
    const [selectedProjectIds, setselectedProjectIds] = useState<string[]>([]); // 当前选中的项目
    const [searchParams, setsearchParams] = useState<getDerateListParams>({
        proj_id: '',
        keyword: '',
        page: 1,
        page_size: 10,
        start_date: '',
        end_date: '',
    }); // 减免列表搜索参数
    const [derateTotal, setderateTotal] = useState(0);
    const [derateList, setderateList] = useState([]); // 减免列表
    const [loading, setloading] = useState(false);
    const [selectedRowKeys, setselectedRowKeys] = useState<string[]>([]);
    const [selectedRows, setselectedRows] = useState<derateType[]>([]);
    const tableSetLoading = useCallback(setloading, [setloading]);
    useEffect(() => {
        getDerateListData();
    }, [searchParams]);

    const handleTreeSelected = (selecctedProject: projsValue) => {
        setselectedProjectIds(selecctedProject.projIds);
        setsearchParams({
            ...searchParams,
            proj_id: selecctedProject.projIds.join(','),
        });
    };

    const getDerateListData = async () => {
        setloading(true);
        const { result, data } = await getDerateList(searchParams);
        if (result && data) {
            setderateList(data.items || []);
            setderateTotal(data.total);
        }
        setloading(false);
    };

    const handleTableSelect = (selectedRowKeys: string[], selectedRows: derateType[]) => {
        setselectedRows(selectedRows);
        setselectedRowKeys(selectedRowKeys);
    };

    const handleCancelSelect = () => {
        setselectedRows([]);
        setselectedRowKeys([]);
    };

    const handleBatchAudit = (e: React.MouseEvent) => {
        const ids = selectedRowKeys;
        e.stopPropagation();
        confirm({
            icon: <ExclamationCircleOutlined />,
            title: '确定审核选中的记录？',
            onOk: async () => {
                setloading(true);
                const { result, msg = '操作失败', data } = await batchAuditDerate({ ids });
                setloading(false);
                if (result) {
                    setselectedRowKeys([]);
                    getDerateListData();
                    message.success('操作成功');
                } else {
                    message.error(msg);
                }
            },
        });
    };

    return (
        <ContentLayout
            className="derate-list-page"
            title="减免管理"
            isLoading={loading}
            topRightSlot={
                <div className="project-select-area">
                    <TreeProjectSelect onTreeSelected={handleTreeSelected} width={312} />
                </div>
            }
        >
            <div>
                <SearchArea
                    selectedRowKeys={selectedRowKeys}
                    onAudit={handleBatchAudit}
                    onKeywordChange={keyword => {
                        setsearchParams({
                            ...searchParams,
                            keyword: keyword,
                        });
                    }}
                />
                <DerateTable
                    derateList={derateList}
                    derateTotal={derateTotal}
                    history={history}
                    user={user}
                    selectedRowKeys={selectedRowKeys}
                    onTableSelect={handleTableSelect}
                    projIds={selectedProjectIds}
                    setLoading={tableSetLoading}
                    getDerateListData={getDerateListData}
                    searchParams={searchParams}
                    setSearchParams={setsearchParams}
                />
                {selectedRowKeys.length > 0 ? (
                    <div className="selected-status-bar">
                        <span className="text">
                            已选：<span className="selected-num">{selectedRowKeys.length}</span>条 减免单
                        </span>
                        <Button type="link" onClick={handleCancelSelect}>
                            取消已选
                        </Button>
                    </div>
                ) : null}
                <FedPagination
                    onShowSizeChange={(current, page_size) => {
                        setsearchParams({ ...searchParams, page: 1, page_size });
                    }}
                    onChange={(page_index, page_size) => {
                        setsearchParams({ ...searchParams, page: page_index, page_size: page_size || 10 });
                    }}
                    current={searchParams.page}
                    pageSize={searchParams.page_size}
                    showTotal={total => `共${Math.ceil(+total / +(searchParams.page_size || 1))}页， ${total}条记录`}
                    total={+derateTotal}
                />
            </div>
        </ContentLayout>
    );
};

function mapStateToProps(state: any) {
    return {
        user: state.main.user,
    };
}
export default connect(mapStateToProps)(DerateList);
