import React from 'react';
import { Pagination, Divider } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import './index.less';

interface FedPaginationProps extends PaginationProps {
    wrapperClassName?: string;
}

const FedPagination = ({
    hideOnSinglePage = false,
    showSizeChanger = true,
    pageSizeOptions = ['10', '20', '30', '50'],
    defaultCurrent = 1,
    wrapperClassName,
    ...props
}: FedPaginationProps) => {
    return (
        <div className={`fed-pagination-container ${wrapperClassName}`}>
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
