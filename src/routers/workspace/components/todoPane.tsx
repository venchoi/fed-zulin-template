import React, { useEffect, useState, useMemo, MouseEvent } from 'react';
import { Badge, Spin, Button } from 'antd';
import { LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { FedTable, FedPagination } from '@c/index';
import { getCategoryList } from '@s/workspace';
import { categoryMap } from '../todoCategoryMaps';
import { TodoProps, categoryTableMapType, category, searchParamsType } from '../list.d';
import './todoPane.less';

export const TodoPane = (props: TodoProps) => {
    const { type, projs } = props;
    const [categories, setCategories] = useState<category[]>([]); // 分类列表
    // const [activeCategory, setActiveCategory] = useState({});
    const [isLoadingNums, setIsLoadingNums] = useState(true); // 是否正在加载分类统计数量
    const [isUpdating, setIsUpdating] = useState(false); // 是否正在加载待办列表数据
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(false); // 是否正在加载左侧分类数据
    const [dataList, setDataList] = useState([]); // 表格数据
    const [totalNums, setTotalNums] = useState(0); // 表格数据总条数
    const [searchParams, setsearchParams] = useState<searchParamsType>({
        proj_id: '',
        page: 1,
        page_size: 20,
        type: '',
    }); // 列表搜索参数
    const categoryTableMap = useMemo(() => {
        const map = {};
        categoryMap[type].categories.forEach(item => {
            map[item.id] = item;
        });
        console.log(map);
        return map;
    }, [categoryMap[type].categories]);

    // 获取左侧场景列表数据
    const fetchCategoryListData = async () => {
        if (!projs || projs.length <= 0) {
            return;
        }
        setIsCategoriesLoading(true);
        const { data, result } = await getCategoryList({
            type,
        });
        // setCategories(categoryMap[type].categories);
        if (result && data) {
            const categories = data.map(
                (item: { code: string; title: string }, index: number): category => {
                    return {
                        ...categoryTableMap[item.code],
                        id: item.code,
                        name: item.title,
                        active: index === 0,
                    };
                }
            );
            setCategories(categories || []);
        }
        setIsCategoriesLoading(false);
    };

    const activeCategory = useMemo(() => {
        const actives = categories.filter(item => item.active);
        return actives[0] ? actives[0] : categories[0];
    }, [categories]);

    useEffect(() => {
        fetchCategoryListData();
    }, []);

    useEffect(() => {
        fetchCategoryListData();
    }, [projs, type]);

    // 设置该类型为 active
    const handleToggleCategory = (category: category) => {
        return (e: React.MouseEvent) => {
            categories.forEach(cate => {
                cate.active = false;
            });
            category.active = true;
            setCategories(categories.slice());
        };
    };

    // 刷新列表数据
    const handleUpdateTableList = () => {
        setIsUpdating(true);
        setTimeout(() => {
            setIsUpdating(false);
        }, 1000);
    };

    return (
        <div className="workspace-todo-pane">
            <div className="todo-category-list">
                {categories.map(category => {
                    return (
                        <div
                            className={`category-item ${category.active ? 'active' : ''}`}
                            key={category.id}
                            onClick={handleToggleCategory(category)}
                        >
                            <span>{category.name}</span>
                            {isLoadingNums ? <Badge /> : <Spin></Spin>}
                        </div>
                    );
                })}
            </div>
            <div className="todo-table-container">
                {activeCategory ? (
                    <>
                        <div className="table-bar">
                            <span className="active-name">{activeCategory.name}</span>
                            {isUpdating ? (
                                <Button type="link">
                                    <LoadingOutlined style={{ color: '#248BF2', padding: '0 8px' }} spin={true} />
                                    <span className="report-updating-text report-updating-tip report-updating-ing">
                                        刷新中…
                                    </span>
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
                        <FedTable
                            vsides={false}
                            rowKey="id"
                            columns={activeCategory.columns}
                            dataSource={dataList}
                            scroll={{
                                x: 800,
                                y: 'calc( 100vh - 340px )',
                            }}
                        />
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
                            showTotal={total =>
                                `共${Math.ceil(+total / +(searchParams.page_size || 1))}页， ${total}条记录`
                            }
                            total={+totalNums}
                        />
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default TodoPane;
