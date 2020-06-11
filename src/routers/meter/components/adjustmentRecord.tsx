import React from 'react';
import FedTable from '@/components/FedTable';
import { IStandardPriceAdjustmentItem, Status } from '@t/meter';
import { ColumnProps } from 'antd/lib/table';
import { Badge, Button } from 'antd';
import { find } from 'lodash';
import { statusItem } from '../config';
import { Link } from 'dva/router';
const AdjustmentRecord = () => {
    // const columns: ColumnProps<IStandardPriceAdjustmentItem>[] = [{
    //   title: '序号',
    //   width: 50,
    //   dataIndex: 'number',
    //   render: (text, record, index) => index + 1,
    //   align: 'center'
    // }, {
    //   title: '生效时间',
    //   dataIndex: 'start_date',
    //   render: (text, rowData) => {
    //     return <>{text}{rowData.end_date ? ` 至 ${rowData.end_date}` : ''}</>
    //   }
    // }, {
    //   title: '调整单价',
    //   dataIndex: 'price',
    //   render: (text, rowData) => {
    //     return (<>{text}{rowData.unit}/月</>)
    //   }
    // }, {
    //   title: '状态',
    //   dataIndex: 'number',
    //   render: (text: Status) => {
    //     return <Badge color={find(statusItem, ['title', text])?.color} text={text} />;
    // },
    // }, {
    //   title: '提交时间',
    //   dataIndex: 'created_on',
    // }, {
    //   title: '操作',
    //   dataIndex: 'id',
    //   render: (text, rowData) => {
    //     return (<>
    //       <Link to={`/meter/detail-adjust/${rowData.id}`}>
    //         调整详情
    //       </Link>
    //     </>)
    //   }
    // }]
    return <>{/* <FedTable /> */}</>;
};
export default AdjustmentRecord;
