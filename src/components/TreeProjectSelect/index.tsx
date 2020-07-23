import React from 'react';
import { TreeSelect, message, Input } from 'antd';
import { getProjectTreeData } from '@s/derate';
import cloneDeep from 'lodash/cloneDeep';
import { Local, Cookies } from '@/MemoryShare';
import { isOutsideClick } from '@/helper/commonUtils';
import {
    treeProjectSelectProps,
    treeProjectSelectState,
    treeOriginNode,
    projsValue,
    EventType,
} from './TreeProjectSelect';
import './index.less';
interface callbackFn {
    (item: treeOriginNode): void;
}

interface projsType {
    projIds: string[];
    projNames: string[];
}

const dropdownClassName = 'multi-project-tree-select';

class TreeProjectSelect extends React.Component<treeProjectSelectProps, treeProjectSelectState> {
    constructor(props: treeProjectSelectProps) {
        super(props);
        const stageType = Local.get('stageType') || '单项目';
        let projIdsStr = stageType === '单项目' ? Cookies.get('stageId') : Local.get('stageIds');
        let projNamesStr = stageType === '单项目' ? Cookies.get('stageName') : Local.get('stageNames');
        if (props.notInitSelect) {
            projIdsStr = null;
            projNamesStr = null;
        }
        console.log(projIdsStr, 'cont')
        this.state = {
            treeData: [],
            searchValue: '',
            projIds: projIdsStr ? projIdsStr.split(',') : [],
            projNames: projNamesStr ? projNamesStr.split(',') : [],
            allProjs: {
                projIds: [],
                projNames: []
            }
        };
    }

    componentDidMount() {
        this.getProjectData(() => {
            const { projIds, allProjs } = this.state;
            if (projIds && projIds.length > 0) {
                const projIdsArr = projIds ? projIds.filter(proj => {
                    return allProjs?.projIds.indexOf(proj) >= 0
                }) : [];
                this.onTreeSelect && this.onTreeSelect(projIdsArr);
            }
        });
    }

    shouldComponentUpdate(
        nextProps: Readonly<treeProjectSelectProps>,
        nextState: Readonly<treeProjectSelectState>,
        nextContext: any
    ): boolean {
        let stateProjIds = (this.state.projIds || []).join(',');
        let nextPropsValue = nextProps.value;
        if (nextPropsValue && nextPropsValue instanceof Array) {
            nextPropsValue = nextProps.value.join(',');
        }
        if (nextPropsValue && stateProjIds !== nextPropsValue) {
            this.setState({ projIds: nextPropsValue.split(',') });
            const { onChange } = this.props;
            if (onChange) {
                onChange(nextPropsValue);
            }
            return true;
        }
        return true;
    }

    componentWillUnmount() {}

    render() {
        const { width, height, dropdownStyle, maxTagCount, ...otherProps } = this.props;
        const { projIds, searchValue, allProjs } = this.state;
        const projIdsArr = projIds ? projIds.filter(proj => {
            return allProjs?.projIds.indexOf(proj) >= 0
        }) : [];
        console.log(projIds, projIdsArr)
        const treeData = this.getData();
        const treeProps = {
            ...otherProps,
            treeData: treeData,
            value: treeData.length > 0 && treeData[0]?.children && treeData[0]?.children?.length > 0 ? projIdsArr : [],
            onChange: this.onTreeSelect,
            style: {
                width: width || 400,
                height: height,
            },
            dropdownStyle: dropdownStyle || {
                maxHeight: 400,
            },
            treeDefaultExpandAll: true,
            showSearch: true,
            onSearch: this.handleSearchInputChange,
            placeholder: '请选择项目',
            treeCheckable: true,
            treeNodeFilterProp: 'title',
            maxTagCount: maxTagCount || 1,
            searchValue,
            showArrow: true,
            onDropdownVisibleChange: this.handleDropdownVisibleChange
            // dropdownRender: this.dropdownRender,
        };
        return <TreeSelect className="fed-tree-select" {...treeProps}></TreeSelect>;
    }

    // dropdownRender = (originNode: React.ElementType, props: any) => {
    //     const { searchValue } = this.state;
    //     return (
    //         <div>
    //             <Input
    //                 placeholder="请输入"
    //                 style={{
    //                     marginLeft: '3%',
    //                     width: '94%',
    //                 }}
    //                 size="small"
    //                 value={searchValue}
    //                 onChange={this.handleSearchInputChange}
    //             />
    //             {originNode}
    //         </div>
    //     );
    // };

    handleDropdownVisibleChange = (visible: boolean) => {
        console.log(visible)
        const { projIds, allProjs } = this.state;
        if (!visible && projIds.length === 0) {
            this.setProjIds(allProjs);
            const { onTreeSelected, onChange } = this.props;
            onTreeSelected && onTreeSelected(allProjs);
            if (onChange) {
                onChange(allProjs.projIds.join(','));
            }
        }
    }

