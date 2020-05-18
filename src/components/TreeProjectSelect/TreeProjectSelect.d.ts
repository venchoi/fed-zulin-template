import { TreeSelect } from 'antd';

export type treeNode = React.FC<import('rc-tree-select/lib/TreeNode').TreeNodeProps>;
export interface treeOriginNode extends treeNode {
    value: string;
    full_name?: string;
    id: string;
    disabled?: boolean;
    is_end_company?: string | number;
    label?: string;
    level?: string | number;
    name?: string;
    parent_full_name?: string;
    parent_id?: number | string;
    parent_name?: string;
    room_num?: number | string;
    total_area?: string;
    children?: treeOriginNode;
    isLeaf?: boolean;
    is_end: number;
    title: string;
    key?: string;
}

export interface treeOriginData {
    company: Array<treeOriginNode>;
}

export interface treeProjectSelectProps {
    width?: string;
    height?: string;
    dropdownStyle?: any;
}
export interface treeProjectSelectState {
    treeData: treeNode[];
    searchValue: string;
    projIds: string[];
    projNames: string[];
}
declare class TreeProjectSelect extends React.Component<treeProjectSelectProps, treeProjectSelectState> {
    getProjectData(): void;
    transferOriginTreeData(): treeNode[];
    render(): JSX.Element;
}
