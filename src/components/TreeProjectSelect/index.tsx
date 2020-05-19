import React from 'react';
import { TreeSelect, message } from 'antd';
import { getProjectTreeData } from '@s/derate';
import cloneDeep from 'lodash/cloneDeep';
import { Local } from '../../MemoryShare';
import { isOutsideClick } from '../../helper/commonUtils';
import {
    treeProjectSelectProps,
    treeProjectSelectState,
    treeOriginNode,
    projsValue,
    EventType,
} from './TreeProjectSelect';
interface callbackFn {
    (item: treeOriginNode): void;
}
const dropdownClassName = 'multi-project-tree-select';
class TreeProjectSelect extends React.Component<treeProjectSelectProps, treeProjectSelectState> {
    constructor(props: treeProjectSelectProps) {
        super(props);
        const projIdsStr = Local.get('stageIds');
        const projNamesStr = Local.get('stageNames');
        this.state = {
            treeData: [],
            searchValue: '',
            projIds: projIdsStr ? projIdsStr.split(',') : [],
            projNames: projNamesStr ? projNamesStr.split(',') : [],
        };
        this.onTreeSelect = this.onTreeSelect.bind(this);
    }

    componentDidMount() {
        this.getProjectData();
        document.addEventListener('click', this.handleOutsideClick, false);
    }

    componentDidUpdate() {}

    componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClick, false);
    }

    render() {
        const { width, height, dropdownStyle, maxTagCount } = this.props;
        const { treeData, projIds } = this.state;
        const projIdsArr = projIds ? projIds : [];
        const onTreeSelect = this.onTreeSelect;
        const treeProps = {
            treeData: treeData,
            value: treeData.length > 0 ? projIdsArr : [],
            onChange: onTreeSelect,
            style: {
                width: width || 400,
                height: height,
            },
            dropdownStyle: dropdownStyle || {
                maxHeight: 400,
            },
            treeDefaultExpandAll: true,
            showSearch: true,
            placeholder: '请选择项目',
            searchPlaceholder: '输入关键字查找',
            treeCheckable: true,
            treeNodeFilterProp: 'title',
            maxTagCount: maxTagCount || 1,
        };
        return <TreeSelect {...treeProps}></TreeSelect>;
    }

    handleOutsideClick(e: any) {
        const isShowDropdown = document.body.querySelector(`.${dropdownClassName}`);
        if (!isOutsideClick(e, dropdownClassName) || !isShowDropdown) {
            return;
        }
        const { value = [], isJustSelect } = this.props;
        if (!isJustSelect) {
            const { projIds = [], projNames = [] } = this.state;
            const projIdsStr = projIds.join(',');
            const projNamesStr = projNames.join(',');
            if (projIdsStr !== value.join(',')) {
                if (!projIdsStr) {
                    const projs = this.getSelectedProjIds(['全部']);
                    this.setProjIds(projs);
                    const projIdsStr = projs.projIds.join(',');
                    const projNamesStr = projs.projNames.join(',');
                    Local.set('stageIds', projIdsStr);
                    Local.set('stageNames', projNamesStr);
                } else {
                    Local.set('stageIds', projIdsStr);
                    Local.set('stageNames', projNamesStr);
                }
            }
        }
    }

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
        }
        this.setState({
            projIds: projIds,
            projNames: projNames,
        });
    }

    // 树形组件选中
    onTreeSelect(value: string[]): void {
        const projs = this.getSelectedProjIds(value);
        this.setProjIds(projs);
        const { onTreeSelected } = this.props;
        onTreeSelected && onTreeSelected(projs);
        const ele: any = document.getElementById('keywordInput');
        if (ele) {
            this.setState({
                searchValue: ele.value,
            });
        }
    }

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

    // 获取原始项目树形结构数据
    getProjectData() {
        getProjectTreeData({}).then(res => {
            if (!res.result) {
                message.error(res.msg);
                return;
            }
            const originData = (res.data && res.data.company) || [];
            const treeData = this.transferOriginTreeData(originData);
            this.setState({
                treeData,
            });
        });
    }
}

export default TreeProjectSelect;
