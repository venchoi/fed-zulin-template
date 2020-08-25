import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Badge } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import TodoPaneTable from './todoPaneTable';
import { getCategoryList, getCategoryStat } from '@s/workspace';
import { categoryMap, requestCodeGroup } from '../todoCategoryMaps';
import { TodoProps, category } from '../list.d';
import './todoPane.less';

export const TodoPane = (props: TodoProps) => {
    const { type, projs, onChange } = props;
    const [categories, setCategories] = useState<category[]>([]); // 分类列表
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(false); // 是否正在加载左侧分类数据

    const [toggleUpdateCategories, setToggleUpdateCategories] = useState(false);

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
            onChange && onChange(innerCategories && innerCategories.length > 0);
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
                                ) : category.nums && +category.nums > 0 ? (
                                    <Badge count={+category.nums} overflowCount={99} />
                                ) : null
                            ) : null}
                        </div>
                    );
                })}
            </div>
            <div className="todo-table-container">
                {activeCategory ? <TodoPaneTable activeCategory={activeCategory} projs={projs} /> : null}
            </div>
        </div>
    );
};

export default TodoPane;
