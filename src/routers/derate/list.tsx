import React, { useState, useEffect } from 'react';
import { message, Button } from 'antd';
import { connect } from 'dva';
import ContentLayout from './components/contentLayout';
import SearchArea from './components/searchArea';
import TreeProjectSelect from '@c/TreeProjectSelect';
import FedPagination from './components/pagination';
import DerateTable from './components/derateTable';
import { getDerateList } from '@s/derate';
import { getDerateListParams } from '@/types/derateTypes';
import { Props, projsValue, derateType } from './list.d';
import './list.less';

const baseAlias = 'static';
export const DerateList = (props: Props) => {
    const { user, history } = props;
    const [selectedProjectIds, setselectedProjectIds] = useState<string[]>([]); // 当前选中的项目
    const [searchParams, setsearchParams] = useState<getDerateListParams>({
        proj_id: '',
        keyword: '',
        page: 1,
        page_size: 10,
    }); // 减免列表搜索参数
    const [derateTotal, setderateTotal] = useState(0);
    const [derateList, setderateList] = useState([]); // 减免列表
    const [loading, setloading] = useState(false);
    const [selectedRowKeys, setselectedRowKeys] = useState<string[]>([]);
    const [selectedRows, setselectedRows] = useState<derateType[]>([]);

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

    const getDerateListData = () => {
        setloading(true);
        getDerateList(searchParams)
            .then(res => {
                console.log(res.data.items);
                if (!res.result) {
                    message.error(res.msg);
                    return;
                }
                if (res.data) {
                    setderateList(res.data.items || []);
                    setderateTotal(res.data.total);
                }
            })
            .finally(() => {
                setloading(false);
            });
    };

    const handleTableSelect = (selectedRowKeys: string[], selectedRows: derateType[]) => {
        console.log(selectedRowKeys);
        setselectedRows(selectedRows);
        setselectedRowKeys(selectedRowKeys);
    };

    const handleAudit = (e: React.MouseEvent) => {};

    const handleCancelSelect = () => {
        setselectedRows([]);
        setselectedRowKeys([]);
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
                    onAudit={handleAudit}
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
