import { TableProps, ColumnType } from 'antd/es/table';

export interface FedColumnType<RecordType> extends ColumnType<RecordType> {}

export interface ColumnGroupType<RecordType> extends Omit<FedColumnType<RecordType>, 'dataIndex'> {
    children: ColumnsType<RecordType>;
}

export declare type ColumnsType<RecordType = unknown> = (ColumnGroupType<RecordType> | FedColumnType<RecordType>)[];

export interface FedTableProps<RecordType> extends TableProps<RecordType> {
    columns?: ColumnsType<RecordType>;
    // 左右有边框
    vsides?: Boolean;
}

declare function FedTable<RecordType extends object = any>(props: FedTableProps<RecordType>): JSX.Element;
