export interface IHeader {
    title: string;
    dataIndex?: string;
    key: string;
    sort: boolean;
    [propsName: string]: any;
}
