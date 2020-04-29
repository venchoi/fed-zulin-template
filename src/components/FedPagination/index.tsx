import React from 'react';
import { Pagination } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import './index.less';

const FedPagination = ({ ...props }: PaginationProps) => {
    return (
        <div className="fed-pagination">
            <Pagination {...props} />
            {/* slot */}
        </div>
    );
};
export default FedPagination;