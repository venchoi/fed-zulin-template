import React, { ReactNode } from 'react';
import './FedDataSection.less';

/**
 * 数据段, 常用于详情页
 * @param { object } section 数据段 eg: { title: '基本信息', content: { ReactNode }}
 */
interface IProps {
    section: {
        title?: string | ReactNode;
        content?: string | ReactNode
    }
}
function FedDataSection(props: IProps) {
    const { section } = props;
    return (
        <div className="fed-data-section">
            {section.title ? (<div className="fed-data-section-title">{section.title}</div>) : null}
            {section.content ? (<div className="fed-data-section-content">{section.content}</div>) : null}
        </div>
    );
}

export default React.memo(FedDataSection);
