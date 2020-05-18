import React from 'react';
import { TreeSelect, message } from 'antd';
import { getProjectTreeData } from '@s/derate';
import cloneDeep from 'lodash/cloneDeep';
import { treeProjectSelectProps, treeProjectSelectState, treeOriginNode, treeNode } from './TreeProjectSelect';

interface callbackFn {
    (item: treeOriginNode): void;
}
class TreeProjectSelect extends React.Component<treeProjectSelectProps, treeProjectSelectState> {
    constructor(props: treeProjectSelectProps) {
        super(props);
        this.state = {
            treeData: [],
            searchValue: '',
            projIds: [],
            projNames: [],
        };
    }

    componentDidMount() {
        this.getProjectData();
    }

    componentDidUpdate() {}

    componentWillUnmount() {}

    render() {
        const { width, height, dropdownStyle } = this.props;
        const { treeData, projIds } = this.state;
        const projIdsArr = projIds ? projIds : [];
        const treeProps = {
            treeData: treeData,
            value: treeData.length > 0 ? projIdsArr : [],
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
            placeholder: '请选择项目',
            searchPlaceholder: '输入关键字查找',
            treeCheckable: true,
            treeNodeFilterProp: 'title',
        };
        return <TreeSelect {...treeProps}></TreeSelect>;
    }

    getData() {
        const { treeData } = this.state;
        const data: treeNode[] = [
            {
                title: '全部',
                value: '全部',
                key: '全部',
                isLeaf: false,
                is_end: 0,
                children: treeData,
            },
        ];
        return data;
    }

    getSelectedProjIds(value: string[]) {
        const data = this.getData();
        const projs: Array<Array<string>> = [];
        const getProjs = (item: treeOriginNode) => {
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
        projs.sort((a, b) => a - b);
        return {
            projIds: projs.map(item => item[0]),
            projNames: projs.map(item => item[1]),
        };
    }

    onTreeSelect() {}

    transferOriginTreeData(originData: treeOriginNode[]) {
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

    getProjectData() {
        getProjectTreeData({}).then(res => {
            if (!res.result) {
                message.error(res.msg);
                return;
            }
            const originData = (res.data && res.data.company) || [];
            const treeData: treeOriginNode[] = this.transferOriginTreeData(originData);
            this.setState({
                treeData,
            });
        });
    }
}

export default TreeProjectSelect;
