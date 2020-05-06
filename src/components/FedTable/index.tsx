import React from 'react';
import { Table } from 'antd';
import { FedTableProps } from './FedTable';

import './index.less';

const FedTable = <RecordType extends object = any>({
    vsides = true,
    ...props
}: FedTableProps<RecordType>): JSX.Element => {
    return (
        <div className={`fed-table ${vsides ? '' : 'without-vsides'}`}>
            <Table size="small" {...props} />
        </div>
    );
};
export default FedTable;
