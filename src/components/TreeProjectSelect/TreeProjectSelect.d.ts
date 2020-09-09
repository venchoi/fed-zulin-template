import { TreeSelect } from 'antd';
import { TreeNodeProps } from 'rc-tree-select/lib/TreeNode';

export type treeNode = TreeNodeProps;
export interface treeOriginNode extends treeNode {
    id: string;
    value: string;
    label: string;
    is_end: number;
    title: string;
    full_name?: string;
    disabled?: boolean;
    is_end_company?: string | number;
    level?: string | number;
    name?: string;
    parent_full_name?: string;
    parent_id?: number | string;
    parent_name?: string;
    room_num?: number | string;
    total_area?: string;
    children?: treeOriginNode[];
    isLeaf?: boolean;
    key?: string;
}

export interface treeProjectSelectProps {
    width?: number | string;
    height?: string;
    dropdownStyle?: any;
    maxTagCount?: number;
    isJustSelect?: boolean;
    isCompanySelect?: boolean;
    notInitSelect?: boolean; // 不初始展示选中值
    onTreeSelected?: (value: projsValue) => void;
    value?: string[];
    onChange?: (value: string) => void;
}
export interface treeProjectSelectState {
    treeData: treeOriginNode[];
    searchValue: string;
    projIds: string[];
    projNames: string[];
    allProjs: projsType;
    isDropdownVisible: boolean;
}

declare class TreeProjectSelect extends React.Component<treeProjectSelectProps, treeProjectSelectState> {
    getProjectData(): void;
    transferOriginTreeData(): treeNode[];
    render(): JSX.Element;
    onTreeSelect(value: string[]): projsValue;
}

export interface projsValue {
    projIds: Array<string>;
    projNames: Array<string>;
}

interface EventType extends MouseEvent {
    path?: HTMLElement[];
    target: HTMLElement;
}
