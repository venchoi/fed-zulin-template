import React from 'react';
import { Pagination, Divider } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import './index.less';

const FedPagination = ({
    hideOnSinglePage = true,
    showSizeChanger = true,
    pageSizeOptions = ['10', '20', '30', '50'],
    defaultCurrent = 1,
    ...props
}: PaginationProps) => {
    return (
        <div className="fed-pagination-container">
            <Divider />
            <div className="fed-pagination">
                <Pagination
                    hideOnSinglePage={hideOnSinglePage}
                    showSizeChanger={showSizeChanger}
                    pageSizeOptions={pageSizeOptions}
                    defaultCurrent={defaultCurrent}
                    {...props}
                />
                {/* TODO slot */}
            </div>
        </div>
    );
};
export default FedPagination;
