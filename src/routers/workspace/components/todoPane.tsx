import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Badge, Spin, Button } from 'antd';
import { LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { FedTable, FedPagination } from '@c/index';
import { getCategoryList, getCategoryStat } from '@s/workspace';
import { categoryMap, requestCodeGroup } from '../todoCategoryMaps';
import { TodoProps, category, searchParamsType } from '../list.d';
import './todoPane.less';
import { string } from 'yargs';

export const TodoPane = (props: TodoProps) => {
    const { type, projs } = props;
    const [categories, setCategories] = useState<category[]>([]); // 分类列表
    const [categoryStatMap, setCategoryStatMap] = useState({}); // 分类数据
    const [isLoadingNums, setIsLoadingNums] = useState(true); // 是否正在加载分类统计数量
    const [isUpdating, setIsUpdating] = useState(false); // 是否正在加载待办列表数据
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(false); // 是否正在加载左侧分类数据
    const [dataList, setDataList] = useState([]); // 表格数据
    const [totalNums, setTotalNums] = useState(0); // 表格数据总条数
    const [toggleUpdateCategories, setToggleUpdateCategories] = useState(false);
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
        return map;
    }, [categoryMap[type].categories]);

    // 设置所有左侧 loading
    const toggleCategoryLoading = (isLoading: boolean, cateId?: string) => {
        categories.forEach(cate => {
            if (cateId) {
                if (cateId === cate.id) {
                    cate.isLoading = isLoading;
                }
            } else {
                cate.isLoading = isLoading;
            }
        });
    };

    const toggleCategoryNum = (num: number, cateId: string) => {
        categories.forEach(cate => {
            if (cateId && cateId === cate.id) {
                cate.nums = num;
            }
        });
    };

    // 获取统计数据
    const fetchCategoryNums = () => {
        if (!projs || projs.length === 0 || categories.length === 0) {
            return;
        }
        // 分组请求接口，提高响应速度（一次性请求所有的code对应的数据，后端性能存在问题）
        const codesGroup = requestCodeGroup[type];
        if (codesGroup && codesGroup.length > 0) {
            toggleCategoryLoading(true);
            codesGroup.map((codes: string[]) => {
                getCategoryStat({
                    code: codes,
                    proj_id: projs.join(','),
                })
                    .then(res => {
                        if (res.result) {
                            // 每次数据返回，将每个的 loading 设置为 false
                            let map = {};
                            Object.assign(map, res.data || {});
                            Object.keys(map).forEach(key => {
                                toggleCategoryNum(map[key], key);
                                toggleCategoryLoading(false, key);
                            });
                            setCategories(categories.slice());
                        } else {
                            throw new Error('获取统计数据失败');
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        console.warn(codes, '获取统计数据失败');
                        toggleCategoryLoading(false);
                    });
            });
        }
    };

    // 获取左侧场景列表数据
    const fetchCategoryListData = async () => {
        setIsCategoriesLoading(true);
        const { data, result } = await getCategoryList({
            type,
        });
        if (result && data) {
            const innerCategories = data.map(
                (item: { code: string; title: string }, index: number): category => {
                    return {
                        ...categoryTableMap[item.code],
                        id: item.code,
                        name: item.title,
                        active: index === 0,
                    };
                }
            );
            setCategories(innerCategories || []);
            setToggleUpdateCategories(!toggleUpdateCategories);
        }
        setIsCategoriesLoading(false);
    };

    const activeCategory = useMemo(() => {
        const actives = categories.filter(item => item.active);
        return actives[0] ? actives[0] : categories[0];
    }, [categories]);

    useEffect(() => {
        fetchCategoryListData();
    }, [type]);

    useEffect(() => {
        fetchCategoryNums();
    }, [projs, toggleUpdateCategories]);

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
                            <span style={{ marginRight: 4 }}>{category.name}</span>
                            {category ? (
                                category.isLoading ? (
                                    <LoadingOutlined style={{ fontSize: 12 }} />
                                ) : +(category.nums || 0) > 0 ? (
                                    category.nums
                                ) : null
                            ) : null}
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
