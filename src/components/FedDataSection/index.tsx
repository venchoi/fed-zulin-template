import React, { ReactNode } from 'react';
import './index.less';

/**
 * 数据段, 常用于详情页
 * @param { object } section 数据段 eg: { title: '基本信息', content: { ReactNode }}
 */
interface IProps {
    title?: string | ReactNode;
    showEditIcon?: ReactNode;
    extra?: ReactNode;
    children?: string | ReactNode;
}
function FedDataSection(props: IProps) {
    const { title, showEditIcon, extra, children } = props;
    return (
        <div className="fed-data-section">
            {title ? (
                <div className="fed-data-section-title">
                    {title}
                    {showEditIcon ? showEditIcon : null}
                    {extra ? <div className="fed-data-section-title-extra">{extra}</div> : null}
                </div>
            ) : null}
            {children ? <div className="fed-data-section-content">{children}</div> : null}
        </div>
    );
}

export default React.memo(FedDataSection);