    handleSearchInputChange = (value: string) => {
        this.setState({
            searchValue: value,
        });
    };

    getData(): treeOriginNode[] {
        const treeData = this.state.treeData;
        const data = [
            {
                title: '全部',
                value: '全部',
                key: '全部',
                isLeaf: false,
                is_end: 0,
                id: '全部',
                label: '全部',
                children: treeData,
            },
        ];
        return data;
    }

    // 获取选中的项目Id
    getSelectedProjIds(value: string[]): projsValue {
        const data: treeOriginNode[] = this.getData();
        const projs: Array<Array<string>> = [];
        const getProjs = (item: treeOriginNode): void => {
            if (+item.is_end === 1) {
                projs.push([item.value, item.title]);
            } else if (+item.is_end !== 1 && Array.isArray(item.children) && item.children.length > 0) {
                item.children.forEach(getProjs);
            }
        };
        const callback: callbackFn = (item: treeOriginNode) => {
            if (value.includes(item.value)) {
                getProjs(item);
            } else if (Array.isArray(item.children) && item.children.length > 0) {
                item.children.forEach(callback);
            }
        };
        data.forEach(callback);
        projs.sort((a: any, b: any) => a - b);
        return {
            projIds: projs.map(item => item[0]),
            projNames: projs.map(item => item[1]),
        };
    }

    setProjIds(projs: projsValue) {
        const { isCompanySelect, isJustSelect } = this.props;
        const { projIds = [], projNames = [] } = projs;
        if (!isJustSelect) {
            const isShowDropdown = document.body.querySelector(`.${dropdownClassName}`);
            const projIdsStr = projIds.join(',');
            const projNamesStr = projNames.join(',');
            Local.set(isCompanySelect ? 'stageCompanyIds' : 'stageIds', projIdsStr);
            Local.set(isCompanySelect ? 'stageCompanyNames' : 'stageNames', projNamesStr);
            Local.set('stageType', '多项目');
        }
        this.setState({
            projIds: projIds,
            projNames: projNames,
        });
    }

    // 树形组件选中
    onTreeSelect = (value: string[]): void => {
        console.log('ontreeselect', value);
        const projs = this.getSelectedProjIds(value);
        this.setProjIds(projs);
        const { onTreeSelected, onChange } = this.props;
        onTreeSelected && onTreeSelected(projs);
        if (onChange) {
            onChange(projs.projIds.join(','));
        }
    };

    // 转换请求回来的项目树变成 antd 所需的 treeData 数据
    transferOriginTreeData(originData: treeOriginNode[]): treeOriginNode[] {
        const copyData = cloneDeep(originData);
        const callback = (item: treeOriginNode): void => {
            const isEnd = item.is_end ? +item.is_end === 1 : false;
            item.isLeaf = !Array.isArray(item.children) || item.children.length === 0 || isEnd;
            item.disabled = (!Array.isArray(item.children) || item.children.length === 0) && !isEnd;
            item.title = item.label;
            item.key = item.value;
            if (Array.isArray(item.children) && item.children.length > 0) {
                item.children.forEach(callback);
                item.disabled = item.children.every(item => item.disabled);
            }
        };
        copyData.forEach(callback);
        return copyData;
    }

    // 获取所有叶子节点项目
    getAllProjs(originData: treeOriginNode[]): projsType {
        const copyData = cloneDeep(originData);
        const temp: projsType = {
            projIds: [],
            projNames: []
        }
        const callback = (item: treeOriginNode): void => {
            const isEnd = item.is_end ? +item.is_end === 1 : false;
            item.isLeaf = !Array.isArray(item.children) || item.children.length === 0 || isEnd;
            item.disabled = (!Array.isArray(item.children) || item.children.length === 0) && !isEnd;
            item.title = item.label;
            item.key = item.value;
            if (item.isLeaf && !item.disabled) {
                temp.projIds.push(item.value);
                temp.projNames.push(item.label);
            }
            if (Array.isArray(item.children) && item.children.length > 0) {
                item.children.forEach(callback);
                item.disabled = item.children.every(item => item.disabled);
            }
        };
        copyData.forEach(callback);
        return temp;
    }

    // 获取原始项目树形结构数据
    getProjectData(cb: any) {
        getProjectTreeData({}).then(res => {
            if (!res.result) {
                message.error(res.msg);
                return;
            }
            const originData = (res.data && res.data.company) || [];
            const treeData = this.transferOriginTreeData(originData);
            const allProjs = this.getAllProjs(originData);
            this.setState(
                {
                    treeData,
                    allProjs
                },
                () => {
                    cb && cb();
                }
            );
        });
    }
}

export default TreeProjectSelect;
