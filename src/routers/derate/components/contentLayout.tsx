/*
 * @作者: 王靖
 * @创建日期: 2020-05-18 15:17:32
 * @最近一次修改人:   王靖
 * @最近一次修改时间: 2020-05-18 15:17:32
 * @文件说明: 页面布局组件
 */
import React from 'react';
import { Spin } from 'antd';
import './contentLayout.less';

interface contentLayoutProps {
    title: string;
    children?: JSX.Element;
    topRightSlot?: JSX.Element;
    className?: string;
    isLoading?: boolean;
}
const contentLayout = (props: contentLayoutProps) => {
    const { title, children, topRightSlot, className, isLoading = false } = props;
    return (
        <Spin spinning={isLoading} wrapperClassName="content-container-spin">
            <div className="content-container">
                <div className={`content page-container ${className}`}>
                    <div className="top-area">
                        <span className="title">{title}</span>
                        <div className="right-slot-area">{topRightSlot}</div>
                    </div>
                    <div className="content-area">{children}</div>
                </div>
            </div>
        </Spin>
    );
};

export default contentLayout;
