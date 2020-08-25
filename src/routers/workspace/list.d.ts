import { User } from '../../types/common';
import { ColumnType } from 'antd/es/table/Column';

export interface WorkspaceIndexPageProps {
    user: User;
}

export interface category {
    name: string;
    id: string;
    nums?: number;
    active?: boolean;
    columns: ColumnType[];
    isLoading?: boolean;
}

export interface categoryMapType {
    [type: string]: {
        name: string;
        type: string;
        categories: category[];
    };
}

export interface categoryTableMapType {
    [categoryId: string]: category;
}

export interface TodoProps {
    type: string;
    projs: string[];
    onChange(hasData: boolean): void;
}

export interface searchParamsType {
    proj_id: string;
    page: number;
    page_size: number;
    code: string;
}

export interface todoPaneTableProps {
    activeCategory: category;
    projs: string[];
    code?: string;
}
