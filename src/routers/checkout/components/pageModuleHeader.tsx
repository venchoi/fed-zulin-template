import React from 'react';
import './PageModuleHeader.less';

interface IPageModuleHeader {
    title: string;
}
const PageModuleHeader = ({ title }: IPageModuleHeader) => {
    return (
        <>
            <div className="checkout-page-module-header">{title}</div>
        </>
    );
};

export default PageModuleHeader;
