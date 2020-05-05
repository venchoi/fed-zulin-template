import React from 'react';
import { Pagination, Divider } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import './index.less';

const FedPagination = ({ ...props }: PaginationProps) => {
    return (
        <div className="fed-pagination-container">
            <Divider />
            <div className="fed-pagination">
                <Pagination {...props} />
                {/* slot */}
            </div>
        </div>
    );
};
export default FedPagination;
